import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import CommandPalette from './CommandPalette';
import KeyboardHelp from './KeyboardHelp';
import MobileNav from './MobileNav';
import UniverseBuilder from './UniverseBuilder';

/*
 * A modal the keyboard cannot leave is a trap the user can only escape by
 * guessing. Tab has to stay inside the dialog while it is open.
 *
 * These tests used to collect document.activeElement after every Tab and ask
 * whether it had a given class somewhere above it. They also tabbed fewer times
 * than some of the dialogs have controls, so the loop never reached the end of
 * a dialog and never tested the boundary it was named after.
 *
 * Focus the last control, press Tab, and the trap has to hand focus back to the
 * first one. That is the same claim stated as a fact about two named elements.
 */
const expectTabWraps = async (dialogName, firstControl, lastControl) => {
  const dialog = screen.getByRole('dialog', { name: dialogName });
  const last = lastControl || within(dialog).getAllByRole('button').slice(-1)[0];

  last.focus();
  expect(last).toHaveFocus();
  await userEvent.tab();
  expect(firstControl).toHaveFocus();
};

describe('command palette', () => {
  test('has no detectable axe violations when open', async () => {
    const { container } = render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    expect((await axe(container)).violations).toEqual([]);
  });

  test('puts the keyboard in the search field on open', async () => {
    render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    const input = screen.getByLabelText('Search VELORA');
    expect(input).toHaveFocus();
    await userEvent.type(input, 'x');
    // Typing only lands in the field if it already had focus.
    expect(input).toHaveValue('x');
  });

  test('keeps Tab inside the dialog', async () => {
    render(<CommandPalette isOpen onClose={() => {}} onNavigate={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'VELORA search' });
    await expectTabWraps(
      'VELORA search',
      screen.getByLabelText('Search VELORA'),
      within(dialog).getAllByRole('option').slice(-1)[0]
    );
  });
});

describe('keyboard help', () => {
  test('has no detectable axe violations when open', async () => {
    const { container } = render(<KeyboardHelp isOpen onClose={() => {}} />);
    expect((await axe(container)).violations).toEqual([]);
  });

  test('keeps Tab inside the dialog', async () => {
    render(<KeyboardHelp isOpen onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Move through VELORA' });
    await expectTabWraps('Move through VELORA', within(dialog).getByRole('button', { name: 'Close keyboard help' }));
  });
});

describe('mobile nav drawer', () => {
  test('has no detectable axe violations while open', async () => {
    render(<MobileNav currentScreen="universe" setScreen={() => {}} onLogout={() => {}} />);
    await userEvent.click(screen.getByLabelText('Open mobile navigation'));
    const drawer = screen.getByRole('dialog', { name: 'Mobile navigation menu' });
    expect((await axe(drawer)).violations).toEqual([]);
  });

  test('keeps Tab inside the open drawer', async () => {
    render(<MobileNav currentScreen="universe" setScreen={() => {}} onLogout={() => {}} />);
    await userEvent.click(screen.getByLabelText('Open mobile navigation'));
    const drawer = screen.getByRole('dialog', { name: 'Mobile navigation menu' });
    await expectTabWraps('Mobile navigation menu', within(drawer).getByRole('button', { name: 'Close navigation' }));
  });
});

describe('universe builder overlays', () => {
  test('has no detectable axe violations on the add-concept dialog', async () => {
    render(<UniverseBuilder />);
    await userEvent.click(screen.getByRole('button', { name: /add concept/i }));
    const dialog = screen.getByRole('dialog', { name: /add concept to knowledge universe/i });
    expect((await axe(dialog)).violations).toEqual([]);
  });

  test('keeps Tab inside the add-concept dialog', async () => {
    render(<UniverseBuilder />);
    await userEvent.click(screen.getByRole('button', { name: /add concept/i }));
    const dialog = screen.getByRole('dialog', { name: /add concept to knowledge universe/i });
    await expectTabWraps(
      /add concept to knowledge universe/i,
      within(dialog).getByRole('button', { name: /close the add concept dialog/i })
    );
  });
});
