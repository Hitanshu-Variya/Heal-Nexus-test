import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UnverifiedDoctor from './VerifyDoctor.jsx'; // Ensure this path is correct
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('UnverifiedDoctor Component', () => {
    const mock = new MockAdapter(axios);
    const unverifiedDoctorsMock = [
        {
            _id: '1',
            image: 'doctor1.jpg',
            userData: { userName: 'John Doe', email: 'john@example.com' },
            contactNumber: '1234567890',
            specialty: 'Cardiology',
            qualifications: 'MD',
            experience: '10 years',
            consultationFee: '100',
            clinicAddress: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                country: 'USA',
                postalCode: '12345'
            },
            biography: 'Experienced cardiologist.'
        },
        {
            _id: '2',
            image: 'doctor2.jpg',
            userData: { userName: 'Jane Smith', email: 'jane@example.com' },
            contactNumber: '0987654321',
            specialty: 'Dermatology',
            qualifications: 'MD',
            experience: '8 years',
            consultationFee: '150',
            clinicAddress: {
                street: '456 Elm St',
                city: 'Othertown',
                state: 'CA',
                country: 'USA',
                postalCode: '54321'
            },
            biography: 'Skilled dermatologist.'
        }
    ];

    beforeEach(() => {
        mock.onGet(`${process.env.VITE_SERVER_URL}/admin/get-unverified-doctors`).reply(200, { doctorData: unverifiedDoctorsMock });
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders unverified doctors list', async () => {
        render(
            <MemoryRouter>
                <UnverifiedDoctor />
            </MemoryRouter>
        );

        // Check if the doctor names are rendered
        expect(await screen.findByText(/John Doe/i)).toBeTruthy();
        expect(await screen.findByText(/Jane Smith/i)).toBeTruthy();
    });

    test('displays doctor profile when clicking on Checkout button', async () => {
        render(
            <MemoryRouter>
                <UnverifiedDoctor />
            </MemoryRouter>
        );

        // Click on the Checkout button for the first doctor (John Doe)
        const checkoutButtons = await screen.findAllByRole('button', { name: /Checkout/i });
        fireEvent.click(checkoutButtons[0]); // Click the first Checkout button

        // Check if the doctor profile information is displayed
        expect(await screen.findByText(/Doctor Profile/i)).toBeTruthy();
        expect(screen.getByText(/John Doe/i)).toBeTruthy();
        expect(screen.getByText(/john@example.com/i)).toBeTruthy();
        expect(screen.getByText(/Cardiology/i)).toBeTruthy();
    });

    test('verifies a doctor', async () => {
        render(
            <MemoryRouter>
                <UnverifiedDoctor />
            </MemoryRouter>
        );

        // Click on the Checkout button for the first doctor (John Doe)
        const checkoutButtons = await screen.findAllByRole('button', { name: /Checkout/i });
        fireEvent.click(checkoutButtons[0]); // Click the first Checkout button

        // Click on the Approve button
        fireEvent.click(screen.getByText(/Approve/i));

        // Check if the doctor profile is closed
        await waitFor(() => {
            expect(screen.queryByText(/Doctor Profile/i)).toBeNull();
        });
    });

    test('rejects a doctor', async () => {
        render(
            <MemoryRouter>
                <UnverifiedDoctor />
            </MemoryRouter>
        );

        // Click on the Checkout button for the first doctor (John Doe)
        const checkoutButtons = await screen.findAllByRole('button', { name: /Checkout/i });
        fireEvent.click(checkoutButtons[0]); // Click the first Checkout button

        // Click on the Reject button
        fireEvent.click(screen.getByText(/Reject/i));

        // Check if the doctor profile is closed
        await waitFor(() => {
            expect(screen.queryByText(/Doctor Profile/i)).toBeNull();
        });
    });
});