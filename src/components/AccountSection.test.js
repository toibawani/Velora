import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountSection from './AccountSection';
import { BackendError } from '../backend/errors';
import { getSessionUser, onAuthChange, sendMagicLink, signOut } from '../backend/api';

// A build with a backend configured. The disabled build is its own file,
// because `backendEnabled` is read once at import time and mocking it twice in
// one module is how a test ends up asserting on the wrong build.
jest.mock('../backend/supabaseClient', () => ({ backendEnabled: true }));
jest.mock('../backend/api');

beforeEach(() => {
  jest.clearAllMocks();
  getSessionUser.mockResolvedValue(null);
  onAuthChange.mockReturnValue(() => {});
});

test('asks for an address and never for a password', async () => {
  render(<AccountSection />);
  expect(await screen.findByLabelText('Email address')).toHaveAttribute('type', 'email');
  expect(screen.getByRole('button', { name: /send me a sign-in link/i })).toBeInTheDocument();
  expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/create account/i)).not.toBeInTheDocument();
});

test('sends the link to what was typed and says where it went', async () => {
  sendMagicLink.mockResolvedValue(undefined);
  render(<AccountSection />);
  const field = await screen.findByLabelText('Email address');

  fireEvent.change(field, { target: { value: 'sam@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /send me a sign-in link/i }));

  await waitFor(() => expect(sendMagicLink).toHaveBeenCalledWith('sam@example.com'));
  expect(await screen.findByText(/a sign-in link is on its way to sam@example.com/i)).toBeInTheDocument();
});

test('prints the backend message as text, not a raw error', async () => {
  sendMagicLink.mockRejectedValue(
    new BackendError('offline', 'You look offline. Everything is still saved on this device.'),
  );
  render(<AccountSection />);
  const field = await screen.findByLabelText('Email address');

  fireEvent.change(field, { target: { value: 'sam@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /send me a sign-in link/i }));

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('You look offline. Everything is still saved on this device.');
  // Nothing from the internals of the error object leaks onto the screen.
  expect(alert.textContent).not.toMatch(/BackendError|code:|stack/i);
});

test('shows the signed-in address and can sign out', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  signOut.mockResolvedValue(undefined);

  render(<AccountSection />);
  expect(await screen.findByText(/signed in as sam@example.com/i)).toBeInTheDocument();
  expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^sign out$/i }));

  await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
  expect(await screen.findByLabelText('Email address')).toBeInTheDocument();
});

test('a failed sign out is reported and does not pretend to be signed out', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  signOut.mockRejectedValue(new BackendError('unknown', 'Something went wrong. Try again.'));

  render(<AccountSection />);
  await screen.findByText(/signed in as sam@example.com/i);
  fireEvent.click(screen.getByRole('button', { name: /^sign out$/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong. Try again.');
  expect(screen.getByText(/signed in as sam@example.com/i)).toBeInTheDocument();
});
