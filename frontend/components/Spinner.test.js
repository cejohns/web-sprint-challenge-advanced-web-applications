import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner'; // Adjust the import path as necessary

describe('Spinner Component', () => {
  test('renders spinner when "on" prop is true', () => {
    render(<Spinner on={true} />);
    const spinnerElement = screen.getByTestId('spinner'); // We'll need to adjust the Spinner component to include 'data-testid' attribute
    expect(spinnerElement).toBeInTheDocument();
  });

  test('does not render spinner when "on" prop is false', () => {
    render(<Spinner on={false} />);
    const spinnerElement = screen.queryByTestId('spinner');
    expect(spinnerElement).not.toBeInTheDocument();
  });
});
