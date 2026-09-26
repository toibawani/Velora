import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CertificateModal from './CertificateModal';
import ShareAchievementModal from './ShareAchievementModal';

describe('Copy buttons when the clipboard is unavailable', () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: originalClipboard, configurable: true, writable: true });
  });

  const setClipboard = (value) => {
    Object.defineProperty(navigator, 'clipboard', { value, configurable: true, writable: true });
  };

  test('the certificate copy button does not claim success with no clipboard API', async () => {
    setClipboard(undefined);
    render(<CertificateModal isOpen userName="Ada" />);

    fireEvent.click(screen.getByRole('button', { name: /copy verification url/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/would not let the page use the clipboard/i));
    expect(screen.queryByText(/link copied/i)).not.toBeInTheDocument();
    // The URL is on screen so it can still be copied by hand.
    expect(screen.getByText(/velora\.app\/verify/)).toBeInTheDocument();
  });

  test('the certificate copy button does not claim success when the write is rejected', async () => {
    setClipboard({ writeText: jest.fn().mockRejectedValue(new Error('denied')) });
    render(<CertificateModal isOpen userName="Ada" />);

    fireEvent.click(screen.getByRole('button', { name: /copy verification url/i }));

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    expect(screen.queryByText(/link copied/i)).not.toBeInTheDocument();
  });

  test('the certificate copy button does report success when the write works', async () => {
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });
    render(<CertificateModal isOpen userName="Ada" />);

    fireEvent.click(screen.getByRole('button', { name: /copy verification url/i }));

    await waitFor(() => expect(screen.getByText(/link copied/i)).toBeInTheDocument());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('the share caption button tells the truth too', async () => {
    setClipboard(undefined);
    render(<ShareAchievementModal isOpen />);

    fireEvent.click(screen.getByRole('button', { name: /copy text for instagram/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/would not let this page use the clipboard/i));
    expect(screen.queryByText(/caption copied/i)).not.toBeInTheDocument();
  });
});
