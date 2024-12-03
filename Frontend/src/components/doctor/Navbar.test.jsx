import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders Navbar with logo and title', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for logo
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check for title
    expect(screen.getByText('Heal Nexus')).toBeInTheDocument();
    expect(screen.getByText('Doctor')).toBeInTheDocument();
  });

  describe('Doctor Name Fetching', () => {
    test('fetches doctor name on component mount', async () => {
      // Mock axios get request
      axios.get.mockResolvedValue({
        status: 200,
        data: { userName: 'Dr. John Doe' }
      });

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      // Wait for doctor name to be displayed
      await waitFor(() => {
        expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
      });

      // Verify axios call
      expect(axios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_SERVER_URL}/patient/get-doctor-name`,
        { withCredentials: true }
      );
    });

    test('handles error when fetching doctor name', async () => {
      // Mock console.error to prevent error logging in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock axios to throw an error
      axios.get.mockRejectedValue(new Error('Fetch error'));

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error in Logging out', 
          expect.any(Error)
        );
      });

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Logout Functionality', () => {
    // test('logout button calls axios post and navigates on success', async () => {
    //   // Mock navigate function
    //   const mockNavigate = jest.fn();
    //   require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    //   // Mock axios post request
    //   axios.post.mockResolvedValue({
    //     status: 200
    //   });

    //   render(
    //     <MemoryRouter>
    //       <Navbar />
    //     </MemoryRouter>
    //   );

    //   // Find and click logout button
    //   const logoutButton = screen.getByText('Logout');
    //   fireEvent.click(logoutButton);

    //   // Wait for axios post and navigation
    //   await waitFor(() => {
    //     expect(axios.post).toHaveBeenCalledWith(
    //       `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
    //       { withCredentials: true }
    //     );
    //     expect(mockNavigate).toHaveBeenCalledWith('/');
    //   });
    // });

    test('handles logout error', async () => {
      // Mock console.error to prevent error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock axios to throw an error
      axios.post.mockRejectedValue(new Error('Logout failed'));

      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      // Find and click logout button
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error in Logging out', 
          expect.any(Error)
        );
      });

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  test('renders doctor icon', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for doctor icon
    const doctorIcon = screen.getByAltText('Profile');
    expect(doctorIcon).toBeInTheDocument();
    expect(doctorIcon).toHaveClass('w-10 h-10 rounded-full');
  });
});