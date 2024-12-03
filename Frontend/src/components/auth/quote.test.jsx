// src/components/Auth/Quote.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { Quote } from './quote.auth'; // Adjust the import path as necessary

describe('Quote Component', () => {
  test('renders the quote and author correctly', () => {
    const { getByText } = render(<Quote />);
    
    // Check for the quote text
    const quoteText = getByText(/The customer service I received was exceptional/i);
    expect(quoteText).toBeTruthy(); // Check if the quote text is found

    // Check for the author's name
    const authorName = getByText(/Julis Winfield/i);
    expect(authorName).toBeTruthy(); // Check if the author's name is found

    // Check for the author's title - Adjust to match the rendered text
    const authorTitle = getByText(/CEO,Acme Inc/i); // Match exactly as rendered
    expect(authorTitle).toBeTruthy(); // Check if the author's title is found
  });
});