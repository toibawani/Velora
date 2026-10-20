import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { PHYSICS_CURRICULUM } from '../data/physicsCurriculum';

/**
 * The four Waves lessons, rendered the way Learn.js renders them.
 *
 * Same contract as the Electromagnetism and Optics test files. The Atlas lists
 * these four titles under Physics > Waves and matches them by slug, so the
 * titles are asserted exactly.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const waves = PHYSICS_CURRICULUM.modules.find((m) => m.id === 'waves');
const withMeta = (topic) => ({ ...topic, moduleTitle: waves.title });

const renderLesson = (topic) =>
  render(<LessonReader topic={withMeta(topic)} subject="physics" onBack={() => {}} showToast={() => {}} />);

const mainText = (container) => container.querySelector('.lesson-reader-main').textContent || '';

beforeEach(() => localStorage.clear());

test('the waves module holds the four Atlas topics, in Atlas order', () => {
  expect(waves.topics.map((t) => t.title)).toEqual([
    'Mechanical Waves',
    'Sound',
    'Wave Motion',
    'Resonance',
  ]);
  expect(waves.topics.map((t) => t.id)).toEqual([
    'mechanical-waves',
    'sound',
    'wave-motion',
    'resonance',
  ]);
});

describe('each waves lesson renders its core parts', () => {
  waves.topics.forEach((topic) => {
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
  waves.topics.forEach((topic) => {
    [topic.story, ...topic.sections.flatMap((s) => [s.heading, s.body]), topic.uncertainty, topic.career]
      .join(' ')
      .replace(/\{\{([a-z][a-zA-Z /-]*?)(\|[^}]*)?\}\}/g, (_, term) => {
        terms.add(term.trim());
        return '';
      });
  });

  expect(terms.size).toBeGreaterThanOrEqual(3);
  terms.forEach((term) => {
    const { unmount } = render(
      <LessonReader
        topic={withMeta({ ...waves.topics[0], story: `{{${term}|${term}}}`, sections: [], connections: [], sources: [], uncertainty: '', career: '' })}
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
  const lesson = (id) => waves.topics.find((t) => t.id === id);

  test('Mechanical Waves works the string speed and names Oldham 1906', () => {
    const { container } = renderLesson(lesson('mechanical-waves'));
    expect(mainText(container)).toMatch(/the square root of 20,000, about 141 metres per second/);
    expect(mainText(container)).toMatch(/P waves travel at roughly 6 to 8 kilometres per second/);
    expect(mainText(container)).toMatch(/Richard Oldham noticed the missing S waves in 1906/);
  });

  test('Sound carries the speeds, the hearing range and the decibel reference', () => {
    const { container } = renderLesson(lesson('sound'));
    expect(mainText(container)).toMatch(/about 343 metres per second at 20 degrees Celsius/);
    expect(mainText(container)).toMatch(/about 1,480 metres per second and steel about 5,000/);
    expect(mainText(container)).toMatch(/about 20 hertz to 20 kilohertz/);
    expect(mainText(container)).toMatch(/20 micropascals/);
    expect(mainText(container)).toMatch(/on 14 October 1947/);
  });

  test('Wave Motion works a wavelength, a beat and the fundamental', () => {
    const { container } = renderLesson(lesson('wave-motion'));
    expect(mainText(container)).toMatch(/a 440 hertz tone in air has a wavelength of 0\.78 metres/);
    expect(mainText(container)).toMatch(/Two tuning forks at 440 and 444 hertz produce a beat every quarter second/);
    expect(mainText(container)).toMatch(/The beat frequency is the difference, not the average/);
  });

  test('Resonance dates Tacoma Narrows and names the dispute about it', () => {
    const { container } = renderLesson(lesson('resonance'));
    expect(mainText(container)).toMatch(/on 7 November 1940 in a steady wind of about 19 metres per second/);
    expect(mainText(container)).toMatch(/In 1991 Billah and Scanlan went through the film/);
    expect(mainText(container)).toMatch(/opened on 10 June 2000 and closed two days later/);
  });
});
