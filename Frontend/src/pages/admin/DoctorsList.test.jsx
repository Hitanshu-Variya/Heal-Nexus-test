// src/components/Consult/DoctorList.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DoctorsList from './DoctorsList.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('DoctorList Component', () => {
    const mock = new MockAdapter(axios);
    const doctorsMock = {
        doctorData: [
            {
                userData: { userName: 'Dr. John Doe' },
                specialty: 'Cardiology',
                experience: 10,
                fee: 500,
                rating: 95,
                image: 'path/to/image1.png',
            },
            {
                userData: { userName: 'Dr. Jane Smith' },
                specialty: 'Dermatology',
                experience: 8,
                fee: 600,
                rating: 90,
                image: 'path/to/image2.png',
            },
        ],
    };

    beforeEach(() => {
        mock.reset();
    });

    test('renders the doctor list correctly', async () => {
        // Mock the API call to match the component's request
        mock.onGet(`${process.env.VITE_SERVER_URL}/admin/get-verified-doctors`).reply(200, doctorsMock);

        render(
            <MemoryRouter>
                <DoctorsList />
            </MemoryRouter>
        );

        // Check if the doctor names are rendered
        const johnDoe = await screen.findByText('Dr. John Doe');
        const janeSmith = await screen.findByText('Dr. Jane Smith');
        expect(johnDoe).toBeTruthy();
        expect(janeSmith).toBeTruthy();
    });

    test('displays doctor experience, fee, and rating', async () => {
        // Mock the API call to match the component's request
        mock.onGet(`${process.env.VITE_SERVER_URL}/admin/get-verified-doctors`).reply(200, doctorsMock);

        render(
            <MemoryRouter>
                <DoctorsList />
            </MemoryRouter>
        );

        // Check experience, fee, and rating for the first doctor
        const johnExperience = await screen.findByText('10 years experience');
        const johnFee = await screen.findByText('₹500 Consultation fee');
        const johnRating = await screen.findByText('95% Patient Satisfaction');

        expect(johnExperience).toBeTruthy();
        expect(johnFee).toBeTruthy();
        expect(johnRating).toBeTruthy();

        // Check experience, fee, and rating for the second doctor
        const janeExperience = await screen.findByText('8 years experience');
        const janeFee = await screen.findByText('₹600 Consultation fee');
        const janeRating = await screen.findByText('90% Patient Satisfaction');

        expect(janeExperience).toBeTruthy();
        expect(janeFee).toBeTruthy();
        expect(janeRating).toBeTruthy();
    });
});