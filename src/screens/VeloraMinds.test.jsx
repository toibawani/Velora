import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VeloraMinds from './VeloraMinds';
import { MIND_BY_ID } from '../data/minds';

describe('Velora Minds', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('opens on the library with every thinker and the honesty note', () => {
    render(<VeloraMinds setScreen={() => {}} />);

    expect(screen.getByRole('heading', { level: 1, name: /Velora Minds/i })).toBeInTheDocument();
    expect(screen.getByText(/reconstructions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Albert Einstein/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Marie Curie/i })).toBeInTheDocument();
  });

  test('opening a thinker shows the researched profile and the conversation', () => {
    render(<VeloraMinds setScreen={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Open Albert Einstein/i }));

    expect(screen.getByRole('heading', { level: 1, name: 'Albert Einstein' })).toBeInTheDocument();
    expect(screen.getByText(MIND_BY_ID.einstein.profile.method)).toBeInTheDocument();
    expect(screen.getByText(MIND_BY_ID.einstein.profile.limits)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Put something to Albert/i })).toBeInTheDocument();
  });

  test('a starter question produces a sourced reply, not a quotation', () => {
    render(<VeloraMinds setScreen={() => {}} initialFigureId="einstein" />);
    fireEvent.click(screen.getByText('Do you think time actually exists, or is it a human invention?'));

    expect(screen.getAllByText(/Simultaneity is not a fact about the world/i).length).toBeGreaterThanOrEqual(1);
    const links = screen.getAllByRole('link');
    expect(links.some((link) => /1905/i.test(link.textContent))).toBe(true);
    expect(screen.getByText(/Position: Simultaneity/i)).toBeInTheDocument();
  });

  test('switching mode changes the shape of the next reply', () => {
    render(<VeloraMinds setScreen={() => {}} initialFigureId="bohr" />);
    fireEvent.click(screen.getByRole('tab', { name: /Teach me/i }));

    const input = screen.getByLabelText(/Type your question for Niels Bohr/i);
    fireEvent.change(input, { target: { value: 'What does complementarity mean?' } });
    fireEvent.click(screen.getByLabelText('Send question'));

    expect(screen.getByText(/First, the claim/i)).toBeInTheDocument();
    expect(screen.getByText(/Teach mode/i)).toBeInTheDocument();
  });

  test('a debate shows both positions, their sources and the fault line', () => {
    render(<VeloraMinds setScreen={() => {}} />);
    fireEvent.click(screen.getAllByRole('button', { name: /Read the disagreement/i })[0]);

    expect(screen.getByRole('heading', { level: 1, name: /Is quantum mechanics complete/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The fault line/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Bell/i).length).toBeGreaterThanOrEqual(1);
  });

  test('the atlas control returns to the app', () => {
    const setScreen = jest.fn();
    render(<VeloraMinds setScreen={setScreen} />);
    fireEvent.click(screen.getByRole('button', { name: /Atlas/i }));
    expect(setScreen).toHaveBeenCalledWith('universe');
  });
});
