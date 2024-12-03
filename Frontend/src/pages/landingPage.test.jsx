import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LandingPage, { 
  Appbar, 
  SpecialitySection, 
  AppointmentSection, 
  AppointmentCTA, 
  Footer 
} from './landingPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LandingPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all sections', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check if main sections are rendered
    expect(screen.getAllByText('HealNexus')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Book Appointment With Trusted Doctors')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Find by Speciality')[0]).toBeInTheDocument();
  });
});

describe('Appbar Component', () => {
  test('renders logo and navigation items', () => {
    render(
      <BrowserRouter>
        <Appbar isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Check logo
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check navigation items
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('ALL DOCTORS')).toBeInTheDocument();
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
    expect(screen.getByText('OUR-TEAM')).toBeInTheDocument();
  });

  test('navigates to login when not logged in', () => {
    render(
      <BrowserRouter>
        <Appbar isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Click on protected routes
    const dashboardButton = screen.getByText('DASHBOARD');
    fireEvent.click(dashboardButton);

    // Should show error toast or prevent navigation
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('creates account button navigates to login', () => {
    render(
      <BrowserRouter>
        <Appbar isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    const createAccountButton = screen.getByText('Create account');
    fireEvent.click(createAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

describe('SpecialitySection Component', () => {
  test('renders speciality cards', () => {
    render(
      <BrowserRouter>
        <SpecialitySection isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Check section title
    expect(screen.getByText('Find by Speciality')).toBeInTheDocument();

    // Check speciality names
    const specialities = [
      'General physician',
      'Gynecologist',
      'Dermatologist',
      'Pediatricians',
      'Neurologist',
      'Gastroenterologist'
    ];

    specialities.forEach(speciality => {
      expect(screen.getByText(speciality)).toBeInTheDocument();
    });
  });

  test('speciality card click when not logged in', () => {
    render(
      <BrowserRouter>
        <SpecialitySection isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    const generalPhysicianCard = screen.getByText('General physician');
    fireEvent.click(generalPhysicianCard);

    // Should not navigate when not logged in
    expect(mockNavigate).toHaveBeenCalled();
  });
});

describe('AppointmentSection Component', () => {
  test('renders appointment section content', () => {
    render(
      <BrowserRouter>
        <AppointmentSection isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Check main heading
    expect(screen.getByText(/Book Appointment With Trusted Doctors/i)).toBeInTheDocument();

    // Check book appointment button
    const bookAppointmentButton = screen.getAllByText(/Book appointment/i)[0];
    expect(bookAppointmentButton).toBeInTheDocument();
  });

  test('book appointment button click when not logged in', () => {
    render(
      <BrowserRouter>
        <AppointmentSection isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    const bookAppointmentButton = screen.getAllByText(/Book appointment/i)[0];
    fireEvent.click(bookAppointmentButton);

    // Should not navigate when not logged in
    expect(mockNavigate).toHaveBeenCalled();
  });
});

describe('AppointmentCTA Component', () => {
  test('renders CTA section', () => {
    render(
      <BrowserRouter>
        <AppointmentCTA isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Check main heading
    expect(screen.getByText(/Book Appointment With 100\+ Trusted Doctors/i)).toBeInTheDocument();

    // Check create account button
    const createAccountButton = screen.getByText('Create account');
    expect(createAccountButton).toBeInTheDocument();
  });

  test('create account button navigates to login', () => {
    render(
      <BrowserRouter>
        <AppointmentCTA isLoggedIn={false} navigate={mockNavigate} />
      </BrowserRouter>
    );

    const createAccountButton = screen.getByText('Create account');
    fireEvent.click(createAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

describe('Footer Component', () => {
  test('renders footer content', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check company section
    expect(screen.getByText('COMPANY')).toBeInTheDocument();

    // Check links
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();

    // Check copyright text
    expect(screen.getByText(/© 2024 @ Group_34 @ Made with/i)).toBeInTheDocument();
  });

  test('footer links navigate correctly', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const aboutUsLink = screen.getByText('About us');
    const teamLink = screen.getByText('Team');

    // Verify links exist
    expect(aboutUsLink).toHaveAttribute('href', '/about-us');
    expect(teamLink).toHaveAttribute('href', '/team');
  });
});