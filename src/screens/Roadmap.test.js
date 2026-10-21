import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Roadmap from './Roadmap';
import { lessonTopicCount, atlasTopicCount, atlasWrittenCount } from '../roadmap';

const open = () => render(<Roadmap setScreen={jest.fn()} />);

test('separates what works from what is half-built from what is gone', () => {
  open();
  // These three headings are the entire reason the page exists. A version that
  // merged them into one "features" list would answer none of the questions a
  // visitor actually has.
  expect(screen.getByRole('heading', { name: 'Working now' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Partly built' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Not started' })).toBeInTheDocument();
});

test('says collaboration was removed and why, rather than dropping it', () => {
  open();
  // The brief asks for this by name. A roadmap that omits a deleted feature is
  // indistinguishable from one that never had it, so the removal has to be
  // visible on the page and not only in a commit message.
  expect(screen.getByRole('heading', { name: 'Collaboration' })).toBeInTheDocument();
  // Several rows are removed, so this one is scoped to the Collaboration entry
  // rather than asserting on the first "Removed." anywhere on the page.
  const row = screen
    .getAllByTestId('roadmap-item')
    .find((item) => within(item).queryByRole('heading', { name: 'Collaboration' }));
  expect(within(row).getByText('Removed')).toBeInTheDocument();
  expect(within(row).getByText(/needs a backend/i)).toBeInTheDocument();
});

test('marks each row with a state rather than leaving it to be guessed', () => {
  open();
  expect(screen.getAllByText('Working').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Partly built').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Removed').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Not started').length).toBeGreaterThan(0);
});

test('states the gap between atlas topics and written lessons', () => {
  open();
  // This is the fact a reader most needs and least likely to guess. Scoped to
  // the row, because the footer also names both numbers.
  const row = screen
    .getAllByTestId('roadmap-item')
    .find((item) => within(item).queryByRole('heading', { name: /atlas has far more topics/i }));
  expect(within(row).getByText(new RegExp(`${atlasTopicCount} topics`))).toBeInTheDocument();
  // The row has to name the count of topics that actually open something, not
  // just the lesson count: the deep reads hold written content that is not a
  // lesson in the curriculum, so the lesson count on its own understates what
  // a reader can open.
  expect(within(row).getByText(new RegExp(`Written content exists for ${atlasWrittenCount}`))).toBeInTheDocument();
  expect(within(row).getByText(new RegExp(`${lessonTopicCount} lessons in the curriculum`))).toBeInTheDocument();
});

test('promises no backend, in the intro where it belongs', () => {
  open();
  // getAllByText because the intro and the Collaboration row both say "no
  // server"; both are correct and neither should be pinned to one location.
  expect(screen.getAllByText(/no server/i).length).toBeGreaterThan(0);
  // And no delivery promise anywhere on the page.
  expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
});

test('goes back to the atlas', () => {
  const setScreen = jest.fn();
  render(<Roadmap setScreen={setScreen} />);
  fireEvent.click(screen.getByRole('button', { name: /back to the atlas/i }));
  expect(setScreen).toHaveBeenCalledWith('universe');
});
