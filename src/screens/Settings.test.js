import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Settings from './Settings';
import { ThemeProvider } from '../context/ThemeContext';
import { KEYS, writeValue } from '../utils/storage';

const open = (props = {}) =>
  render(
    <ThemeProvider>
      <Settings user={{ name: 'Ada' }} setScreen={jest.fn()} {...props} />
    </ThemeProvider>
  );

const seed = (value) => writeValue(KEYS.ONBOARDING_PREFERENCES, value);
const stored = () => JSON.parse(window.localStorage.getItem(KEYS.ONBOARDING_PREFERENCES));

beforeEach(() => {
  localStorage.clear();
});

test('shows the answer already given, rather than starting blank', () => {
  seed({ domain: 'physics', style: 'visual', time: '30 minutes' });
  open();

  // A settings screen that opens on "nothing selected" while a value is stored
  // is the write-once problem in a new place: the answer exists and the screen
  // refuses to show it.
  expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: '30 minutes' })).toHaveAttribute('aria-pressed', 'true');
});

test('changing the learning style persists it', () => {
  seed({ domain: 'physics', style: 'visual', time: '30 minutes' });
  open();

  fireEvent.click(screen.getByRole('button', { name: 'Textual' }));

  expect(stored().data.style).toBe('textual');
  // The other answer is untouched, which is what a merge has to get right.
  expect(stored().data.time).toBe('30 minutes');
  expect(screen.getByRole('button', { name: 'Textual' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'false');
});

test('a change is still there after a reload', () => {
  seed({ domain: 'physics', style: 'visual', time: '30 minutes' });
  const first = open();
  fireEvent.click(screen.getByRole('button', { name: 'Interactive' }));
  first.unmount();

  // Remount from storage only, which is what a reload does. If the change had
  // lived in component state, this is where it disappears.
  open();

  expect(screen.getByRole('button', { name: 'Interactive' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'false');
});

test('clearing an answer removes it rather than only unselecting the button', () => {
  seed({ domain: 'physics', style: 'visual', time: null });
  const first = open();
  fireEvent.click(screen.getByRole('button', { name: 'Clear this answer' }));
  first.unmount();

  open();

  // Reloaded, nothing is selected and there is no clear control left to press:
  // the stored answer is gone rather than hidden behind local state.
  expect(screen.queryByRole('button', { name: /clear this answer/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'false');
});

test('says the change was not saved when the browser refuses the write', () => {
  seed({ domain: 'physics', style: 'visual', time: null });
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('denied');
  });

  try {
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Textual' }));

    // The point of this test. A screen that moved the selection and said
    // nothing would show a setting that is not in effect and look like it had
    // saved. There are two alerts here, and both are correct: the refusal above
    // this one, and the storage warning describeStorage raises when its own
    // probe fails. This one is the refusal.
    expect(document.querySelector('.st-notice')).toHaveTextContent(/refused to save/i);
    expect(screen.getByRole('button', { name: 'Textual' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'true');
  } finally {
    // Restored in a finally: an assertion that throws before the restore line
    // leaves the mock in place, and the next test then fails for a reason that
    // has nothing to do with what it is testing.
    setItem.mockRestore();
  }
});

test('the theme control changes the real theme and persists it', () => {
  const first = open();
  fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  // A bare string, not the versioned envelope, because the pre-paint script in
  // index.html reads this exact key before React mounts so a dark-mode visitor
  // does not see a cream flash. That script is the reason the theme is the one
  // key in this app that is not written through the registry.
  expect(window.localStorage.getItem(KEYS.THEME)).toBe('dark');
  first.unmount();

  open();
  expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
});

test('offers System alongside light and dark', () => {
  open();
  // A two-way switch cannot express "follow the OS", and this app already has a
  // real three-way theme, so offering only two would be a downgrade of what
  // exists rather than an addition.
  ['Light', 'Dark', 'System'].forEach((label) => {
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });
});

test('has no reminder switches, and says why', () => {
  open();
  const section = screen.getByRole('heading', { name: 'Reminders' }).closest('section');

  // The brief asked for reminder preferences "if any exist". None do: there is
  // no service worker, no permission request and no server, so a toggle here
  // would be a control wired to nothing. The section says so rather than
  // shipping a dead switch.
  expect(within(section).queryByRole('checkbox')).not.toBeInTheDocument();
  expect(within(section).queryByRole('switch')).not.toBeInTheDocument();
  expect(within(section).getByText(/no switch to turn off/i)).toBeInTheDocument();
});

test('names the profile as a local name, not an account', () => {
  open();
  const section = screen.getByRole('heading', { name: /name on this device/i }).closest('section');
  expect(within(section).getByText(/not an account/i)).toBeInTheDocument();
  expect(within(section).getByText(/Ada/)).toBeInTheDocument();
});

test('the remove-name control says what it does rather than signing out', () => {
  const onForgetProfile = jest.fn();
  open({ onForgetProfile });

  fireEvent.click(screen.getByRole('button', { name: /remove the name from this device/i }));

  // There is no session to end. Calling this a sign out is the claim this build
  // removed an account flow over.
  expect(onForgetProfile).toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: /sign ?out/i })).not.toBeInTheDocument();
});

test('goes back to the atlas', () => {
  const setScreen = jest.fn();
  open({ setScreen });
  fireEvent.click(screen.getByRole('button', { name: /back to the atlas/i }));
  expect(setScreen).toHaveBeenCalledWith('universe');
});
