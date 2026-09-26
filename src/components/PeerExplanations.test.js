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

describe('PeerExplanations with damaged stored data', () => {
  beforeEach(() => localStorage.clear());

  const store = (payload) => {
    localStorage.setItem('velora_explanations_stoicism', payload);
  };

  test('keeps the good rows and drops the ones with broken vote counts', () => {
    // `votes: {}` and `votes: { clear: 'lots' }` both passed the old check,
    // because any truthy value did. Every counter then rendered NaN and the
    // sort comparator returned NaN, so the list order went strange.
    store(JSON.stringify([
      { id: 1, text: 'Stoicism is the practice of separating what is in our control.', votes: {} },
      { id: 2, text: 'We control our judgements and not our outcomes.', votes: { clear: 'lots', funny: 3, mindBending: null } },
      { id: 3, text: 'The obstacle becomes the way, as Marcus Aurelius put it.', votes: { clear: 4, funny: 0, mindBending: 1 } },
    ]));

    render(<PeerExplanations topic="Stoicism" />);

    expect(screen.getByText(/obstacle becomes the way/)).toBeInTheDocument();
    expect(screen.queryByText(/practice of separating what is in our control/)).not.toBeInTheDocument();
    expect(screen.queryByText(/We control our judgements/)).not.toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });

  test('every counter is a number, never NaN or undefined', () => {
    store(JSON.stringify([
      { id: 1, text: 'A missing counter should be treated as zero, not NaN.', votes: { clear: 2 } },
    ]));

    const { container } = render(<PeerExplanations topic="Stoicism" />);
    const counts = Array.from(container.querySelectorAll('.vote-count')).map((node) => node.textContent);
    expect(counts.length).toBeGreaterThan(0);
    counts.forEach((value) => expect(Number.isFinite(Number(value))).toBe(true));
  });

  test('falls back to the starter explanations when nothing usable is stored', () => {
    store(JSON.stringify({ not: 'an array' }));

    render(<PeerExplanations topic="Stoicism" />);
    expect(screen.getByText(/rubber sheet/)).toBeInTheDocument();
  });

  test('survives corrupt JSON entirely', () => {
    store('{this is not json at all');

    render(<PeerExplanations topic="Stoicism" />);
    expect(screen.getByText(/rubber sheet/)).toBeInTheDocument();
  });

  test('renders a hostile stored explanation as visible text, never as markup', () => {
    store(JSON.stringify([
      { id: 1, text: '<img src=x onerror="window.__pwned=1">look at this', votes: { clear: 1, funny: 0, mindBending: 0 } },
    ]));

    render(<PeerExplanations topic="Stoicism" />);

    expect(window.__pwned).toBeUndefined();
    expect(document.querySelector('img[src="x"]')).toBeNull();
    expect(screen.getByText(/look at this/)).toBeInTheDocument();
  });

  test('one person cannot post the same explanation twice by mashing the button', () => {
    render(<PeerExplanations topic="Stoicism" />);
    const box = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share anonymously/i });

    fireEvent.change(box, { target: { value: 'Stoicism asks what is actually in our control.' } });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getAllByText(/Stoicism asks what is actually in our control/)).toHaveLength(1);
  });

  test('a rejected attempt leaves the box usable for the next one', () => {
    render(<PeerExplanations topic="Stoicism" />);
    const box = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share anonymously/i });

    fireEvent.change(box, { target: { value: 'too short' } });
    fireEvent.click(button);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(box, { target: { value: 'Control the judgement, not the outcome.' } });
    fireEvent.click(button);
    expect(screen.getByText(/Control the judgement/)).toBeInTheDocument();
  });
});
