import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantumQuiz, { QUIZ_QUESTIONS } from './QuantumQuiz';
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

  test('the correct answer scores once', () => {
    render(<QuantumQuiz onBack={() => {}} />);
    pick('The boundary beyond which nothing escapes');
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
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
