import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AboutUs from './AboutUs';
import '@testing-library/jest-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AboutUs Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);

    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
  });

  test('renders the About Us header', () => {
    const headerElement = screen.getByText(/About Heal Nexus/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the about us description', () => {
    const descriptionElement = screen.getByText(/Heal Nexus is a comprehensive platform designed to simplify healthcare access. It allows patients to compare and select healthcare providers, manage appointments, and utilize a wide range of medical services. The platform enhances the patient experience with features like appointment booking, specialist search, medicine orders, report generation, and secure payment processing./i);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders the key features section', () => {
    const keyFeaturesHeader = (screen.getAllByText(/Key Features of Heal Nexus/i))[0];
    expect(keyFeaturesHeader).toBeInTheDocument();

    const keyFeaturesList = [
      "Login & Registration",
      "Search Specialists",
      "Book Appointments",
      "Provide Reviews",
      "Order Medicine",
      "Manage Appointments",
      "Prescription Management",
      "Manage Users & Specialists",
      "Emergency Services",
      "Report Generation",
      "Payment System"
    ];

    keyFeaturesList.forEach(feature => {
      const featureElement = (screen.getAllByText(new RegExp(feature, 'i')))[0];
      expect(featureElement).toBeInTheDocument();
    });
  });

  test('renders the Go Back button', () => {
    const buttonElement = screen.getByRole('button', { name: /Go Back to Home Page/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('navigates to home page when Go Back button is clicked', () => {
    const buttonElement = screen.getByRole('button', { name: /Go Back to Home Page/i });
    fireEvent.click(buttonElement);
    expect(mockNavigate).toHaveBeenCalledWith('/'); 
  });
});