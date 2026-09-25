import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function ProblemChild() {
  throw new Error('Test crash');
}

test('renders fallback UI when child component throws', () => {
  // Suppress console.error in test output
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  render(
    <ErrorBoundary>
      <ProblemChild />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByText('Refresh without clearing data')).toBeInTheDocument();
  expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  
  spy.mockRestore();
});

test('renders children normally when there is no error', () => {
  render(
    <ErrorBoundary>
      <div>Safe child content</div>
    </ErrorBoundary>
  );

  expect(screen.getByText('Safe child content')).toBeInTheDocument();
});
