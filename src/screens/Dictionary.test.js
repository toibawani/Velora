import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dictionary from './Dictionary';

describe('Curious Dictionary', () => {
  test('renders top-level Curious Dictionary with cross-subject terms', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    expect(screen.getByText('Curious Dictionary')).toBeInTheDocument();
    expect(screen.getByText('Momentum')).toBeInTheDocument();
    expect(screen.getByText('Epistemology')).toBeInTheDocument();
  });

  test('filters by cross-subject search query', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    const searchInput = screen.getByLabelText(/search across all subjects/i);
    fireEvent.change(searchInput, { target: { value: 'momentum' } });

    expect(screen.getByText('Momentum')).toBeInTheDocument();
    expect(screen.queryByText('Epistemology')).not.toBeInTheDocument();
  });

  test('filters by subject pill selection', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    const philosophyBtn = screen.getByRole('button', { name: /philosophy/i });
    fireEvent.click(philosophyBtn);

    expect(screen.getByText('Epistemology')).toBeInTheDocument();
    expect(screen.queryByText('Momentum')).not.toBeInTheDocument();
  });
});

describe('Curious Dictionary A-Z index', () => {
  test('says how many entries each letter holds, so a click is predictable', () => {
    render(<Dictionary setScreen={() => {}} />);

    // The bar advertises a count on every letter that has entries.
    const withCount = screen.getAllByTitle(/\d+ under/);
    expect(withCount.length).toBeGreaterThan(5);
    expect(screen.getByTitle('No terms under Q')).toBeDisabled();
  });

  test('narrows the list to one letter and reports the new count', () => {
    render(<Dictionary setScreen={() => {}} />);

    const before = screen.getByText(/entries$/).textContent;
    fireEvent.click(screen.getByRole('button', { name: /Jump to P, \d+ terms?/ }));

    const after = screen.getByText(/entries$/).textContent;
    expect(after).not.toBe(before);
    expect(after).toMatch(/^\d+ entries$/);
  });

  test('returns to the full list when All is pressed', () => {
    render(<Dictionary setScreen={() => {}} />);
    const before = screen.getByText(/entries$/).textContent;

    fireEvent.click(screen.getByRole('button', { name: /Jump to P, \d+ terms?/ }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByText(/entries$/).textContent).toBe(before);
  });

  test('the letter counts follow the subject filter', () => {
    render(<Dictionary setScreen={() => {}} />);

    const allCount = screen.getByTitle(/under P/).textContent;
    fireEvent.click(screen.getByRole('button', { name: /Economics/ }));

    const econCount = screen.getByTitle(/under P/).textContent;
    expect(econCount).not.toBe(allCount);
  });

  test('every entry is listed alphabetically within the current filter', () => {
    render(<Dictionary setScreen={() => {}} />);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    const sorted = [...headings].sort((a, b) => a.localeCompare(b));
    expect(headings).toEqual(sorted);
  });
});
