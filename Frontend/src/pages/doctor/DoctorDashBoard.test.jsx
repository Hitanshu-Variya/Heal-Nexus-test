// DoctorDashBoard.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DoctorDashBoard } from './DoctorDashBoard.jsx'; // Ensure this path is correct
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

jest.mock('axios');

describe('DoctorDashBoard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls before each test
  });

  // test('fetches and displays total appointments and earnings', async () => {
  //   const mockResponse = {
  //     allAppointmentsData: [
  //       { patientData: { userName: 'John Doe', image: 'http://example.com/image.jpg' }, appointmentData: { slotDate: '15_10_2023' } },
  //       { patientData: { userName: 'Jane Smith', image: 'http://example.com/image2.jpg' }, appointmentData: { slotDate: '16_10_2023' } },
  //     ],
  //     totalAmount: 200,
  //   };

  //   // Mock the API response
  //   axios.get.mockResolvedValueOnce({ status: 200, data: mockResponse });

  //   render(
  //     <MemoryRouter>
  //       <DoctorDashBoard />
  //     </MemoryRouter>
  //   );

  //   // Wait for the API call to complete and the component to re-render
  //   await waitFor(() => {
  //     expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_SERVER_URL}/patient/appointments`, {
  //       withCredentials: true,
  //     });
  //   });

  //   // Check if total earnings and appointments are displayed correctly
  //   expect(screen.getByText(/Total Earnings/i)).toBeInTheDocument();
  //   expect(screen.getByText(/200/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Pending Appointments/i)).toBeInTheDocument();
  //   expect(screen.getByText(/2/i)).toBeInTheDocument(); // Since we have 2 appointments

  //   // Check if latest appointments are displayed
  //   expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  //   expect(screen.getByText(/15 Oct 2023/i)).toBeInTheDocument();
  //   expect(screen.getByText(/16 Oct 2023/i)).toBeInTheDocument();
  // });

  test('handles error in fetching appointments', async () => {
    // Mock the API response to simulate an error
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <DoctorDashBoard />
      </MemoryRouter>
    );

    // Wait for the error handling to take effect (you might want to have some error state in your component)
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      // You can add more assertions here if you have an error message displayed
    });
  });

  // test('formats the appointment date correctly', () => {
  //   const formattedDate = DoctorDashBoard.prototype.formatDate('15_10_2023');
  //   expect(formattedDate).toBe('15 Oct 2023');
  // });
});