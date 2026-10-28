import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dictionary from './Dictionary';
import { CURIOUS_TERMS, verifiedTermCount } from '../data/dictionary';

describe('Curious Dictionary', () => {
  test('renders top-level Curious Dictionary with cross-subject terms', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    expect(screen.getByText('Curious Dictionary')).toBeInTheDocument();
    expect(screen.getByText('Momentum')).toBeInTheDocument();
    expect(screen.getByText('Epistemology')).toBeInTheDocument();
  });

  test('states how many entries were read back against their source', () => {
    render(<Dictionary setScreen={() => {}} />);

    // The size of the dictionary is not the same claim as its accuracy. This
    // screen used to show only the size, and an unmarked entry looked exactly
    // like a checked one inside the list.
    expect(
      screen.getByText(`${verifiedTermCount} of ${CURIOUS_TERMS.length} checked against source`)
    ).toBeInTheDocument();
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

    // Every letter that once held nothing now has entries behind it: the bar
    // renders all 26 either way, so an empty letter is a permanently dead
    // filter. This asserts the fix rather than a hardcoded letter, so filling
    // one more later does not need the test rewritten.
    // queryAllBy, not getAllBy: getAllBy throws when nothing matches, which
    // would make this test fail for the wrong reason.
    const empty = screen.queryAllByTitle(/No terms under/);
    expect(empty).toHaveLength(0);
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

/*
 * The search box was only reachable by scrolling to the top and clicking it,
 * which on a 138-entry list is the one thing you do most.
 */
describe('the / shortcut', () => {
  test('puts the cursor in the search box', () => {
    render(<Dictionary setScreen={() => {}} />);

    const input = screen.getByLabelText(/search across all subjects/i);
    expect(input).not.toHaveFocus();

    fireEvent.keyDown(document.body, { key: '/' });
    expect(input).toHaveFocus();
  });

  test('does not steal a slash typed into the search box', () => {
    render(<Dictionary setScreen={() => {}} />);
    const input = screen.getByLabelText(/search across all subjects/i);
    input.focus();

    // A slash is a legitimate character in a query ("S/Z ratio"), and
    // preventDefault here would make it impossible to type one.
    const event = new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true });
    fireEvent(input, event);
    expect(event.defaultPrevented).toBe(false);
  });

  test('leaves other keys alone', () => {
    render(<Dictionary setScreen={() => {}} />);
    const input = screen.getByLabelText(/search across all subjects/i);

    fireEvent.keyDown(document.body, { key: 'k' });
    expect(input).not.toHaveFocus();
  });

  test('the shortcut is advertised while the box is empty only', () => {
    render(<Dictionary setScreen={() => {}} />);
    expect(screen.getByText('/', { selector: 'kbd' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search across all subjects/i), {
      target: { value: 'entropy' },
    });
    expect(screen.queryByText('/', { selector: 'kbd' })).toBeNull();
  });
});

/*
 * The list had exactly one order, alphabetical, and no way to read a new
 * subject quickly or to see what the dictionary covers.
 */
describe('ordering the entries', () => {
  const terms = () => screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
  const choose = (label) => fireEvent.change(screen.getByLabelText('Order'), { target: { value: label } });

  test('alphabetical is the order you land on', () => {
    render(<Dictionary setScreen={() => {}} />);
    const shown = terms();
    expect(shown).toEqual([...shown].sort((a, b) => a.localeCompare(b)));
  });

  test('Z to A reverses it', () => {
    render(<Dictionary setScreen={() => {}} />);
    const az = terms();
    choose('za');
    expect(terms()).toEqual([...az].reverse());
  });

  test('by subject groups every entry under one subject before the next', () => {
    render(<Dictionary setScreen={() => {}} />);
    choose('subject');

    const subjects = screen.getAllByTestId('entry-subject').map((node) => node.textContent);
    expect(subjects).toEqual([...subjects].sort((a, b) => a.localeCompare(b)));
    // And it really did group rather than merely allow a sorted reading.
    const runs = subjects.filter((subject, i) => subject !== subjects[i - 1]);
    expect(new Set(runs).size).toBe(runs.length);
  });

  test('shortest first starts with the shortest explanation', () => {
    render(<Dictionary setScreen={() => {}} />);
    choose('shortest');

    // Read the explanations off the data and compare against what is shown, so
    // the test describes the rule and not one particular entry.
    const byLength = [...CURIOUS_TERMS].sort(
      (a, b) => (a.explanation || '').length - (b.explanation || '').length || a.term.localeCompare(b.term)
    );
    const shown = terms();
    expect(shown[0]).toBe(byLength[0].term);
    expect(shown[1]).toBe(byLength[1].term);
  });

  test('changing the order does not change which entries are listed', () => {
    render(<Dictionary setScreen={() => {}} />);
    const count = screen.getByText(/entries$/).textContent;
    const before = terms().slice().sort();

    choose('shortest');

    expect(screen.getByText(/entries$/).textContent).toBe(count);
    expect(terms().slice().sort()).toEqual(before);
  });
});

test('an entry with no verification mark says it is unchecked', () => {
  render(<Dictionary setScreen={jest.fn()} />);

  fireEvent.change(screen.getByLabelText(/search across all subjects/i), {
    target: { value: 'Conservation of Momentum' },
  });

  // Three entries carry verified: true. The rest carry no flag at all, and an
  // absent flag used to render exactly like a checked entry, because only an
  // explicit false showed the warning.
  expect(screen.getByText('not checked yet')).toBeInTheDocument();
});

test('a checked entry carries no warning', () => {
  render(<Dictionary setScreen={jest.fn()} />);

  fireEvent.change(screen.getByLabelText(/search across all subjects/i), {
    target: { value: 'Event Horizon' },
  });

  expect(screen.getByText('Event Horizon')).toBeInTheDocument();
  expect(screen.queryByText('not checked yet')).not.toBeInTheDocument();
});
