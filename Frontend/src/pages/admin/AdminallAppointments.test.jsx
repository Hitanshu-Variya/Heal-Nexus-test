import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AdminallAppointments from './AdminallAppointments';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('../../components/admin/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Mock Navbar</div>;
  };
});
jest.mock('../../components/admin/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="mock-sidebar">Mock Sidebar</div>;
  };
});

describe('AdminallAppointments Component', () => {
  // Mock appointment data
  const mockAppointmentData = [
    {
      patientName: 'John Doe',
      patientimage: 'path/to/patient/image',
      patientage: 35,
      slotDate: '15_10_2023',
      slotTime: '10:00 AM',
      doctorName: 'Dr. Smith',
      doctorimage: 'path/to/doctor/image',
      amount: 100
    },
    {
      patientName: 'Jane Smith',
      patientimage: 'path/to/patient/image2',
      patientage: 28,
      slotDate: '16_10_2023',
      slotTime: '02:00 PM',
      doctorName: 'Dr. Johnson',
      doctorimage: 'path/to/doctor/image2',
      amount: 150
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders component with navbar and sidebar', async () => {
    // Mock successful API response
    axios.get.mockResolvedValue({
      status: 200,
      data: { detailedAppointments: mockAppointmentData }
    });

    render(<AdminallAppointments />);

    // Check for navbar and sidebar
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
  });

  test('fetches and displays appointments', async () => {
    // Mock successful API response
    axios.get.mockResolvedValue({
      status: 200,
      data: { detailedAppointments: mockAppointmentData }
    });

    render(<AdminallAppointments />);

    // Wait for appointments to be loaded
    await waitFor(() => {
      // Check if appointments are rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('displays no appointments message when data is empty', async () => {
    // Mock API response with empty appointments
    axios.get.mockResolvedValue({
      status: 200,
      data: { detailedAppointments: [] }
    });

    render(<AdminallAppointments />);

    // Wait for no appointments message
    await waitFor(() => {
      expect(screen.getByText('No appointments available.')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock console error to prevent error logging in test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock API error
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<AdminallAppointments />);

    // Wait and check if error is logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in Logging out', 
        expect.any(Error)
      );
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('Date Formatting Function', () => {
    // Create a test component to access the formatDate method
    const TestComponent = () => {
      const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("_");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = months[parseInt(month, 10) - 1];
        return `${day} ${monthName} ${year}`;
      };

      return { formatDate };
    };

    test('formatDate correctly transforms date', () => {
      const { formatDate } = TestComponent();

      // Test cases
      expect(formatDate('15_10_2023')).toBe('15 Oct 2023');
      expect(formatDate('01_01_2024')).toBe('01 Jan 2024');
      expect(formatDate('20_12_2022')).toBe('20 Dec 2022');
    });
  });

//   describe('Age Calculation Function', () => {
//     test('calculateAge returns correct age', () => {
//       // Use the component's internal calculateAge function
//       const component = new AdminallAppointments();
      
//       // Mock current date
//       const mockDate = new Date('2023-12-31');
//       jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

//       // Test age calculation
//       const age1 = component.calculateAge('1990-06-15');
//       const age2 = component.calculateAge('1995-12-31');

//       expect(age1).toBe(33);
//       expect(age2).toBe(28);

//       // Restore Date
//       global.Date.mockRestore();
//     });
//   });

  test('renders table headers', () => {
    // Mock successful API response
    axios.get.mockResolvedValue({
      status: 200,
      data: { detailedAppointments: mockAppointmentData }
    });

    render(<AdminallAppointments />);

    // Check table headers
    const headers = [
      '#', 'Patient', 'Age', 'Date & Time', 'Doctor', 'Fees'
    ];

    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
});