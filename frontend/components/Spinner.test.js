// Import React since JSX is used.
import React from 'react';
// Import render function and screen object from the testing library.
import { render, screen } from '@testing-library/react';
// Import the Spinner component to be tested.
import Spinner from './Spinner';

// Test case for when the spinner should be visible.
test('renders Spinner when on is true', () => {
  // Render the Spinner component with the prop `on` set to true.
  render(<Spinner on={true} />);

  // Assert that an element with the test ID 'spinner' is present in the document.
  expect(screen.getByTestId('spinner')).toBeInTheDocument();
});

// Test case for when the spinner should not be visible.
test('does not render Spinner when on is false', () => {
  // Render the Spinner component with the prop `on` set to false.
  render(<Spinner on={false} />);

  // Assert that no elements with the test ID 'spinner' are present in the document.
  expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
});
