import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import QuantumQuiz, { QUIZ_QUESTIONS, optionOrder } from './QuantumQuiz';
import { CLASSIC_GAMES } from '../screens/Games';
import { PHILOSOPHY_LEVELS } from '../data/philosophy';
import { CURIOUS_TERMS } from '../data/dictionary';

const pick = (text) => fireEvent.click(screen.getByRole('button', { name: new RegExp(text, 'i') }));

describe('Concept Check quiz', () => {
  // The screen was called the Quantum Quiz and had no quantum content.
  test('is no longer named after content it does not have', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    expect(screen.getByRole('heading', { name: /concept check/i })).toBeInTheDocument();
  });

  test('says why the answer is right, which is the part worth learning', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    pick('The boundary beyond which nothing escapes');

    expect(screen.getByText(/it is a boundary in space, not a surface/i)).toBeInTheDocument();
  });

  test('the philosophy questions are about real named arguments, not invented ones', () => {
    // Four philosophy questions now sit in a deck that had none, in a subject
    // with eleven lessons and a dictionary. Each one has to be traceable: the
    // trolley problem to Foot 1967, the is-ought gap to Hume, the Gettier case
    // to 1963, consequentialism to judging acts by outcomes.
    //
    // The names are read from the app's own data, not copied into the test, so
    // a question that quietly drifts away from the entry it cites fails here.
    const philosophy = QUIZ_QUESTIONS.filter((q) => q.category === 'Philosophy');
    expect(philosophy.length).toBeGreaterThanOrEqual(4);

    const dictionaryText = CURIOUS_TERMS
      .filter((t) => t.subject === 'philosophy')
      .map((t) => `${t.term} ${t.explanation} ${t.example}`)
      .join(' ');

    // Each question must name the thing it is about, and that thing must exist
    // in the philosophy dictionary rather than being coined for the quiz.
    const named = [
      { term: 'Trolley Problem', question: /trolley problem/i },
      { term: 'Is-Ought Problem', question: /ought/i },
    ];
    named.forEach(({ term, question }) => {
      expect(dictionaryText).toMatch(new RegExp(term.replace(' ', '[ -]'), 'i'));
      expect(philosophy.some((q) => question.test(q.question))).toBe(true);
    });

    // Gettier and consequentialism are philosophy-level entries, not dictionary
    // terms, so they are checked against the deep-read content instead.
    const entryNames = PHILOSOPHY_LEVELS.flatMap((level) =>
      (level.entries ?? []).map((e) => e.name)
    );
    expect(entryNames).toContain('Consequentialism');
    expect(philosophy.some((q) => /only what it leads to|what it produces/i.test(q.question + q.explanation))).toBe(true);
    expect(philosophy.some((q) => /justified and true|Getttier/i.test(q.question + q.explanation))).toBe(true);
  });

  test('the description on the games hub matches what the deck actually contains', () => {
    // It said "Ten questions across physics, chemistry and biology" while the
    // deck was fourteen questions across space, quantum, physics, biology and
    // philosophy. The count and the subjects were both stale, and nothing
    // checked the description against the deck it described.
    const card = CLASSIC_GAMES.find((g) => g.id === 'quiz');
    // "Fourteen" is a word, not digits. Written to work either way rather than
    // depending on the description being phrased one particular way, because the
    // point of this test is the count, not the spelling of the number.
    const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
      'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
      'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    const m = /(\w+) questions/i.exec(card.description);
    expect(m).not.toBeNull();
    const declared = /^\d+$/.test(m[1])
      ? Number(m[1])
      : WORDS.indexOf(m[1].toLowerCase());
    expect(declared).toBe(QUIZ_QUESTIONS.length);

    const subjects = [...new Set(QUIZ_QUESTIONS.map((q) => q.category))];
    // Every subject the description names must actually be in the deck, and
    // the deck must not be narrower than the description claims.
    const named = card.description.match(/space|physics|biology|chemistry|philosophy|quantum/gi) || [];
    subjects.forEach((s) => {
      expect(named.map((n) => n.toLowerCase())).toContain(s.toLowerCase());
    });
  });

  test('a wrong answer still shows the explanation', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    pick('A type of star');

    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    expect(screen.getByText(/boundary in space/i)).toBeInTheDocument();
  });

  // Clicking a second option used to overwrite the answer after the result
  // was already on screen, so the mark could contradict the first choice.
  test('a second click cannot change an answer already given', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    pick('A type of star');
    pick('A cosmic event');

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  // Traced for the same double-submit shape that was live in Concept Puzzle and
  // Concept Scrabble, and found clean here. Two separate guards, and this test
  // pins the one that is structural.
  //
  // The Next button is only rendered once a question has been answered. So
  // clicking it twice is not "a second advance" - the first click advances,
  // which resets `answered` and unmounts the button, and there is no second
  // click to land on. That is why no guard was needed on handleNext, and it is
  // the kind of thing worth writing down before someone adds a guard that looks
  // like the only thing holding it up.
  test('advancing unmounts the Next button, so a double click cannot skip a question', () => {
    jest.useFakeTimers();
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^[A-D]\s/ })[0]);

    const next = screen.getByRole('button', { name: /next question/i });
    fireEvent.click(next);
    // Question two is unanswered, so there is nothing to advance past.
    expect(screen.queryByRole('button', { name: /next question|finish/i })).not.toBeInTheDocument();

    // And the deck is still on question two, not three.
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByText(QUIZ_QUESTIONS[1].question)).toBeInTheDocument();
    jest.useRealTimers();
  });

  /*
   * The options were drawn in the order they are written in the data, which put
   * the right answer first on a third of the deck. A player who read nothing
   * could score by always taking A.
   */
  test('the answer is not always in the same slot', () => {
    const slots = QUIZ_QUESTIONS.map((question, index) => {
      const order = optionOrder(index, question.options.length);
      return order.indexOf(question.correct);
    });

    // Every question keeps its options intact - a shuffle that dropped or
    // duplicated one would show up here rather than as a wrong answer later.
    QUIZ_QUESTIONS.forEach((question, index) => {
      const order = optionOrder(index, question.options.length);
      expect(order.slice().sort((a, b) => a - b)).toEqual(question.options.map((_, i) => i));
    });

    // And the deck does not put the answer in one place. Asking for more than
    // three distinct slots across fourteen questions rules out a fixed slot and
    // rules out "always the first" with room to spare.
    expect(new Set(slots).size).toBeGreaterThan(3);
  });

  test('which slot the answer lands in is not the first one every time', () => {
    const firstSlots = QUIZ_QUESTIONS.filter(
      (question, index) => optionOrder(index, question.options.length)[0] === question.correct
    ).length;
    expect(firstSlots).toBeLessThan(QUIZ_QUESTIONS.length / 3);
  });

  /*
   * The card tells the player the options are A to D and there was no way to
   * use a letter without a mouse.
   */
  test('a number key answers the question', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.keyDown(window, { key: '1' });

    // One of the four is marked, so the deck has moved on from "unanswered".
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  test('a letter key answers the question too', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.keyDown(window, { key: 'c' });
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  test('the key picks the option on screen rather than the one in the data', () => {
    // The letters label the drawn order. If the handler were fed the data order
    // it would mark a different option than the one the badge points at, so the
    // press of "A" has to match the first button rendered.
    render(<QuantumQuiz onBack={() => {}} />);
    const first = screen.getAllByRole('button', { name: /^A\s/ })[0];
    const firstText = first.querySelector('.option-text').textContent;

    fireEvent.keyDown(window, { key: 'a' });
    expect(screen.getByRole('button', { name: /^A\s/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: new RegExp(`^A\\s${firstText}`) })).toBeInTheDocument();
  });

  test('a key press after answering does not change the answer', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.keyDown(window, { key: '1' });
    const score = screen.getByText(/^Score: /).textContent;

    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: '3' });
    expect(screen.getByText(score)).toBeInTheDocument();
  });

  test('Enter advances once the question is answered', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(screen.getByText(QUIZ_QUESTIONS[1].question)).toBeInTheDocument();
  });

  test('keys with a modifier are left to the browser', () => {
    // Cmd+1 switches browser tabs. Preventing it would make the shortcut the
    // only thing on the page and break a keyboard convention older than it.
    render(<QuantumQuiz onBack={() => {}} />);
    fireEvent.keyDown(window, { key: '1', metaKey: true });
    expect(screen.queryByRole('button', { name: /next question/i })).not.toBeInTheDocument();
  });

  test('the correct answer scores once', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    pick('The boundary beyond which nothing escapes');
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
  });

  /*
   * The end screen could say how many were right and nothing about which. The
   * explanation for a wrong answer was on screen for a few seconds and then
   * discarded with the question it belonged to.
   */
  test('the end screen lists the questions that were answered wrong', () => {
    render(<QuantumQuiz onBack={() => {}} />);

    // Every question answered wrong: option A is only the right one by luck.
    for (let i = 0; i < QUIZ_QUESTIONS.length; i += 1) {
      fireEvent.click(screen.getAllByRole('button', { name: /^[A-D]\s/ })[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|finish/i }));
    }

    const review = document.querySelector('.quiz-review');
    expect(review).not.toBeNull();

    // Whatever came out wrong is on the list, with its reasoning. Read from the
    // deck rather than hardcoded, so adding a question cannot leave this
    // passing on a subset of them.
    const shown = review.textContent;
    const wrong = QUIZ_QUESTIONS.filter((question) => {
      const order = optionOrder(QUIZ_QUESTIONS.indexOf(question), question.options.length);
      return order[0] !== question.correct;
    });
    expect(wrong.length).toBeGreaterThan(0);
    wrong.forEach((question) => {
      expect(shown).toContain(question.question);
      expect(shown).toContain(question.explanation);
    });
  });

  test('a perfect round has nothing to review', () => {
    jest.useFakeTimers();
    render(<QuantumQuiz onBack={() => {}} />);

    QUIZ_QUESTIONS.forEach((question, index) => {
      const order = optionOrder(index, question.options.length);
      const position = order.indexOf(question.correct);
      fireEvent.click(screen.getAllByRole('button', { name: /^[A-D]\s/ })[position]);
      fireEvent.click(screen.getByRole('button', { name: /next question|finish/i }));
    });

    expect(screen.getByText(/every one right/i)).toBeInTheDocument();
    expect(document.querySelector('.quiz-review')).toBeNull();
    jest.useRealTimers();
  });

  test('finishing reports how many were right, not a raw score out of ten', () => {
    // The deck was ten questions; the test looped a hardcoded ten and asserted
    // "of 10 correct". Both the loop and the expectation are now derived from
    // the deck, so adding questions cannot leave this test passing on the first
    // ten of fourteen while the game reports fourteen.
    render(<QuantumQuiz onBack={() => {}} />);

    for (let i = 0; i < QUIZ_QUESTIONS.length; i += 1) {
      // Deliberately always take option A, so the result is a mix.
      fireEvent.click(screen.getAllByRole('button', { name: /^[A-D]\s/ })[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|finish/i }));
    }

    expect(screen.getByText(new RegExp(`of ${QUIZ_QUESTIONS.length} correct`, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quiz complete/i })).toBeInTheDocument();
  });
});
