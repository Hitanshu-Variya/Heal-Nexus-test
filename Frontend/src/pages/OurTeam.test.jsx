import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import OurTeam from './OurTeam';
import '@testing-library/jest-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('OurTeam Component', () => {
  const mockNavigate = jest.fn(); 

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate); 

    render(
      <BrowserRouter>
        <OurTeam />
      </BrowserRouter>
    );
  });

  test('renders the team header', () => {
    const headerElement = screen.getByText(/Our Team/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders all team members', () => {
    const teamMembers = [
      "Shail Patel",
      "Aditya Raina",
      "Dharmi Patel",
      "Malay Sidapara",
      "Harshit Prajapati",
      "Mihir Patel",
      "Zeel Danani",
      "Hitanshu Varia",
      "Ayush Chaudhari",
      "Prof. Saurabh Tiwary"
    ];

    teamMembers.forEach(member => {
      const memberElement = screen.getByText(member);
      expect(memberElement).toBeInTheDocument();
    });
  });

  test('renders the correct number of team members', () => {
    const teamCards = screen.getAllByRole('heading', { level: 3 });
    expect(teamCards.length).toBe(10); 
  });

  test('renders the Go Back button', () => {
    const buttonElement = screen.getByRole('button', { name: /Go to Home/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('navigates to home page when Go Back button is clicked', () => {
    const buttonElement = screen.getByRole('button', { name: /Go to Home/i });
    fireEvent.click(buttonElement);
    expect(mockNavigate).toHaveBeenCalledWith('/'); 
  });
});