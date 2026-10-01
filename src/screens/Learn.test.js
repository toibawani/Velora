import React from 'react';
import { render, screen } from '@testing-library/react';
import Learn from './Learn';
import { CURRICULUM } from '../data/curriculum';
import { recordStudySession } from '../utils/analyticsStorage';

// The lesson body and the performance probe are noise for these assertions, and
// the probe would otherwise wrap the module mapping we are testing. The mock
// announces what it was handed so the tests can name the lesson that opened.
jest.mock('../components/LessonReader', () => ({ topic, subject }) => (
  <div data-testid="reader">{`reading:${subject}:${topic && topic.title}`}</div>
));

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

test('a lesson request from another screen opens that exact lesson', () => {
  const onLessonOpened = jest.fn();

  render(
    <Learn
      setScreen={jest.fn()}
      selectedSubject="physics"
      setSelectedSubject={jest.fn()}
      initialView="overview"
      setInitialView={jest.fn()}
      pendingTopic={{ subject: 'physics', topicId: 'black-holes' }}
      onLessonOpened={onLessonOpened}
    />,
  );

  // 'black-holes' is the only topic in its module and is not the first topic of
  // the subject, so this fails if the request is ignored or answered with the
  // nearest-looking lesson instead of the named one.
  expect(screen.getByTestId('reader').textContent).toBe('reading:physics:Black Holes');
  expect(onLessonOpened).toHaveBeenCalled();
});

test('a lesson request for a topic the curriculum does not have opens nothing', () => {
  const onLessonOpened = jest.fn();

  render(
    <Learn
      setScreen={jest.fn()}
      selectedSubject="physics"
      setSelectedSubject={jest.fn()}
      initialView="overview"
      setInitialView={jest.fn()}
      pendingTopic={{ subject: 'physics', topicId: 'no-such-topic' }}
      onLessonOpened={onLessonOpened}
    />,
  );

  expect(screen.queryByTestId('reader')).not.toBeInTheDocument();
  expect(onLessonOpened).toHaveBeenCalled();
});

test('time logged in another subject does not start this one', () => {
  recordStudySession(CURRICULUM.philosophy.modules[0].topics[0].title, 15, 'philosophy');

  open();

  expect(screen.queryByText(/topics logged/)).not.toBeInTheDocument();
});
