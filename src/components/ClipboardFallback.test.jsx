import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareAchievementModal from './ShareAchievementModal';

// These used to run against CertificateModal, which is gone. It was the only
// importer of that component, so the clipboard behaviour it had been fixed
// for had no remaining coverage at all. The behaviour is now tested against
// the modal that actually ships, and directly in utils/clipboard.test.js.

const setClipboard = (value) => {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true, writable: true });
};

describe('Copy buttons when the clipboard is unavailable', () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
  });

  const open = () =>
    render(<ShareAchievementModal isOpen onClose={() => {}} milestone="Concept Check" />);

  test('does not claim success with no clipboard API', async () => {
    setClipboard(undefined);
    open();

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        /would not let this page use the clipboard/i
      )
    );
    expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
  });

  test('does not claim success when the write is rejected', async () => {
    setClipboard({ writeText: jest.fn().mockRejectedValue(new Error('denied')) });
    open();

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    expect(screen.queryByText(/caption copied/i)).not.toBeInTheDocument();
  });

  test('does report success when the write works', async () => {
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });
    open();

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => expect(screen.getByText(/caption copied/i)).toBeInTheDocument());
  });
});
