import React from 'react';
import { render, screen } from '@testing-library/react';
import Learn from './Learn';
import { CURRICULUM } from '../data/curriculum';
import { recordStudySession } from '../utils/analyticsStorage';

// The lesson body and the performance probe are noise for these assertions, and
// the probe would otherwise wrap the module mapping we are testing.
jest.mock('../components/LessonReader', () => () => null);

const moduleOne = CURRICULUM.physics.modules[0];

beforeEach(() => {
  localStorage.clear();
});

const open = () => render(
  <Learn
    setScreen={jest.fn()}
    selectedSubject="physics"
    setSelectedSubject={jest.fn()}
    initialView="overview"
    setInitialView={jest.fn()}
  />,
);

test('a subject nobody has opened claims no progress', () => {
  open();

  // The first module used to read "in progress" for every learner, because the
  // code marked index === 0 started rather than asking whether anyone studied it.
  expect(screen.getAllByText('Not started').length).toBeGreaterThan(1);
  expect(screen.queryByText(/of \d+ topics logged/)).not.toBeInTheDocument();
});

test('a module is only started once the learner has time on one of its topics', () => {
  recordStudySession(moduleOne.topics[0].title, 10, 'physics');

  open();

  expect(screen.getByText(`1 of ${moduleOne.topics.length} topics logged`)).toBeInTheDocument();
});

test('progress counts the topics logged, not a fixed zero', () => {
  moduleOne.topics.slice(0, 2).forEach((topic) => recordStudySession(topic.title, 5, 'physics'));

  const { container } = open();
  const expected = `${Math.round((2 / moduleOne.topics.length) * 100)}%`;

  expect(container.querySelector('.progress-text').textContent).toBe(expected);
});

test('time logged in another subject does not start this one', () => {
  recordStudySession(CURRICULUM.philosophy.modules[0].topics[0].title, 15, 'philosophy');

  open();

  expect(screen.queryByText(/topics logged/)).not.toBeInTheDocument();
});
