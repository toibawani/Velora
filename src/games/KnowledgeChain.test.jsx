import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import KnowledgeChain, { CHAINS, boardOrder, POINTS_PER_CHAIN, HINT_PENALTY } from './KnowledgeChain';

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

/*
 * The board used to render the four concept buttons straight off
 * `chain.concepts`, which is the answer. The player could win by reading the
 * buttons from left to right, and nothing noticed, because the test that
 * covered ordering fed the concepts in deliberately wrong orders.
 */
describe('the board does not hand over the answer', () => {
  test('clicking the buttons in the order they are laid out is not the solution', () => {
    render(<KnowledgeChain onBack={() => {}} />);

    const board = screen.getAllByRole('button', { name: new RegExp(`^(${CHAINS[0].concepts.join('|')})$`) });
    // Every concept is on the board exactly once, in some order.
    expect(board.map((button) => button.textContent).sort()).toEqual(CHAINS[0].concepts.slice().sort());

    board.forEach((button) => fireEvent.click(button));
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText(/wrong order/i)).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  test('no chain is laid out in its own answer order', () => {
    // Every chain, not just the one that happens to be on screen first: a
    // single chain that comes out in order is a round that answers itself.
    CHAINS.forEach((chain, index) => {
      const order = boardOrder(index, chain.concepts.length);
      expect(order.slice().sort((a, b) => a - b)).toEqual(chain.concepts.map((_, i) => i));
      expect(order).not.toEqual(chain.concepts.map((_, i) => i));
    });
  });

  test('a chain always lays out the same way, so a re-render cannot reshuffle it', () => {
    // Derived from the chain index rather than Math.random, which is what makes
    // this hold: the buttons must not move out from under a half-finished pick.
    expect(boardOrder(2, 4)).toEqual(boardOrder(2, 4));
    expect(boardOrder(2, 4)).not.toEqual(boardOrder(3, 4));
  });
});

/*
 * The board scrambles the concepts, and the only way to test a guess was to
 * commit the whole chain, so a player stuck on one link had nothing to do but
 * keep guessing at all four.
 */
describe('a hint for a chain that will not come', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  test('the hint names the next concept in the chain', () => {
    render(<KnowledgeChain onBack={() => {}} />);

    // Nothing picked yet, so the next one is the first concept. The concept is
    // wrapped in a <strong>, so the assertion reads the paragraph rather than
    // one node inside it.
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    expect(document.querySelector('.chain-hint').textContent).toContain(CHAINS[0].concepts[0]);
  });

  test('the hint follows the picks rather than repeating the first concept', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    fireEvent.click(screen.getByRole('button', { name: CHAINS[0].concepts[0] }));

    const hint = document.querySelector('.chain-hint').textContent;
    expect(hint).toContain(CHAINS[0].concepts[1]);
    expect(hint).not.toContain(`: ${CHAINS[0].concepts[0]}.`);
  });

  test('a hinted chain scores less than a chain worked out unaided', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));

    pick(...CHAINS[0].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText(`Score: ${POINTS_PER_CHAIN - HINT_PENALTY}`)).toBeInTheDocument();
  });

  test('the penalty never takes a solved chain below zero', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    for (let i = 0; i < 6; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    }

    pick(...CHAINS[0].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  test('the next chain starts unhinted', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    pick(...CHAINS[0].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    act(() => jest.advanceTimersByTime(3000));

    expect(screen.queryByText(/next in the chain/i)).not.toBeInTheDocument();
    pick(...CHAINS[1].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));

    expect(screen.getByText(`Score: ${POINTS_PER_CHAIN + (POINTS_PER_CHAIN - HINT_PENALTY)}`)).toBeInTheDocument();
  });

  test('Start Over clears the hints along with the picks', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    fireEvent.click(screen.getByRole('button', { name: /start over/i }));

    expect(screen.queryByText(/next in the chain/i)).not.toBeInTheDocument();
    pick(...CHAINS[0].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    expect(screen.getByText(`Score: ${POINTS_PER_CHAIN}`)).toBeInTheDocument();
  });
});

/*
 * Solving the last chain ended the game in place with no way back to the first
 * one and no way out besides the Back button in the header.
 */
describe('finishing the set', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  const solveEveryChain = () => {
    CHAINS.forEach((chain) => {
      pick(...chain.concepts);
      fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
      act(() => jest.advanceTimersByTime(3000));
    });
  };

  test('finishing the last chain offers a way to play the set again', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    solveEveryChain();

    expect(screen.getByText(new RegExp(`All chains done`))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to games/i })).toBeInTheDocument();
  });

  test('the replay returns to the first chain with the score cleared', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    solveEveryChain();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));

    expect(screen.getByText('Chain 1/' + CHAINS.length)).toBeInTheDocument();
    expect(screen.getByText(CHAINS[0].title)).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.queryByText(/all chains done/i)).not.toBeInTheDocument();
  });

  test('a second pass through the set can be solved', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    solveEveryChain();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));

    pick(...CHAINS[0].concepts);
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    expect(screen.getByText(`Score: ${POINTS_PER_CHAIN}`)).toBeInTheDocument();
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
