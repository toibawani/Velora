import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { PHYSICS_CURRICULUM } from '../data/physicsCurriculum';

/**
 * The four Modern Physics lessons, rendered the way Learn.js renders them.
 *
 * Special and General Relativity are deliberately not here: the Atlas lists
 * them and the black hole deep read answers both, and the resolver checks deep
 * reads before lessons, so a lesson called "Special Relativity" would be a
 * downgrade that never opened. These four are the Modern Physics topics with no
 * other content behind them.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const modern = PHYSICS_CURRICULUM.modules.find((m) => m.id === 'modern-physics');
const withMeta = (topic) => ({ ...topic, moduleTitle: modern.title });

const renderLesson = (topic) =>
  render(<LessonReader topic={withMeta(topic)} subject="physics" onBack={() => {}} showToast={() => {}} />);

// The reader's body is the page's <main>, so it is reachable by role and the
// tests do not need the render result at all.
const mainText = () => screen.getByRole('main').textContent || '';

beforeEach(() => localStorage.clear());

test('the modern physics module holds the four topics with no other content behind them', () => {
  expect(modern.topics.map((t) => t.title)).toEqual([
    'Photoelectric Effect',
    'Atomic Physics',
    'Nuclear Physics',
    'Particle Physics',
  ]);
  expect(modern.topics.map((t) => t.id)).toEqual([
    'photoelectric-effect',
    'atomic-physics',
    'nuclear-physics',
    'particle-physics',
  ]);
  // The two relativity topics are answered by the deep read. A lesson with the
  // same name would lose to it silently, so this asserts they were not added.
  expect(modern.topics.map((t) => t.title)).not.toContain('Special Relativity');
  expect(modern.topics.map((t) => t.title)).not.toContain('General Relativity');
});

describe('each modern physics lesson renders its core parts', () => {
  modern.topics.forEach((topic) => {
    test(`renders "${topic.title}" with kicker, sections, sources and connections`, () => {
      renderLesson(topic);

      expect(screen.getByRole('heading', { level: 1, name: topic.title })).toBeInTheDocument();
      expect(screen.getByText(topic.kicker)).toBeInTheDocument();
      topic.sections.forEach((section) => {
        expect(screen.getByRole('heading', { level: 2, name: section.heading })).toBeInTheDocument();
      });
      topic.sources.forEach((source) => {
        const link = screen.getByRole('link', { name: source.label });
        expect(link).toHaveAttribute('href', source.url);
        expect(link).toHaveAttribute('target', '_blank');
      });
      topic.connections.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
      expect(screen.getByRole('heading', { level: 2, name: 'Where the edge is' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Where this came from' })).toBeInTheDocument();
    });
  });
});

test('every {{term}} in these lessons resolves to a glossary definition', () => {
  const terms = new Set();
  modern.topics.forEach((topic) => {
    [topic.story, ...topic.sections.flatMap((s) => [s.heading, s.body]), topic.uncertainty, topic.career]
      .join(' ')
      .replace(/\{\{([a-z][a-zA-Z /-]*?)(\|[^}]*)?\}\}/g, (_, term) => {
        terms.add(term.trim());
        return '';
      });
  });

  expect(terms.size).toBeGreaterThanOrEqual(2);
  terms.forEach((term) => {
    const { unmount } = render(
      <LessonReader
        topic={withMeta({ ...modern.topics[0], story: `{{${term}|${term}}}`, sections: [], connections: [], sources: [], uncertainty: '', career: '' })}
        subject="physics"
        onBack={() => {}}
        showToast={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: new RegExp(`define ${term}`, 'i') })).toBeInTheDocument();
    unmount();
  });
});

describe('the concrete facts the lessons claim actually render', () => {
  const lesson = (id) => modern.topics.find((t) => t.id === id);

  test('Photoelectric Effect works caesium against green and red light', () => {
    renderLesson(lesson('photoelectric-effect'));
    expect(mainText()).toMatch(/Heinrich Hertz noticed in 1887/);
    expect(mainText()).toMatch(/In 1905 Einstein proposed that light arrives in quanta/);
    expect(mainText()).toMatch(/Caesium has a work function of about 2\.1 electronvolts/);
    expect(mainText()).toMatch(/Green light at 550 nanometres carries 2\.25 electronvolts/);
    expect(mainText()).toMatch(/threshold for caesium sits at about 590 nanometres/);
  });

  test('Atomic Physics carries Rutherford 1911, Balmer 1885 and the Bohr radius', () => {
    renderLesson(lesson('atomic-physics'));
    expect(mainText()).toMatch(/about one in 8,000 came almost straight back/);
    expect(mainText()).toMatch(/Johann Balmer noticed in 1885/);
    expect(mainText()).toMatch(/H-alpha at 656\.3 nanometres/);
    expect(mainText()).toMatch(/Bohr radius comes out at 0\.0529 nanometres/);
    expect(mainText()).toMatch(/Franck-Hertz experiment in 1914/);
  });

  test('Nuclear Physics works the binding energy and dates the chain reaction', () => {
    renderLesson(lesson('nuclear-physics'));
    expect(mainText()).toMatch(/One atomic mass unit is 931\.5 megaelectronvolts/);
    expect(mainText()).toMatch(/about 7 MeV per nucleon/);
    expect(mainText()).toMatch(/Lise Meitner and Otto Frisch worked out the interpretation/);
    expect(mainText()).toMatch(/at Chicago on 2 December 1942/);
    expect(mainText()).toMatch(/Carbon-14 has a half-life of 5,730 years/);
  });

  test('Particle Physics lists the model and the 4 July 2012 announcement', () => {
    renderLesson(lesson('particle-physics'));
    expect(mainText()).toMatch(/six quarks, named up, down, charm, strange, top and bottom/);
    expect(mainText()).toMatch(/J\. J\. Thomson found the electron in 1897/);
    expect(mainText()).toMatch(/the J\/psi discovery in November 1974/);
    expect(mainText()).toMatch(/the Higgs at CERN on 4 July 2012/);
    expect(mainText()).toMatch(/27 kilometre ring/);
  });
});
