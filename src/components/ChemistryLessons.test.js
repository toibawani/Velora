import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { CURRICULUM } from '../data/curriculum';
import { resolveAtlasTopic } from '../data/atlasResolution';

/**
 * The seven Chemistry lessons.
 *
 * The point of this file is not only that the prose renders, but that the Atlas
 * can reach it. Chemistry sits inside the Science field, and for a long time the
 * resolver mapped the whole field to the physics curriculum, so a chemistry
 * topic could never resolve whatever was written. Both halves are asserted: the
 * lesson renders, and the Atlas tap that should open it does.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const chemistry = CURRICULUM.chemistry;
const withMeta = (topic) => ({ ...topic, moduleTitle: chemistry.modules[0].title });

const renderLesson = (topic) =>
  render(<LessonReader topic={withMeta(topic)} subject="chemistry" onBack={() => {}} showToast={() => {}} />);

const mainText = (container) => container.querySelector('.lesson-reader-main').textContent || '';

beforeEach(() => localStorage.clear());

test('the chemistry module holds the seven physical chemistry Atlas topics', () => {
  expect(chemistry.name).toBe('Chemistry');
  expect(chemistry.modules.map((m) => m.title)).toEqual(['Physical chemistry']);
  expect(chemistry.modules[0].topics.map((t) => t.title)).toEqual([
    'Atomic Structure',
    'Chemical Bonding',
    'Thermodynamics',
    'Chemical Equilibrium',
    'Chemical Kinetics',
    'Electrochemistry',
    'Solutions',
  ]);
});

test('every chemistry lesson is reachable from the Atlas', () => {
  // This is the check that would have failed before the resolver learned about
  // disciplines: all seven resolved to "not written yet" while the lessons sat
  // in the curriculum, because the Science field mapped to physics.
  chemistry.modules[0].topics.forEach((topic) => {
    const resolution = resolveAtlasTopic({
      fieldId: 'science',
      disciplineId: 'chemistry',
      moduleName: 'Physical Chemistry',
      topic: topic.title,
    });
    expect(resolution.kind).toBe('lesson');
    expect(resolution.kind === 'lesson' ? resolution.subject : null).toBe('chemistry');
    expect(resolution.kind === 'lesson' ? resolution.topicId : null).toBe(topic.id);
  });
});

describe('each chemistry lesson renders its core parts', () => {
  chemistry.modules[0].topics.forEach((topic) => {
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

describe('the concrete facts the lessons claim actually render', () => {
  const lesson = (id) => chemistry.modules[0].topics.find((t) => t.id === id);

  test('Atomic Structure names Dalton 1808, Mendeleev 1869 and the hydrogen ionisation energy', () => {
    const { container } = renderLesson(lesson('atomic-structure'));
    expect(mainText(container)).toMatch(/John Dalton argued in 1808/);
    expect(mainText(container)).toMatch(/Dmitri Mendeleev arranged the elements by atomic weight in 1869/);
    expect(mainText(container)).toMatch(/13\.6 electronvolts/);
  });

  test('Chemical Bonding carries Lewis 1916, the 436 kJ/mol bond and Pauling 1932', () => {
    const { container } = renderLesson(lesson('chemical-bonding'));
    expect(mainText(container)).toMatch(/Gilbert Lewis proposed that atoms bond by sharing pairs of electrons/);
    expect(mainText(container)).toMatch(/436 kilojoules per mole/);
    expect(mainText(container)).toMatch(/Linus Pauling introduced electronegativity in 1932/);
    expect(mainText(container)).toMatch(/104\.5 degrees/);
  });

  test('Thermodynamics dates Hess 1840 and Gibbs, and works the water case', () => {
    const { container } = renderLesson(lesson('thermodynamics'));
    expect(mainText(container)).toMatch(/Germain Hess noticed in 1840/);
    expect(mainText(container)).toMatch(/890 kilojoules/);
    expect(mainText(container)).toMatch(/22 joules per kelvin/);
    expect(mainText(container)).toMatch(/Josiah Willard Gibbs worked out in the 1870s/);
  });

  test('Chemical Equilibrium carries the Haber conditions and the water constant', () => {
    const { container } = renderLesson(lesson('chemical-equilibrium'));
    expect(mainText(container)).toMatch(/Henri Louis Le Chatelier stated a rule of thumb/);
    expect(mainText(container)).toMatch(/200 atmospheres and 500 degrees Celsius/);
    expect(mainText(container)).toMatch(/1\.0 x 10\^-14/);
  });

  test('Chemical Kinetics dates Arrhenius 1889 and gives the enzyme rate', () => {
    const { container } = renderLesson(lesson('chemical-kinetics'));
    expect(mainText(container)).toMatch(/Svante Arrhenius explained why rates climb so steeply/);
    expect(mainText(container)).toMatch(/Michaelis and Menten described their kinetics in 1913/);
    expect(mainText(container)).toMatch(/a million reactions per second/);
  });

  test('Electrochemistry carries Daniell 1836, the Faraday constant and Sony 1991', () => {
    const { container } = renderLesson(lesson('electrochemistry'));
    expect(mainText(container)).toMatch(/John Frederic Daniell built a better cell in 1836/);
    expect(mainText(container)).toMatch(/96,485 coulombs per mole/);
    expect(mainText(container)).toMatch(/commercialised by Sony in 1991/);
  });

  test('Solutions works the freezing point and the osmotic pressure', () => {
    const { container } = renderLesson(lesson('solutions'));
    expect(mainText(container)).toMatch(/drops by 1\.86 degrees Celsius per mole of particles per kilogram/);
    expect(mainText(container)).toMatch(/about 7\.7 atmospheres/);
    expect(mainText(container)).toMatch(/35 grams of dissolved salts per kilogram/);
  });
});
