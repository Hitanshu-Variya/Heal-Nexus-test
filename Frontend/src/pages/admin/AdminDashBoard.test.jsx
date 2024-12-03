// src/pages/admin/AdminDashBoard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashBoard from './AdminDashBoard.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('AdminDashBoard Component', () => {
    const mock = new MockAdapter(axios);
    const dashboardMock = {
        dashboardData: {
            doctors: 10,
            appointments: 25,
            users: 100,
            labTechnicians: 5,
            pharmacists: 3,
        },
        detailedAppointments: [
            {
                doctorimage: 'path/to/doctor1.png',
                doctorName: 'Dr. John Doe',
                slotDate: '01_01_2023',
            },
            {
                doctorimage: 'path/to/doctor2.png',
                doctorName: 'Dr. Jane Smith',
                slotDate: '02_01_2023',
            },
        ],
    };

    beforeEach(() => {
        mock.reset();
    });

    test('renders dashboard data correctly', async () => {
        // Mock the API call to match the component's request
        mock.onGet(`${process.env.VITE_SERVER_URL}/admin/dashboard`).reply(200, dashboardMock);

        render(
            <MemoryRouter>
                <AdminDashBoard />
            </MemoryRouter>
        );

        // Check if the dashboard metrics are rendered
        expect(await screen.findByText('10')).toBeTruthy(); // Doctors
        expect(await screen.findByText('25')).toBeTruthy(); // Appointments
        expect(await screen.findByText('100')).toBeTruthy(); // Patients
        expect(await screen.findByText('5')).toBeTruthy(); // Lab Assistants
        expect(await screen.findByText('3')).toBeTruthy(); // Pathologists
    });

    test('renders latest bookings correctly', async () => {
        // Mock the API call to match the component's request
        mock.onGet(`${process.env.VITE_SERVER_URL}/admin/dashboard`).reply(200, dashboardMock);

        render(
            <MemoryRouter>
                <AdminDashBoard />
            </MemoryRouter>
        );

        // Check if the latest bookings are rendered
        const johnDoe = await screen.findByText('Dr. John Doe');
        const janeSmith = await screen.findByText('Dr. Jane Smith');
        expect(johnDoe).toBeTruthy();
        expect(janeSmith).toBeTruthy();

        // Check the formatted date
        expect(await screen.findByText('01 Jan 2023')).toBeTruthy();
        expect(await screen.findByText('02 Jan 2023')).toBeTruthy();
    });
});