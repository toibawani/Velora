import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GlossaryText, { GlossaryFieldProvider } from './GlossaryText';

/**
 * The contract of the auto-linker: it links real terms, it does not carpet the
 * paragraph, and the definition is reachable by keyboard as well as by tap.
 */
describe('GlossaryText', () => {
  test('turns a difficult term into a definition button', () => {
    render(<GlossaryText text="Entropy always increases in a closed system." />);
    const button = screen.getByRole('button', { name: /define entropy/i });
    expect(button).toHaveTextContent('Entropy');
  });

  test('reveals the definition when the term is clicked', () => {
    render(<GlossaryText text="Entropy always increases in a closed system." />);
    fireEvent.click(screen.getByRole('button', { name: /define entropy/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/microscopic arrangements/i);
  });

  test('links a term once per paragraph, not at every mention', () => {
    render(<GlossaryText text="Entropy grows. Entropy is a count. Entropy is not disorder." />);
    expect(screen.getAllByRole('button', { name: /define entropy/i })).toHaveLength(1);
  });

  test('stops at three links so prose does not become a form', () => {
    render(
      <GlossaryText text="Entropy, a bit, decoherence, a plasmid and an eigenstate all appear here." />
    );
    expect(screen.getAllByRole('button', { name: /^define/i })).toHaveLength(3);
  });

  test('leaves words that are not in the glossary alone', () => {
    render(<GlossaryText text="A hologram is not a glossary term in this library." />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('does not apply a technical sense outside its field', () => {
    const { rerender } = render(
      <GlossaryFieldProvider field="History">
        <GlossaryText text="The measurement and the group were recorded." />
      </GlossaryFieldProvider>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <GlossaryFieldProvider field="Physics">
        <GlossaryText text="The measurement changed the state." />
      </GlossaryFieldProvider>
    );
    expect(screen.getByRole('button', { name: /define measurement/i })).toBeInTheDocument();
  });

  test('keeps emphasis while linking inside it', () => {
    render(<GlossaryText text="The **entropy** of the universe increases." />);
    expect(screen.getAllByText((content, node) => node.tagName === 'STRONG' && node.textContent === 'entropy')).toHaveLength(1);
    expect(screen.getByRole('button', { name: /define entropy/i })).toBeInTheDocument();
  });
});
