import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import MyProfile from './MyProfile';
import axios from 'axios';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

// Mock the axios module
jest.mock('axios');

describe('MyProfile Component', () => {
  const mockUserData = {
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    contactNumber: '123-456-7890',
    email: 'john.doe@example.com',
    medicalHistory: ['No known allergies'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Sister',
      contactNumber: '098-765-4321',
    },
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
    image: 'profile.jpg',
  };

  beforeEach(() => {
    // Mock the axios get request to return user data
    axios.get.mockResolvedValueOnce({ status: 200, data: mockUserData });
    render(
      <MemoryRouter>
        <MyProfile />
        <ToastContainer /> {/* Include ToastContainer for toasts */}
      </MemoryRouter>
    );

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.error
    console.error.mockRestore();
  });

//   test('renders user profile data', async () => {
//     // Wait for the user data to be rendered
//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//       expect(screen.getByText(/Age: 30/i)).toBeInTheDocument();
//       expect(screen.getByText(/Email: john.doe@example.com/i)).toBeInTheDocument();
//       expect(screen.getByText(/Phone:/i)).toBeInTheDocument();
//       expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();
//       expect(screen.getByText(/Emergency Contact/i)).toBeInTheDocument();
//       expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
//     });
//   });

  test('allows user to edit profile', async () => {
    // Wait for the user data to be rendered
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Edit Profile/i));
    });

    // Check if the input fields are displayed for editing
    expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/123-456-7890/i)).toBeInTheDocument();

    // Simulate changing the name and contact number
    fireEvent.change(screen.getByDisplayValue(/John Doe/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByDisplayValue(/123-456-7890/i), { target: { value: '321-654-0987' } });

    // Mock the axios put request to simulate a successful update
    axios.put.mockResolvedValueOnce({ status: 200 });

    // Simulate saving changes
    fireEvent.click(screen.getByText(/Save Changes/i));

    // Check if the success message is displayed in the toast
    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully!/i)).toBeInTheDocument();
    });
  });

  test('cancels editing and reverts to display mode', async () => {
    // Wait for the user data to be rendered
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Edit Profile/i));
    });

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText(/Cancel/i));

    // Check if the input fields are not displayed and the original data is shown
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(/John Doe/i)).not.toBeInTheDocument();
  });

//   test('handles errors during profile update', async () => {
//     // Wait for the user data to be rendered
//     await waitFor(() => {
//       fireEvent.click(screen.getByText(/Edit Profile/i));
//     });

//     // Mock the axios put request to simulate an error
//     axios.put.mockRejectedValueOnce(new Error('Update failed'));

//     // Simulate saving changes
//     fireEvent.click(screen.getByText(/Save Changes/i));

//     // Check if the error message is displayed in the toast
//     await waitFor(() => {
//       expect(screen.getByText((content, element) => 
//         content.startsWith('Update failed') || content.includes('Update failed')
//       )).toBeInTheDocument();
//     });
//   });
});