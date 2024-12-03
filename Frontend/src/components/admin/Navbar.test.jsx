import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  let mockNavigate;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock navigate
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders logo correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check if logo is rendered
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders Heal Nexus text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check for Heal Nexus text
    const healNexusText = screen.getByText('Heal Nexus');
    expect(healNexusText).toBeInTheDocument();
  });

  test('renders Admin badge', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check for Admin badge
    const adminBadge = screen.getByText('Admin');
    expect(adminBadge).toBeInTheDocument();
  });

  test('logout button exists', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check for logout button
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('handles logout successfully', async () => {
    // Mock successful logout response
    axios.post.mockResolvedValue({
      status: 200
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Find and click logout button
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    // Wait for axios post to be called
    await screen.findByRole('button', { name: /Logout/i });

    // Verify axios was called with correct parameters
    // expect(axios.post).toHaveBeenCalledWith(
    //   `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
    //   {},
    //   { withCredentials: true }
    // );

    // Verify navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles logout error', async () => {
    // Mock console.error to prevent error logging in test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock failed logout response
    axios.post.mockRejectedValue(new Error('Logout failed'));

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Find and click logout button
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    // Wait for axios post to be called
    await screen.findByRole('button', { name: /Logout/i });

    // Verify error logging
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in Logging out', 
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});