import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import KnowledgeChain from './KnowledgeChain';

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

    expect(screen.getByText('code for')).toBeInTheDocument();
    expect(screen.getByText('build')).toBeInTheDocument();
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
    expect(screen.getByText('Chain 1/3')).toBeInTheDocument();

    pick('DNA', 'Genes', 'Cells', 'Proteins');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    act(() => jest.advanceTimersByTime(3000));

    // Still on chain one, because the order was wrong.
    expect(screen.getByText('Chain 1/3')).toBeInTheDocument();
  });

  test('solving a chain moves on to the next one', () => {
    render(<KnowledgeChain onBack={() => {}} />);
    pick('DNA', 'Genes', 'Proteins', 'Cells');
    fireEvent.click(screen.getByRole('button', { name: /check chain/i }));
    act(() => jest.advanceTimersByTime(3000));

    expect(screen.getByText('Chain 2/3')).toBeInTheDocument();
    expect(screen.getByText('Chemistry Chain')).toBeInTheDocument();
  });
});
