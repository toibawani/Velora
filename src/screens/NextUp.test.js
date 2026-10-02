import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NextUp from './NextUp';
import { KEYS, readValue } from '../utils/storage';
import { MAX_LENGTH } from '../utils/nextUp';

const open = (props = {}) => render(<NextUp setScreen={jest.fn()} {...props} />);

const add = (text) => {
  fireEvent.change(screen.getByLabelText(/what do you want to come back to/i), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole('button', { name: /add it/i }));
};

const stored = () => readValue(KEYS.TASKS, []);

beforeEach(() => {
  localStorage.clear();
});

test('says the list is empty rather than showing a blank space', () => {
  open();
  // The empty state has to say what an empty list means here, or it reads as a
  // failure to load rather than an honest nothing-yet.
  expect(screen.getByRole('heading', { name: /nothing waiting/i })).toBeInTheDocument();
  expect(screen.getByText(/the list is empty/i)).toBeInTheDocument();
});

test('adds an item and shows it', () => {
  open();
  add('Look into Hawking radiation properly');

  expect(screen.getByText('Look into Hawking radiation properly')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /1 waiting/i })).toBeInTheDocument();
  // The form clears, so the same text is not submitted twice by a second click.
  expect(screen.getByLabelText(/what do you want to come back to/i)).toHaveValue('');
});

test('the list is still there after a reload', () => {
  const first = open();
  add('Find the primary source for that Nietzsche quote');
  first.unmount();

  // Remounted from storage only, which is what a reload does. A list held in
  // component state would come back empty here.
  open();

  expect(screen.getByText('Find the primary source for that Nietzsche quote')).toBeInTheDocument();
  expect(screen.queryByText(/the list is empty/i)).not.toBeInTheDocument();
});

test('says out loud when the browser refuses the write', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('denied');
  });

  try {
    open();
    add('This one will not be stored anywhere');

    // The acceptance criterion. Without this the item would appear in the list
    // and vanish on the next render, with no indication anything went wrong.
    expect(screen.getByRole('alert')).toHaveTextContent(/refused to save/i);
    // readValue hands back the caller's fallback when the key is absent, so
    // this asserts nothing was written rather than pinning one fallback shape.
    expect(stored()).toEqual([]);
  } finally {
    setItem.mockRestore();
  }
});

test('distinguishes a full storage quota from a refused write', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });

  try {
    open();
    add('One more thing for the list');
    // "Out of storage space" tells someone the list is still there and the
    // browser is full, which is a different problem from private mode.
    expect(screen.getByRole('alert')).toHaveTextContent(/out of storage space/i);
  } finally {
    setItem.mockRestore();
  }
});

test('clears a stale warning once a write succeeds', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('denied');
  });
  try {
    open();
    add('A first item that fails');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  } finally {
    setItem.mockRestore();
  }

  add('A second item that works');

  // Otherwise a warning about one failed write sits above a list that is
  // working, telling someone their later items are not being kept.
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByText('A second item that works')).toBeInTheDocument();
});

test('will not submit an item that is too short to mean anything', () => {
  open();
  fireEvent.change(screen.getByLabelText(/what do you want to come back to/i), {
    target: { value: 'no' },
  });

  expect(screen.getByRole('button', { name: /add it/i })).toBeDisabled();
  expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
});

test('will not submit an item past the length limit', () => {
  open();
  fireEvent.change(screen.getByLabelText(/what do you want to come back to/i), {
    target: { value: 'x'.repeat(MAX_LENGTH + 1) },
  });

  expect(screen.getByRole('button', { name: /add it/i })).toBeDisabled();
  expect(screen.getByText(new RegExp(`Too long: ${MAX_LENGTH + 1}`))).toBeInTheDocument();
});

test('marks an item done, then reopens it', () => {
  open();
  add('Revisit the entropy section');

  fireEvent.click(screen.getByRole('button', { name: /mark .* as done/i }));

  expect(screen.getByRole('heading', { name: /done, 1/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /nothing waiting/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /move .* back to the list/i }));

  expect(screen.getByRole('heading', { name: /1 waiting/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /done, 1/i })).not.toBeInTheDocument();
});

test('deletes an item', () => {
  open();
  add('A thing that gets deleted');
  add('A thing that stays on the list');

  fireEvent.click(screen.getByRole('button', { name: /delete "A thing that gets deleted"/i }));

  expect(screen.queryByText('A thing that gets deleted')).not.toBeInTheDocument();
  expect(screen.getByText('A thing that stays on the list')).toBeInTheDocument();
});

test('removes the done items in one action, leaving the open ones', () => {
  open();
  add('First thing to finish');
  add('Second thing to finish');
  add('Third thing still open');

  fireEvent.click(screen.getAllByRole('button', { name: /mark .* as done/i })[0]);
  fireEvent.click(screen.getAllByRole('button', { name: /mark .* as done/i })[0]);
  expect(screen.getByRole('heading', { name: /done, 2/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /remove the 2 done items/i }));

  expect(screen.queryByRole('heading', { name: /done, 2/i })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /1 waiting/i })).toBeInTheDocument();
});

test('every action names the item it acts on, for a screen reader', () => {
  open();
  add('A specific item that needs naming in its buttons');

  // Three items in a list with buttons all called "Done" is unusable without
  // sight. The name carries the text, so the control says what it will do.
  expect(
    screen.getByRole('button', { name: /mark "A specific item that needs naming in its buttons" as done/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /delete "A specific item that needs naming in its buttons"/i })
  ).toBeInTheDocument();
});

test('links an item to a lesson that exists, and opens it', () => {
  const onOpenLesson = jest.fn();
  open({ onOpenLesson });

  const topicSelect = screen.getByLabelText(/related lesson/i);
  const firstLesson = [...topicSelect.options].find((option) => option.value !== '');
  fireEvent.change(topicSelect, { target: { value: firstLesson.value } });
  add('Go back to that lesson about the first topic');

  fireEvent.click(screen.getByRole('button', { name: /open that lesson/i }));

  // The link is only there because the topic resolves against the real
  // curriculum, so the button cannot point at a lesson that is not there.
  expect(onOpenLesson).toHaveBeenCalledWith('physics', firstLesson.value);
});

test('changing the field clears the lesson, which would not exist under it', () => {
  open();

  const topicSelect = screen.getByLabelText(/related lesson/i);
  const firstLesson = [...topicSelect.options].find((option) => option.value !== '');
  fireEvent.change(topicSelect, { target: { value: firstLesson.value } });

  fireEvent.change(screen.getByLabelText(/^field/i), { target: { value: 'history' } });

  // A physics topic id left selected under History would store a reference that
  // resolves to nothing, and the item would show a lesson nobody can open.
  expect(topicSelect).toHaveValue('');
});

test('promises no reminders or due dates', () => {
  open();
  // The brief rules out implying a backend that does not exist. A due-date
  // field on something in one browser cannot fire once the tab is closed.
  expect(screen.getByText(/no due dates and no reminders here/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/due/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: /date/i })).not.toBeInTheDocument();
});

test('goes back to the atlas', () => {
  const setScreen = jest.fn();
  open({ setScreen });
  fireEvent.click(screen.getByRole('button', { name: /back to the atlas/i }));
  expect(setScreen).toHaveBeenCalledWith('universe');
});

