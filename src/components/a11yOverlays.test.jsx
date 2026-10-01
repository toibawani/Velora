import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import CommandPalette from './CommandPalette';
import KeyboardHelp from './KeyboardHelp';
import MobileNav from './MobileNav';
import UniverseBuilder from './UniverseBuilder';

// A modal the keyboard cannot leave is a trap the user can only escape by
// guessing. Tab has to stay inside the dialog while it is open.
const insideDialog = (element, selector) =>
  element !== document.body && Boolean(element.closest(selector));

const tabWithin = async (times) => {
  const seen = [];
  for (let i = 0; i < times; i += 1) {
    await userEvent.tab();
    seen.push(document.activeElement);
  }
  return seen;
};

describe('command palette', () => {
  test('has no detectable axe violations when open', async () => {
    const { container } = render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    expect((await axe(container)).violations).toEqual([]);
  });

  test('puts the keyboard in the search field on open', async () => {
    render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    const input = screen.getByLabelText('Search VELORA');
    await userEvent.type(input, 'x');
    // Typing only lands in the field if it already had focus.
    expect(input).toHaveFocus();
  });

  test('keeps Tab inside the dialog', async () => {
    render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    const seen = await tabWithin(8);
    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every((el) => insideDialog(el, '.command-palette'))).toBe(true);
  });
});

describe('keyboard help', () => {
  test('has no detectable axe violations when open', async () => {
    const { container } = render(<KeyboardHelp isOpen onClose={() => {}} />);
    expect((await axe(container)).violations).toEqual([]);
  });

  test('keeps Tab inside the dialog', async () => {
    render(<KeyboardHelp isOpen onClose={() => {}} />);
    const seen = await tabWithin(6);
    expect(seen.every((el) => insideDialog(el, '.keyboard-help'))).toBe(true);
  });
});

describe('mobile nav drawer', () => {
  test('has no detectable axe violations while open', async () => {
    render(<MobileNav currentScreen="universe" setScreen={() => {}} onLogout={() => {}} />);
    await userEvent.click(screen.getByLabelText('Open mobile navigation'));
    const drawer = document.querySelector('.mobile-nav.open');
    expect((await axe(drawer)).violations).toEqual([]);
  });

  test('keeps Tab inside the open drawer', async () => {
    render(<MobileNav currentScreen="universe" setScreen={() => {}} onLogout={() => {}} />);
    await userEvent.click(screen.getByLabelText('Open mobile navigation'));
    const seen = await tabWithin(10);
    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every((el) => insideDialog(el, '.mobile-nav'))).toBe(true);
  });
});

describe('universe builder overlays', () => {
  test('has no detectable axe violations on the add-concept dialog', async () => {
    render(<UniverseBuilder />);
    await userEvent.click(screen.getByRole('button', { name: /add concept/i }));
    const dialog = document.querySelector('.add-concept-modal');
    expect(dialog).toBeTruthy();
    expect((await axe(dialog)).violations).toEqual([]);
  });

  test('keeps Tab inside the add-concept dialog', async () => {
    render(<UniverseBuilder />);
    await userEvent.click(screen.getByRole('button', { name: /add concept/i }));
    const seen = await tabWithin(8);
    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every((el) => insideDialog(el, '.add-concept-modal'))).toBe(true);
  });
});
