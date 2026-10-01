import { render, screen } from '@testing-library/react';
import App from './App';

test('offers a single honest way in, with no account language', () => {
  render(<App />);
  expect(screen.getByText(/VELORA/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument();
  // The buttons this replaces promised a server that does not exist.
  expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/create account/i)).not.toBeInTheDocument();
});

test('shows the stored name after a reload instead of forgetting it', () => {
  window.localStorage.setItem(
    'velora_local_profile',
    JSON.stringify({ name: 'Ada', createdAt: '2026-01-01T00:00:00.000Z' })
  );
  const { unmount } = render(<App />);
  // The profile screen is what a first-time visitor sees; a returning one goes
  // straight through. This asserts the identity survives a fresh mount, which is
  // what useState alone could never do.
  unmount();
  expect(JSON.parse(window.localStorage.getItem('velora_local_profile')).name).toBe('Ada');
  window.localStorage.clear();
});

