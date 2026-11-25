import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PeerExplanations from './PeerExplanations';
import { BackendError } from '../backend/errors';
import {
  fetchApprovedExplanations,
  getSessionUser,
  onAuthChange,
  reportExplanation,
  submitExplanation,
} from '../backend/api';

// A build with an account available. The local-only build is covered by the
// neighbouring test file, which runs with no backend configured.
jest.mock('../backend/supabaseClient', () => ({ backendEnabled: true, supabase: null }));
jest.mock('../backend/api');

const approvedRow = {
  id: 'e1',
  body: 'Entropy is a count of the arrangements a system can be in.',
  created_at: '2026-11-01T10:00:00.000Z',
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  getSessionUser.mockResolvedValue(null);
  onAuthChange.mockReturnValue(() => {});
  fetchApprovedExplanations.mockResolvedValue([]);
  submitExplanation.mockResolvedValue(undefined);
  reportExplanation.mockResolvedValue(undefined);
});

const renderBoard = (props = {}) =>
  render(<PeerExplanations topic="Entropy" topicId="physics:entropy" {...props} />);

test('says No explanations yet when the reviewed list is empty', async () => {
  renderBoard();
  expect(await screen.findByText('No explanations yet')).toBeInTheDocument();
});

test('shows a reviewed explanation as text, never as markup', async () => {
  fetchApprovedExplanations.mockResolvedValue([
    { ...approvedRow, body: '<img src=x onerror="window.__pwned=1">Entropy counts arrangements.' },
  ]);
  renderBoard();

  expect(await screen.findByText(/Entropy counts arrangements/)).toBeInTheDocument();
  // The tag is characters on the screen, not an element in the document.
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(window.__pwned).toBeUndefined();
});

test('asks the server for the reviewed list under the stable topic id', async () => {
  renderBoard();
  await waitFor(() => expect(fetchApprovedExplanations).toHaveBeenCalledWith('physics:entropy'));
});

test('signed out, it offers no way to submit and says where to sign in', async () => {
  renderBoard();
  await screen.findByText('No explanations yet');
  expect(screen.queryByRole('button', { name: /submit for review/i })).not.toBeInTheDocument();
  expect(screen.getByText(/sign in from settings to submit an answer/i)).toBeInTheDocument();
});

test('signed in, submitting says pending review and never says it is published', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  renderBoard();

  const button = await screen.findByRole('button', { name: /submit for review/i });
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Entropy is the number of ways the parts can be arranged.' },
  });
  fireEvent.click(button);

  await waitFor(() =>
    expect(submitExplanation).toHaveBeenCalledWith(
      'physics:entropy',
      'Entropy is the number of ways the parts can be arranged.',
    ),
  );
  expect(await screen.findByText(/pending review/i)).toBeInTheDocument();
  // The reviewed list is not touched by a pending submission.
  expect(screen.getByText('No explanations yet')).toBeInTheDocument();
});

test('a too-short answer is refused before a request is made', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  renderBoard();
  const button = await screen.findByRole('button', { name: /submit for review/i });

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'too short' } });
  fireEvent.click(button);

  expect(await screen.findByRole('alert')).toHaveTextContent(/at least 20 characters/i);
  expect(submitExplanation).not.toHaveBeenCalled();
});

test('the real rate-limit message is shown, not a generic failure', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  submitExplanation.mockRejectedValue(
    new BackendError('rate_limited', 'You have posted a lot in the last hour. Try again later.'),
  );
  renderBoard();

  const button = await screen.findByRole('button', { name: /submit for review/i });
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Entropy is the number of ways the parts can be arranged.' },
  });
  fireEvent.click(button);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'You have posted a lot in the last hour. Try again later.',
  );
});

test('reporting a reviewed explanation sends the id and the reason', async () => {
  getSessionUser.mockResolvedValue({ id: 'u1', email: 'sam@example.com' });
  fetchApprovedExplanations.mockResolvedValue([approvedRow]);
  renderBoard();

  fireEvent.click(await screen.findByRole('button', { name: /^report$/i }));
  fireEvent.change(screen.getByLabelText('Why report this?'), {
    target: { value: 'This is about a different topic' },
  });
  fireEvent.click(screen.getByRole('button', { name: /send report/i }));

  await waitFor(() =>
    expect(reportExplanation).toHaveBeenCalledWith('e1', 'This is about a different topic'),
  );
  expect(await screen.findByText(/that report is queued for review/i)).toBeInTheDocument();
});

test('a failed load is reported with a retry that refetches', async () => {
  fetchApprovedExplanations.mockRejectedValueOnce(
    new BackendError('offline', 'You look offline. Everything is still saved on this device.'),
  );
  renderBoard();

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'You look offline. Everything is still saved on this device.',
  );

  fetchApprovedExplanations.mockResolvedValue([approvedRow]);
  fireEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(await screen.findByText(/Entropy is a count of the arrangements/)).toBeInTheDocument();
});
