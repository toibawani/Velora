import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

describe('ThemeToggle', () => {
  test('renders all theme pill options', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /Dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Auto/i })).toBeInTheDocument();
  });

  test('changes active state when clicking light theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const lightBtn = screen.getByRole('button', { name: /Light/i });
    fireEvent.click(lightBtn);

    expect(lightBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
