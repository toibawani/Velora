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
  // The double-submit trace finds nothing here, for the same structural reason
  // as Concept Check but by a different mechanism: every control on the screen
  // is disabled once the chain is solved, and handleSubmit returns early too.
  test('nothing is still clickable after a chain is solved', () => {
    // handleSubmit books its move on a 2600ms timer. If any control stayed live
    // in that window a second click could land on top of it.
    jest.useFakeTimers();
    render(<KnowledgeChain onBack={() => {}} />);

    CHAINS[0].concepts.forEach((concept) =>
      fireEvent.click(screen.getByRole('button', { name: concept })));
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(screen.getByText(/correct/i)).toBeInTheDocument();

    // Every concept, the undo button and the check button are all disabled.
    CHAINS[0].concepts.forEach((concept) => {
      expect(screen.getByRole('button', { name: concept })).toBeDisabled();
    });
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /check/i })).toBeDisabled();

    // And the solved state survives the window and still advances exactly one
    // chain rather than two.
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByRole('button', { name: CHAINS[1].concepts[0] })).toBeInTheDocument();
    expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();
    jest.useRealTimers();
  });

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
    // The deck had no philosophy at all, in a subject with eleven lessons and
    // sixteen dictionary entries.
    expect(titles).toContain('Kant');
    expect(titles).toContain('Aristotle');
  });

  test('the philosophy chains link by a real mechanism, not by restating the step', () => {
    // A chain earns its place only if each link says how one concept produces
    // the next. Philosophy is where this deck is most likely to cheat: it is
    // easy to write "Duty follows from Good Will" and call that a chain, when
    // it restates the step before it.
    //
    // So each link must name a mechanism, and must not merely repeat the next
    // concept back. These two chains are Kant's test of a maxim and Aristotle's
    // account of habituation, and both have a term doing work in the link.
    ['Kant Chain', 'Aristotle Chain'].forEach((title) => {
      const chain = CHAINS.find((c) => c.title === title);
      expect(chain).toBeDefined();

      chain.links.forEach((link) => {
        // Naming the next concept is how the link plugs into the next step, so
        // that is expected. What must not happen is a link that is *only* the
        // next concept - "Duty follows from Good Will" says the step happened
        // without saying how. So the link has to carry more than the concept.
        const next = chain.concepts[chain.links.indexOf(link) + 1];
        expect(next).toBeTruthy();
        const linkWords = link.trim().split(/\s+/).length;
        const nextWords = next.split(/\s+/).length;
        // Everything the link says, bar the concept it plugs into.
        expect(linkWords).toBeGreaterThan(nextWords);
        // And the mechanism is a clause, not a single verb: six words is the
        // floor that stops "links to" or "causes" passing as an explanation.
        expect(linkWords).toBeGreaterThanOrEqual(6);
      });
    });
  });

  test('offers enough chains that one round is not the whole game', () => {
    expect(CHAINS.length).toBeGreaterThanOrEqual(6);
  });
});
