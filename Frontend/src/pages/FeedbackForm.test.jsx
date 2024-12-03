import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackForm from './FeedbackForm';
import '@testing-library/jest-dom';

describe('FeedbackForm', () => {
  beforeEach(() => {
    render(<FeedbackForm />);
  });

  test('renders feedback form with rating and textarea', () => {
    // Check if the rating header is in the document
    expect(screen.getByText(/Rate your experience/i)).toBeInTheDocument();
    
    // Check if the stars are rendered
    const stars = screen.getAllByText('★');
    expect(stars.length).toBe(5); // There should be 5 stars
    stars.forEach(star => {
      expect(star).toBeInTheDocument();
    });

    // Check if the textarea is rendered
    expect(screen.getByPlaceholderText(/Tell us about your experience!/i)).toBeInTheDocument();
    
    // Check if the send button is rendered
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  test('allows user to select a rating', () => {
    const stars = screen.getAllByText('★');
    
    // Simulate clicking on the third star
    fireEvent.click(stars[2]);
    
    // Check if the third star is selected
    expect(stars[2]).toHaveClass('selected');
    
    // Ensure previous stars are also selected
    expect(stars[0]).toHaveClass('selected');
    expect(stars[1]).toHaveClass('selected');
  });

  test('allows user to enter feedback and submit', () => {
    const feedbackTextarea = screen.getByPlaceholderText(/Tell us about your experience!/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // Enter feedback
    fireEvent.change(feedbackTextarea, { target: { value: 'Great service!' } });
    expect(feedbackTextarea.value).toBe('Great service!');

    // Simulate clicking the send button
    fireEvent.click(sendButton);

    // Check if the alert is called with the correct message (you might need to mock window.alert)
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(sendButton);
    expect(window.alert).toHaveBeenCalledWith('Thank you for your feedback!');

    // Clean up the alert mock
    window.alert.mockRestore();
  });
});