import React from 'react';
import { render, screen } from '@testing-library/react';
import LearningAnalytics from './LearningAnalytics';
import { recordStudySession } from '../utils/analyticsStorage';

beforeEach(() => localStorage.clear());

// currentStreak and topicsCompleted are declared in the storage defaults and
// written by nothing, so the tiles built from them displayed a permanent zero.
test('gives up the metrics nothing writes', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');

  render(<LearningAnalytics selectedSubject="biology" />);

  expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
  expect(screen.queryByText('0 days')).not.toBeInTheDocument();
  expect(screen.queryByText(/^Topics Done$/)).not.toBeInTheDocument();
});

test('counts the subject it was handed rather than the whole device', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');
  recordStudySession('Bayesian Updating', 30, 'philosophy');

  render(<LearningAnalytics selectedSubject="philosophy" />);

  expect(screen.getByText('0.5 hours')).toBeInTheDocument();
  expect(screen.queryByText(/Plate Tectonics/)).not.toBeInTheDocument();
  // Sessions stay a device-wide number, because the log does not split them.
  expect(screen.getByText(/2 sessions closed on this device/)).toBeInTheDocument();
});

test('names the topic the time actually went to', () => {
  recordStudySession('Small Topic', 20, 'physics');
  recordStudySession('Long Topic', 100, 'physics');

  render(<LearningAnalytics selectedSubject="physics" />);

  expect(screen.getByText('Long Topic (1.7h)')).toBeInTheDocument();
});

test('says so when the subject is untouched', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');

  render(<LearningAnalytics selectedSubject="history" />);

  expect(screen.getByText(/Nothing has been read in History yet/)).toBeInTheDocument();
  expect(screen.getAllByText('—')).toHaveLength(3);
});
