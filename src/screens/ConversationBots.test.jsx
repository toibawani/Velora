import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConversationBots from './ConversationBots';
import { BOTS } from '../data/conversationBots';

describe('ConversationBots screen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders all 6 historical figures in the selector', () => {
    render(<ConversationBots setScreen={() => {}} />);

    expect(screen.getAllByText('Albert Einstein').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Jalal al-Din Rumi')).toBeInTheDocument();
    expect(screen.getByText('Socrates')).toBeInTheDocument();
    expect(screen.getByText('Ibn Rushd (Averroes)')).toBeInTheDocument();
    expect(screen.getByText('Chanakya (Kautilya)')).toBeInTheDocument();
    expect(screen.getByText('Marie Curie')).toBeInTheDocument();
  });

  test('displays bio and historical context for the active figure', () => {
    render(<ConversationBots setScreen={() => {}} initialFigureId="einstein" />);

    expect(screen.getByText(BOTS.einstein.bio)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(BOTS.einstein.context.slice(0, 30)))).toBeInTheDocument();
  });

  test('switches figure and loads their bio', () => {
    render(<ConversationBots setScreen={() => {}} initialFigureId="einstein" />);

    const socratesBtn = screen.getByLabelText(/Converse with Socrates/i);
    fireEvent.click(socratesBtn);

    expect(screen.getByText(BOTS.socrates.bio)).toBeInTheDocument();
  });

  test('sends a user message and generates an authentic bot response', () => {
    render(<ConversationBots setScreen={() => {}} initialFigureId="socrates" />);

    const input = screen.getByLabelText(/Type your question for Socrates/i);
    fireEvent.change(input, { target: { value: 'What is true justice?' } });

    const sendBtn = screen.getByLabelText('Send question');
    fireEvent.click(sendBtn);

    expect(screen.getByText('What is true justice?')).toBeInTheDocument();
    // Socrates must ask questions back!
    expect(screen.getByText(/By Zeus, you speak of 'justice'/i)).toBeInTheDocument();
  });

  test('clicking a starter prompt sends the message immediately', () => {
    render(<ConversationBots setScreen={() => {}} initialFigureId="curie" />);

    const starter = screen.getByText('Why did you refuse to patent the process of extracting radium?');
    fireEvent.click(starter);

    expect(screen.getAllByText('Why did you refuse to patent the process of extracting radium?').length).toBe(2);
    expect(screen.getByText(/Radium belongs to no one; it is an element of nature/i)).toBeInTheDocument();
  });
});
