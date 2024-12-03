// DoctorAllAppointments.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DoctorAllAppointments } from './DoctorAllAppointments.jsx'; // Ensure this path is correct
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

jest.mock('axios');

describe('DoctorAllAppointments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls before each test
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <DoctorAllAppointments />
      </MemoryRouter>
    );

    expect(screen.getByText(/All Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/No appointments available./i)).toBeInTheDocument();
  });

//   test('fetches and displays appointments', async () => {
//     const mockAppointments = [
//       {
//         patientData: {
//           userName: 'John Doe',
//           age: 30,
//           image: 'http://example.com/image.jpg',
//         },
//         appointmentData: {
//           slotDate: '15_10_2023',
//           slotTime: '10:00 AM',
//           amount: 50,
//         },
//       },
//       {
//         patientData: {
//           userName: 'Jane Smith',
//           age: 25,
//           image: null,
//         },
//         appointmentData: {
//           slotDate: '16_10_2023',
//           slotTime: '11:00 AM',
//           amount: 75,
//         },
//       },
//     ];

//     // Mock the API response
//     axios.get.mockResolvedValueOnce({
//       status: 200,
//       data: { allAppointmentsData: mockAppointments },
//     });

//     render(
//       <MemoryRouter>
//         <DoctorAllAppointments />
//       </MemoryRouter>
//     );

//     // Wait for the API call to complete and the component to re-render
//     await waitFor(() => {
//       expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_SERVER_URL}/patient/appointments`, {
//         withCredentials: true,
//       });
//     });

//     // Instead of looking for rows, look for the appointment items directly
//     const appointmentItems = screen.getAllByText(/Doe|Smith|[0-9]+/i); // Match patient names and ages

//     // Check if the appointments are displayed correctly
//     expect(appointmentItems).toHaveLength(6); // 2 names + 2 ages + 2 dates

//     expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
//     expect(screen.getByText(/30/i)).toBeInTheDocument();
//     expect(screen.getByText(/25/i)).toBeInTheDocument();
//     expect(screen.getByText(/15 Oct 2023/i)).toBeInTheDocument();
//     expect(screen.getByText(/10:00 AM/i)).toBeInTheDocument();
//     expect(screen.getByText(/\$50/i)).toBeInTheDocument();
//     expect(screen.getByText(/16 Oct 2023/i)).toBeInTheDocument();
//     expect(screen.getByText(/11:00 AM/i)).toBeInTheDocument();
//     expect(screen.getByText(/\$75/i)).toBeInTheDocument();
//   });

  test('displays no appointments message when there are no appointments', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { allAppointmentsData: [] },
    });

    render(
      <MemoryRouter>
        <DoctorAllAppointments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_SERVER_URL}/patient/appointments`, {
        withCredentials: true,
      });
    });

    expect(screen.getByText(/No appointments available./i)).toBeInTheDocument();
  });

  test('handles error when fetching appointments', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <DoctorAllAppointments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_SERVER_URL}/patient/appointments`, {
        withCredentials: true,
      });
    });

    // Check for console error or any error message handling if implemented
    // In this case, we are not checking the console error as it is not displayed in the UI
  });
});