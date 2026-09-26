import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantumQuiz from './QuantumQuiz';

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
    render(<QuantumQuiz onBack={() => {}} />);

    for (let i = 0; i < 10; i += 1) {
      // Deliberately always take option A, so the result is a mix.
      fireEvent.click(screen.getAllByRole('button', { name: /^[A-D]\s/ })[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|finish/i }));
    }

    expect(screen.getByText(/of 10 correct/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quiz complete/i })).toBeInTheDocument();
  });
});
