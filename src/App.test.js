import { render, screen } from '@testing-library/react';
import App from './App';

test('renders VELORA splash screen with core actions', () => {
  render(<App />);
  const brandElement = screen.getByText(/VELORA/i);
  expect(brandElement).toBeInTheDocument();
  expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  expect(screen.getByText(/Create account/i)).toBeInTheDocument();
});
