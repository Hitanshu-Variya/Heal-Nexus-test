import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashBoard, { Appbar } from './dashBoard'; // Adjust the import path as necessary
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock the axios module
jest.mock('axios');

describe('DashBoard Component', () => {
  beforeEach(() => {
    // Mock the axios get request to return user data
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { userName: 'John Doe' },
    });

    render(
      <MemoryRouter>
        <DashBoard />
      </MemoryRouter>
    );
  });

  test('renders the dashboard and fetches user details', async () => {
    // Check if the user name is rendered
    await waitFor(() => {
      expect(screen.getByText(/Welcome John Doe to Heal Nexus!/i)).toBeInTheDocument();
    });

    // Check if other sections are present
    expect(screen.getByText(/Consult top doctors online for all types of health problems/i)).toBeInTheDocument();
    expect(screen.getByText(/Book an appointment for an in-clinic consultation/i)).toBeInTheDocument();
  });

  test('handles logout functionality', async () => {
    // Mock the axios post request for logout
    axios.post.mockResolvedValueOnce({ status: 200 });

    // Find the logout button and click it
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Verify that the user is redirected to the home page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/'); // Assuming '/' is the home route
    });
  });

  test('navigates to My Appointments', async () => {
    const myAppointmentsButton = screen.getByText(/MyAppointments/i);
    fireEvent.click(myAppointmentsButton);

    // Verify that the navigation to My Appointments occurred
    await waitFor(() => {
      expect(window.location.pathname).toBe('/my-appointments'); // Adjust the path as necessary
    });
  });

  test('navigates to My Profile', async () => {
    const profileButton = screen.getByTestId('pbutton');
    fireEvent.click(profileButton);

    // Verify that the navigation to My Profile occurred
    await waitFor(() => {
      expect(window.location.pathname).toBe('/'); // Adjust the path as necessary
    });
  });
});