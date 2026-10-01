import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import KnowledgeChain, { CHAINS } from './KnowledgeChain';

const pick = (...labels) => {
  labels.forEach((label) => {
    fireEvent.click(screen.getByRole('button', { name: label }));
  });
};

describe('Knowledge Chain', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  // The only condition the old game checked was that all four concepts had
  // been picked, in any order at all, so any permutation scored a perfect
  // chain. This is the whole game and it was not being tested.
  test('the right four concepts in the wrong order are rejected', () => {
    render(<KnowledgeChain onBack={() => {}} />);

    pick('DNA', 'Proteins', 'Genes', 'Cells');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText(/wrong order/i)).toBeInTheDocument();
    expect(screen.queryByText(/perfect chain/i)).not.toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  test('the correct order is accepted and scores', () => {
    render(<KnowledgeChain onBack={() => {}} />);

    pick('DNA', 'Genes', 'Proteins', 'Cells');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText('Score: 50')).toBeInTheDocument();
  });

  test('solving it shows the links, which are the part worth learning', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    pick('DNA', 'Genes', 'Proteins', 'Cells');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    // Read the link text from the chain data rather than hardcoding it, so
    // improving the wording does not break the test that the links are shown.
    const [first, second, third] = CHAINS[0].links;
    expect(screen.getByText(first)).toBeInTheDocument();
    expect(screen.getByText(second)).toBeInTheDocument();
    expect(screen.getByText(third)).toBeInTheDocument();
  });

  test('submitting twice cannot score twice', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    pick('DNA', 'Genes', 'Proteins', 'Cells');

    const check = screen.getByRole('button', { name: /check chain/i });
    fireEvent.click(check);
    fireEvent.click(check);

    expect(screen.getByText('Score: 50')).toBeInTheDocument();
  });

  test('undo removes the last concept picked', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    pick('DNA', 'Genes');
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));

    // Undo took Genes off. Adding the rest in a jumbled order still fails,
    // which only holds if the chain really is back to just DNA.
    pick('Cells', 'Proteins', 'Genes');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    expect(screen.getByText(/wrong order/i)).toBeInTheDocument();
  });

  test('the check button stays disabled until all four are chosen', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    expect(screen.getByRole('button', { name: /check chain/i })).toBeDisabled();

    pick('DNA', 'Genes', 'Proteins');
    expect(screen.getByRole('button', { name: /check chain/i })).toBeDisabled();

    pick('Cells');
    expect(screen.getByRole('button', { name: /check chain/i })).toBeEnabled();
  });

  test('the next chain is not reachable before the current one is solved', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    expect(screen.getByText('Chain 1/' + CHAINS.length)).toBeInTheDocument();

    pick('DNA', 'Genes', 'Cells', 'Proteins');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    act(() => jest.advanceTimersByTime(3000));

    // Still on chain one, because the order was wrong.
    expect(screen.getByText('Chain 1/' + CHAINS.length)).toBeInTheDocument();
  });

  test('solving a chain moves on to the next one', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    pick('DNA', 'Genes', 'Proteins', 'Cells');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    act(() => jest.advanceTimersByTime(3000));

    expect(screen.getByText('Chain 2/' + CHAINS.length)).toBeInTheDocument();
    expect(screen.getByText('Chemistry Chain')).toBeInTheDocument();
  });
});

describe('chain content quality', () => {
  test('every chain has four concepts and exactly three links', () => {
    CHAINS.forEach((chain) => {
      expect(chain.concepts.length).toBe(4);
      expect(chain.links.length).toBe(3);
      expect(chain.title).toBeTruthy();
    });
  });

  test('no link is generic enough to fit any pair of concepts', () => {
    // "Chemical Bond holds together Molecule" is the case this was written for.
    //
    // A mechanical check for "the link repeats the next concept's words" does
    // NOT catch it, because "holds together" contains neither "chemical" nor
    // "bond". I wrote that version first, it passed against the bad wording,
    // and it was measuring nothing. What does catch it is the property that
    // actually makes the old wording wrong: the link names no mechanism, so it
    // would fit any two concepts whatsoever.
    const GENERIC = ['holds together', 'form', 'makes a', 'is a', 'makes', 'builds', 'has a'];
    CHAINS.forEach((chain) => {
      chain.links.forEach((link) => {
        const clean = link.trim().toLowerCase();
        GENERIC.forEach((generic) => {
          expect(clean).not.toBe(generic);
        });
        // A one-word link cannot name the mechanism by which one concept
        // causes the next, which is the entire point of showing it.
        expect(clean.split(/\s+/).length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  test('chains cover more than one subject', () => {
    const titles = CHAINS.map((c) => c.title).join(' ');
    ['Biology', 'Chemistry', 'Space', 'Physics', 'Economics', 'History'].forEach((subject) => {
      expect(titles).toContain(subject);
    });
  });

  test('offers enough chains that one round is not the whole game', () => {
    expect(CHAINS.length).toBeGreaterThanOrEqual(6);
  });
});
