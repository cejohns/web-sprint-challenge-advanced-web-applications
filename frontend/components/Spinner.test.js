import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner'; // Adjust the import path as necessary

describe('Spinner Component', () => {
  test('should not be rendered when "on" prop is false', () => {
    render(<Spinner on={false} />);
    const spinnerElement = screen.queryByTestId('spinner');
    expect(spinnerElement).toBeNull();
  });

  
});
