import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RabbitHoleSidebar from './RabbitHoleSidebar';
import { getRabbitHoleConnections } from '../data/rabbitHoles';

describe('RabbitHoleSidebar component', () => {
  test('returns 3 unexpected connections for black holes', () => {
    const connections = getRabbitHoleConnections('black-holes');
    expect(connections).toHaveLength(3);
    expect(connections[0].title).toBe("Plato's Allegory of the Cave");
    expect(connections[1].title).toBe('Sunk Cost Fallacy');
    expect(connections[2].title).toBe('The 1919 Solar Eclipse');
  });

  test('each connection explanation contains exactly two sentences', () => {
    const connections = getRabbitHoleConnections('black-holes');
    connections.forEach((conn) => {
      // Split on sentence-ending punctuation
      const sentences = conn.explanation
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0);
      expect(sentences).toHaveLength(2);
    });
  });

  test('renders closed when isOpen is false', () => {
    const { container } = render(
      <RabbitHoleSidebar
        topicId="black-holes"
        topicTitle="Black Holes"
        subject="physics"
        isOpen={false}
        onClose={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders dialog and cards when isOpen is true', () => {
    const handleClose = jest.fn();
    render(
      <RabbitHoleSidebar
        topicId="black-holes"
        topicTitle="Black Holes"
        subject="physics"
        isOpen={true}
        onClose={handleClose}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText("Plato's Allegory of the Cave")).toBeInTheDocument();
    expect(screen.getByText('Sunk Cost Fallacy')).toBeInTheDocument();
    expect(screen.getByText('The 1919 Solar Eclipse')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close rabbit hole sidebar');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('closes on Escape key press', () => {
    const handleClose = jest.fn();
    render(
      <RabbitHoleSidebar
        topicId="motion"
        topicTitle="Motion"
        subject="physics"
        isOpen={true}
        onClose={handleClose}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
