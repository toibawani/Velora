import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { PHYSICS_CURRICULUM } from '../data/physicsCurriculum';

/**
 * The seven Optics lessons, rendered the way Learn.js renders them.
 *
 * Same contract as ElectromagnetismLessons.test.js: the data reaches the page,
 * every {{term}} resolves, the sources are links, and the dates and numbers the
 * prose claims survive rendering. The Atlas lists these seven topics under
 * Physics > Optics and matches them by the slug of the title, so the titles are
 * asserted exactly.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const optics = PHYSICS_CURRICULUM.modules.find((m) => m.id === 'optics');
const withMeta = (topic) => ({ ...topic, moduleTitle: optics.title });

const renderLesson = (topic) =>
  render(<LessonReader topic={withMeta(topic)} subject="physics" onBack={() => {}} showToast={() => {}} />);

const mainText = (container) => container.querySelector('.lesson-reader-main').textContent || '';

beforeEach(() => localStorage.clear());

test('the optics module holds the seven Atlas topics, in Atlas order', () => {
  expect(optics.topics.map((t) => t.title)).toEqual([
    'Reflection',
    'Refraction',
    'Lenses',
    'Mirrors',
    'Interference',
    'Diffraction',
    'Polarization',
  ]);
  expect(optics.topics.map((t) => t.id)).toEqual([
    'reflection',
    'refraction',
    'lenses',
    'mirrors',
    'interference',
    'diffraction',
    'polarization',
  ]);
});

describe('each optics lesson renders its core parts', () => {
  optics.topics.forEach((topic) => {
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
  optics.topics.forEach((topic) => {
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
        topic={withMeta({ ...optics.topics[0], story: `{{${term}|${term}}}`, sections: [], connections: [], sources: [], uncertainty: '', career: '' })}
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
  const lesson = (id) => optics.topics.find((t) => t.id === id);

  test('Reflection carries the angle rule, the corner cube and the lunar laser ranging', () => {
    const { container } = renderLesson(lesson('reflection'));
    expect(mainText(container)).toMatch(/Euclid stated this around 300 BC in the Catoptrics/);
    expect(mainText(container)).toMatch(/about 500 nanometres for visible light/);
    expect(mainText(container)).toMatch(/Apollo 11 left an array of them on the Moon in July 1969/);
    expect(mainText(container)).toMatch(/3\.8 centimetres a year/);
  });

  test('Refraction carries Snell 1621, the speed in water and the critical angles', () => {
    const { container } = renderLesson(lesson('refraction'));
    expect(mainText(container)).toMatch(/Willebrord Snell found the relation in 1621/);
    expect(mainText(container)).toMatch(/René Descartes published the same law in 1637/);
    expect(mainText(container)).toMatch(/about 225,000 kilometres per second/);
    expect(mainText(container)).toMatch(/48\.6 degrees/);
    expect(mainText(container)).toMatch(/below 20 decibels per kilometre in 1970/);
  });

  test('Lenses works the thin lens equation through a real example', () => {
    const { container } = renderLesson(lesson('lenses'));
    expect(mainText(container)).toMatch(/the image distance is 15 centimetres/);
    expect(mainText(container)).toMatch(/minus 0\.5, so the image is half the size and inverted/);
    expect(mainText(container)).toMatch(/about 60 dioptres/);
    expect(mainText(container)).toMatch(/a 50 millimetre lens at f\/1\.8 has an aperture near 28 millimetres/);
    expect(mainText(container)).toMatch(/Chester Moore Hall built the first achromatic doublet in 1733/);
  });

  test('Mirrors carries the curved-mirror example and the Hubble mirror error', () => {
    const { container } = renderLesson(lesson('mirrors'));
    expect(mainText(container)).toMatch(/a radius of 60 centimetres: its focal length is 30/);
    expect(mainText(container)).toMatch(/the image distance is 90, with a magnification of minus 2/);
    expect(mainText(container)).toMatch(/about 2\.2 micrometres at the edge/);
    expect(mainText(container)).toMatch(/Hubble launched in April 1990/);
    expect(mainText(container)).toMatch(/installed corrective optics in December 1993/);
  });

  test('Interference dates Young and gives a fringe spacing a reader could check', () => {
    const { container } = renderLesson(lesson('interference'));
    expect(mainText(container)).toMatch(/on 24 November 1801/);
    expect(mainText(container)).toMatch(/the bands are 2\.2 millimetres apart/);
    expect(mainText(container)).toMatch(/On 14 September 2015 it detected a strain of about 10\^-21/);
    expect(mainText(container)).toMatch(/a thousandth of the width of a proton/);
  });

  test('Diffraction carries the Rayleigh figure, Photo 51 and the 2014 Nobel', () => {
    const { container } = renderLesson(lesson('diffraction'));
    expect(mainText(container)).toMatch(/Rayleigh stated the working rule in 1879/);
    expect(mainText(container)).toMatch(/0\.058 arcseconds/);
    expect(mainText(container)).toMatch(/Photo 51 of DNA in May 1952/);
    expect(mainText(container)).toMatch(/published their model in April 1953/);
    expect(mainText(container)).toMatch(/Ernst Abbe stated in 1873/);
    expect(mainText(container)).toMatch(/The 2014 Nobel Prize in Chemistry/);
  });

  test('Polarization carries Malus 1808, Brewster 1815 and the 2022 Nobel', () => {
    const { container } = renderLesson(lesson('polarization'));
    expect(mainText(container)).toMatch(/Étienne-Louis Malus worked this out in 1808/);
    expect(mainText(container)).toMatch(/David Brewster showed in 1815/);
    expect(mainText(container)).toMatch(/about 56 degrees for glass and 53 for water/);
    expect(mainText(container)).toMatch(/Edwin Land made the first practical polarising sheet in 1928/);
    expect(mainText(container)).toMatch(/The 2022 Nobel Prize in Physics/);
  });
});
