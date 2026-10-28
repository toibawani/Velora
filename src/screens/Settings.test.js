import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Settings from './Settings';
import { ThemeProvider } from '../context/ThemeContext';
import { KEYS, writeValue } from '../utils/storage';
import { downloadText } from '../utils/download';

// The download itself is the browser's job; jsdom has no object URLs at all.
// Mocking it is what lets the test read the file the screen would have written.
jest.mock('../utils/download', () => ({
  ...jest.requireActual('../utils/download'),
  downloadText: jest.fn(() => true),
}));

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
  // CRA's jest config resets mock implementations between tests, so the
  // factory's default does not survive to the next one.
  downloadText.mockImplementation(() => true);
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
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: 'Interactive' }));
  view.unmount();

  // Remount from storage only, which is what a reload does. If the change had
  // lived in component state, this is where it disappears.
  open();

  expect(screen.getByRole('button', { name: 'Interactive' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Visual' })).toHaveAttribute('aria-pressed', 'false');
});

test('clearing an answer removes it rather than only unselecting the button', () => {
  seed({ domain: 'physics', style: 'visual', time: null });
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: 'Clear this answer' }));
  view.unmount();

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
    const notices = screen.getAllByRole('alert');
    expect(notices.some((notice) => /refused to save/i.test(notice.textContent))).toBe(true);
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
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  // A bare string, not the versioned envelope, because the pre-paint script in
  // index.html reads this exact key before React mounts so a dark-mode visitor
  // does not see a cream flash. That script is the reason the theme is the one
  // key in this app that is not written through the registry.
  expect(window.localStorage.getItem(KEYS.THEME)).toBe('dark');
  view.unmount();

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
  const section = screen.getByRole('region', { name: 'Reminders' });

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
  const section = screen.getByRole('region', { name: /name on this device/i });
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

test('exports every stored key into a dated JSON file', () => {
  writeValue(KEYS.QUESTION_DESK, [{ question: 'Why is entropy time-asymmetric?' }]);
  downloadText.mockClear();
  open();

  fireEvent.click(screen.getByRole('button', { name: /export everything as json/i }));

  expect(downloadText).toHaveBeenCalledTimes(1);
  const [fileName, text] = downloadText.mock.calls[0];
  expect(fileName).toMatch(/^velora-backup-\d{4}-\d{2}-\d{2}\.json$/);

  const backup = JSON.parse(text);
  expect(backup.app).toBe('velora');
  expect(backup.entries.some((entry) => entry.key === KEYS.QUESTION_DESK)).toBe(true);
  expect(
    within(screen.getByRole('region', { name: /take your data with you/i })).getByRole('status'),
  ).toHaveTextContent(/prepared a file/i);
});

test('says the download did not start rather than implying it did', () => {
  downloadText.mockImplementationOnce(() => false);
  open();

  fireEvent.click(screen.getByRole('button', { name: /export everything as json/i }));

  expect(
    within(screen.getByRole('region', { name: /take your data with you/i })).getByRole('status'),
  ).toHaveTextContent(/would not start a download/i);
});

const backupFile = (entries, overrides = {}) =>
  JSON.stringify({
    app: 'velora',
    format: 1,
    exportedAt: '2026-10-20T10:00:00.000Z',
    origin: 'https://example.test',
    entries,
    ...overrides,
  });

const chooseFile = (text) => {
  const file = new File([text], 'velora-backup-2026-10-20.json', { type: 'application/json' });
  fireEvent.change(screen.getByLabelText(/restore from a backup file/i), {
    target: { files: [file] },
  });
};

const chosenBackup = () => screen.queryByRole('group', { name: /chosen backup/i });

const waitForBackup = () => waitFor(() => expect(chosenBackup()).toBeInTheDocument());

test('restores a backup file, and says what it did', async () => {
  seed({ domain: 'physics', style: 'visual', time: null });
  open();

  chooseFile(
    backupFile([
      { key: KEYS.ONBOARDING_PREFERENCES, value: { domain: 'history', style: 'textual', time: '10 minutes' } },
      { key: KEYS.QUESTION_DESK, value: [{ question: 'Restored question' }] },
    ]),
  );
  await waitForBackup();

  expect(within(chosenBackup()).getByText(/2 saved keys/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /restore this file/i }));

  expect(screen.getByText(/2 keys restored/i)).toBeInTheDocument();
  expect(stored().data.style).toBe('textual');
  // The control above has to move with the restore, not keep showing the value
  // from before the file was read.
  expect(screen.getByRole('button', { name: 'Textual' })).toHaveAttribute('aria-pressed', 'true');
  expect(chosenBackup()).not.toBeInTheDocument();
});

test('refuses a file that is not a backup, before writing anything', async () => {
  writeValue(KEYS.QUESTION_DESK, [{ question: 'Still here' }]);
  open();

  chooseFile(JSON.stringify({ hello: 'world' }));

  await waitFor(() => expect(screen.getByText(/not a VELORA backup/i)).toBeInTheDocument());
  expect(chosenBackup()).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /restore this file/i })).not.toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem(KEYS.QUESTION_DESK)).data).toEqual([
    { question: 'Still here' },
  ]);
});

test('says why a file could not be read rather than failing silently', async () => {
  open();
  chooseFile('this is not json');
  await waitFor(() => expect(screen.getByText(/not JSON/i)).toBeInTheDocument());
});

test('replace mode asks twice, because it deletes what the file does not contain', async () => {
  writeValue(KEYS.MYTH_STREAK, 4);
  open();

  chooseFile(backupFile([{ key: KEYS.QUESTION_DESK, value: [] }]));
  await waitForBackup();

  fireEvent.click(screen.getByRole('button', { name: /replace everything here/i }));
  fireEvent.click(screen.getByRole('button', { name: /restore this file/i }));

  // First press only explains; nothing has been written or removed yet.
  expect(screen.getByText(/press again/i)).toBeInTheDocument();
  expect(window.localStorage.getItem(KEYS.MYTH_STREAK)).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /replace everything now/i }));

  // The count of replaced keys includes the theme, which the provider stores
  // like everything else, so it is asserted as a shape rather than a number.
  expect(screen.getByText(/1 key restored, \d+ replaced/i)).toBeInTheDocument();
  expect(window.localStorage.getItem(KEYS.MYTH_STREAK)).toBeNull();
});

test('merge mode restores in one press and keeps what the file omits', async () => {
  writeValue(KEYS.MYTH_STREAK, 4);
  open();

  chooseFile(backupFile([{ key: KEYS.QUESTION_DESK, value: [] }]));
  await waitForBackup();

  fireEvent.click(screen.getByRole('button', { name: /restore this file/i }));

  expect(screen.getByText(/1 key restored/i)).toBeInTheDocument();
  expect(window.localStorage.getItem(KEYS.MYTH_STREAK)).not.toBeNull();
});

test('says how much is stored, in named rows rather than key strings', () => {
  writeValue(KEYS.QUESTION_DESK, [{ question: 'x'.repeat(400) }]);
  writeValue(KEYS.GAME_RESULTS, { scrabble: { best: 10, max: 20, plays: 1 } });
  open();

  const region = screen.getByRole('region', { name: /what is stored/i });
  expect(within(region).getByRole('status')).toHaveTextContent(/saved items in this browser/i);

  const rows = within(region).getByRole('list', { name: /largest saved items/i });
  expect(within(rows).getByText('Question desk')).toBeInTheDocument();
  expect(within(rows).getByText('Game results')).toBeInTheDocument();
  // The raw key is not something a person can act on, and it must not leak in.
  expect(within(region).queryByText(/velora_/)).not.toBeInTheDocument();
  // The largest row is listed first.
  const names = within(rows)
    .getAllByRole('listitem')
    .map((row) => row.textContent);
  expect(names[0]).toMatch(/Question desk/);
});

test('lists at most six rows and counts the rest', () => {
  Object.values(KEYS)
    .filter((key) => key.startsWith('velora_') && !key.includes('PREFIX') && key !== KEYS.THEME)
    .slice(0, 8)
    .forEach((key, index) => writeValue(key, 'x'.repeat(10 * (index + 1))));
  open();

  const rows = screen.getByRole('list', { name: /largest saved items/i });
  expect(within(rows).getAllByRole('listitem')).toHaveLength(6);
  expect(screen.getByText(/and \d+ smaller items?/i)).toBeInTheDocument();
});

test('goes back to the atlas', () => {
  const setScreen = jest.fn();
  open({ setScreen });
  fireEvent.click(screen.getByRole('button', { name: /back to the atlas/i }));
  expect(setScreen).toHaveBeenCalledWith('universe');
});
