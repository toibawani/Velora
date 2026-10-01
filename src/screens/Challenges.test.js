import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Challenges from './Challenges';
import { CURRICULUM } from '../data/curriculum';
import { recordStudySession } from '../utils/analyticsStorage';

const open = (props = {}) => render(<Challenges setScreen={jest.fn()} {...props} />);

beforeEach(() => {
  localStorage.clear();
});

test('invented people, scarcity and progress are not recoverable from the screen', () => {
  const { container } = open();
  const text = container.textContent;

  // Every phrase here used to be printed as fact by the old version of this
  // screen. None of them can be observed by an app with no server.
  [
    /spots left/i,
    /out of 100/i,
    /participants/i,
    /Genesis/i,
    /leaderboard|standings/i,
    /days? remaining/i,
    /Day \d+ of \d+/i,
    /Talia|Devon|Kenji|Maya/i,
  ].forEach((pattern) => expect(text).not.toMatch(pattern));
});

test('the paths listed are the modules the curriculum actually has', () => {
  open();

  CURRICULUM.physics.modules.forEach((module) => {
    expect(screen.getByText(module.title)).toBeInTheDocument();
    module.topics.forEach((topic) => {
      expect(screen.getByText(topic.title)).toBeInTheDocument();
    });
  });
});

test('a lesson nobody has opened is not ticked', () => {
  open({ onOpenLesson: jest.fn() });

  expect(screen.getByText(/no time logged yet/i)).toBeInTheDocument();
  expect(screen.queryByText(/min logged/i)).not.toBeInTheDocument();
  const lessons = CURRICULUM.physics.modules.reduce((t, m) => t + m.topics.length, 0);
  expect(screen.getAllByRole('button', { name: /^Start/ })).toHaveLength(lessons);
});

test('a Start button that could not start anything is not rendered', () => {
  open();

  // Without a handler wired to open a lesson, the button would be a decoration.
  expect(screen.queryAllByRole('button', { name: /^Start/ })).toHaveLength(0);
});

test('time logged on a lesson ticks that lesson and only that lesson', () => {
  const [first, second] = CURRICULUM.physics.modules[0].topics;
  recordStudySession(first.title, 30, 'physics');

  open({ onOpenLesson: jest.fn() });

  expect(screen.getByText(first.title)).toBeInTheDocument();
  expect(screen.getByText('30 min logged')).toBeInTheDocument();
  expect(screen.getByText(`${second.minutes} min read`)).toBeInTheDocument();
  expect(screen.getByText(/1 of 3/)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Open again/ })).toHaveLength(1);
});

test('starting a lesson asks for that lesson, not for the Learn screen', () => {
  const onOpenLesson = jest.fn();
  open({ onOpenLesson });

  fireEvent.click(screen.getAllByRole('button', { name: /^Start/ })[0]);

  expect(onOpenLesson).toHaveBeenCalledWith('physics', CURRICULUM.physics.modules[0].topics[0].id);
});

test('another subject starts clean: progress does not leak across', () => {
  recordStudySession(CURRICULUM.physics.modules[0].topics[0].title, 45, 'physics');

  open();
  fireEvent.click(screen.getByRole('tab', { name: 'History' }));

  expect(screen.getByText(/no time logged yet/i)).toBeInTheDocument();
  CURRICULUM.history.modules.forEach((module) => {
    expect(screen.getByText(module.title)).toBeInTheDocument();
  });
});
