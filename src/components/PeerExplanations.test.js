import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PeerExplanations from './PeerExplanations';

describe('PeerExplanations', () => {
  beforeEach(() => localStorage.clear());

  test('shows inline guidance instead of an alert for a short explanation', () => {
    const onNotify = jest.fn();
    render(<PeerExplanations topic="Stoicism" onNotify={onNotify} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /share anonymously/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/add a little more detail/i);
    expect(onNotify).not.toHaveBeenCalled();
  });

  test('stores and publishes a valid explanation', () => {
    const onNotify = jest.fn();
    render(<PeerExplanations topic="Stoicism" onNotify={onNotify} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Stoicism helps us separate our choices from outcomes.' } });
    fireEvent.click(screen.getByRole('button', { name: /share anonymously/i }));
    expect(screen.getByText(/Stoicism helps us separate/)).toBeInTheDocument();
    expect(onNotify).toHaveBeenCalledWith(expect.stringContaining('part of the conversation'), 'success');
  });
});
