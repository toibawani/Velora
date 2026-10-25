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

const withMeta = (topic, moduleTitle) => ({ ...topic, moduleTitle });

const renderLesson = (topic, moduleTitle) =>
  render(<LessonReader topic={withMeta(topic, moduleTitle)} subject="chemistry" onBack={() => {}} showToast={() => {}} />);

// The reader's body is the page's <main>, so it is reachable by role and the
// tests do not need the render result at all.
const mainText = () => screen.getByRole('main').textContent || '';

beforeEach(() => localStorage.clear());

const expectedModules = [
  { title: 'Physical chemistry', topics: ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Chemical Equilibrium', 'Chemical Kinetics', 'Electrochemistry', 'Solutions'] },
  { title: 'Organic Chemistry', topics: ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Polymers', 'Biomolecules'] },
  { title: 'Inorganic Chemistry', topics: ['Periodic Table', 'Metals', 'Non-metals', 'Coordination Chemistry', 'Minerals'] },
  { title: 'Analytical Chemistry', topics: ['Chemical Analysis', 'Spectroscopy', 'Chromatography'] },
  { title: 'Biochemistry', topics: ['Proteins', 'Carbohydrates', 'Lipids', 'Enzymes', 'DNA & RNA', 'Metabolism'] },
  { title: 'Nuclear Chemistry', topics: ['Nuclear Chemistry'] },
  { title: 'Environmental Chemistry', topics: ['Environmental Chemistry'] },
  { title: 'Industrial Chemistry', topics: ['Industrial Chemistry'] },
  { title: 'Materials Chemistry', topics: ['Materials Chemistry'] },
  { title: 'Computational Chemistry', topics: ['Computational Chemistry'] },
  { title: 'Medicinal Chemistry', topics: ['Medicinal Chemistry'] },
];

test('chemistry holds all eleven Atlas modules in order', () => {
  expect(chemistry.name).toBe('Chemistry');
  expect(chemistry.modules.map((m) => m.title)).toEqual(expectedModules.map((m) => m.title));
  expectedModules.forEach((mod, i) => {
    expect(chemistry.modules[i].topics.map((t) => t.title)).toEqual(mod.topics);
  });
});

test('every chemistry lesson is reachable from the Atlas', () => {
  chemistry.modules.forEach((module) => {
    module.topics.forEach((topic) => {
      const resolution = resolveAtlasTopic({
        fieldId: 'science',
        disciplineId: 'chemistry',
        moduleName: module.title,
        topic: topic.title,
      });
      expect(resolution.kind).toBe('lesson');
      expect(resolution.kind === 'lesson' ? resolution.subject : null).toBe('chemistry');
      expect(resolution.kind === 'lesson' ? resolution.topicId : null).toBe(topic.id);
    });
  });
});

describe('each chemistry lesson renders its core parts', () => {
  chemistry.modules.forEach((module) => {
    module.topics.forEach((topic) => {
      test(`renders "${module.title} > ${topic.title}" with kicker, sections, sources and connections`, () => {
        renderLesson(topic, module.title);

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
});

describe('the concrete facts the lessons claim actually render', () => {
  const lesson = (moduleTitle, id) =>
    chemistry.modules.find((m) => m.title === moduleTitle).topics.find((t) => t.id === id);

  test('Atomic Structure names Dalton 1808, Mendeleev 1869 and the hydrogen ionisation energy', () => {
    renderLesson(lesson('Physical chemistry', 'atomic-structure'), 'Physical chemistry');
    expect(mainText()).toMatch(/John Dalton argued in 1808/);
    expect(mainText()).toMatch(/Dmitri Mendeleev arranged the elements by atomic weight in 1869/);
    expect(mainText()).toMatch(/13\.6 electronvolts/);
  });

  test('Chemical Bonding carries Lewis 1916, the 436 kJ/mol bond and Pauling 1932', () => {
    renderLesson(lesson('Physical chemistry', 'chemical-bonding'), 'Physical chemistry');
    expect(mainText()).toMatch(/Gilbert Lewis proposed that atoms bond by sharing pairs of electrons/);
    expect(mainText()).toMatch(/436 kilojoules per mole/);
    expect(mainText()).toMatch(/Linus Pauling introduced electronegativity in 1932/);
    expect(mainText()).toMatch(/104\.5 degrees/);
  });

  test('Thermodynamics dates Hess 1840 and Gibbs, and works the water case', () => {
    renderLesson(lesson('Physical chemistry', 'thermodynamics'), 'Physical chemistry');
    expect(mainText()).toMatch(/Germain Hess noticed in 1840/);
    expect(mainText()).toMatch(/890 kilojoules/);
    expect(mainText()).toMatch(/22 joules per kelvin/);
    expect(mainText()).toMatch(/Josiah Willard Gibbs worked out in the 1870s/);
  });

  test('Chemical Equilibrium carries the Haber conditions and the water constant', () => {
    renderLesson(lesson('Physical chemistry', 'chemical-equilibrium'), 'Physical chemistry');
    expect(mainText()).toMatch(/Henri Louis Le Chatelier stated a rule of thumb/);
    expect(mainText()).toMatch(/200 atmospheres and 500 degrees Celsius/);
    expect(mainText()).toMatch(/1\.0 x 10\^-14/);
  });

  test('Chemical Kinetics dates Arrhenius 1889 and gives the enzyme rate', () => {
    renderLesson(lesson('Physical chemistry', 'chemical-kinetics'), 'Physical chemistry');
    expect(mainText()).toMatch(/Svante Arrhenius explained why rates climb so steeply/);
    expect(mainText()).toMatch(/Michaelis and Menten described their kinetics in 1913/);
    expect(mainText()).toMatch(/a million reactions per second/);
  });

  test('Electrochemistry carries Daniell 1836, the Faraday constant and Sony 1991', () => {
    renderLesson(lesson('Physical chemistry', 'electrochemistry'), 'Physical chemistry');
    expect(mainText()).toMatch(/John Frederic Daniell built a better cell in 1836/);
    expect(mainText()).toMatch(/96,485 coulombs per mole/);
    expect(mainText()).toMatch(/commercialised by Sony in 1991/);
  });

  test('Solutions works the freezing point and the osmotic pressure', () => {
    renderLesson(lesson('Physical chemistry', 'solutions'), 'Physical chemistry');
    expect(mainText()).toMatch(/drops by 1\.86 degrees Celsius per mole of particles per kilogram/);
    expect(mainText()).toMatch(/about 7\.7 atmospheres/);
    expect(mainText()).toMatch(/35 grams of dissolved salts per kilogram/);
  });

  test('Hydrocarbons names alkanes alkenes alkynes and cracking', () => {
    renderLesson(lesson('Organic Chemistry', 'hydrocarbons'), 'Organic Chemistry');
    expect(mainText()).toMatch(/CnH2n\+2/);
    expect(mainText()).toMatch(/CnH2n/);
    expect(mainText()).toMatch(/catalytic cracking/);
  });

  test('Periodic Table names Mendeleev 1869 and the blocks', () => {
    renderLesson(lesson('Inorganic Chemistry', 'periodic-table'), 'Inorganic Chemistry');
    expect(mainText()).toMatch(/Mendeleev/);
    expect(mainText()).toMatch(/s-block/);
    expect(mainText()).toMatch(/p-block/);
    expect(mainText()).toMatch(/d-block/);
    expect(mainText()).toMatch(/f-block/);
  });

  test('Proteins names amino acids and structure levels', () => {
    renderLesson(lesson('Biochemistry', 'proteins'), 'Biochemistry');
    expect(mainText()).toMatch(/20 amino acids/);
    expect(mainText()).toMatch(/Primary structure/);
    expect(mainText()).toMatch(/Secondary structure/);
    expect(mainText()).toMatch(/Tertiary structure/);
    expect(mainText()).toMatch(/quaternary structure/);
  });

  test('Nuclear Chemistry names half-life and fission fusion', () => {
    renderLesson(lesson('Nuclear Chemistry', 'nuclear-chemistry'), 'Nuclear Chemistry');
    expect(mainText()).toMatch(/half-life/);
    expect(mainText()).toMatch(/Fission/);
    expect(mainText()).toMatch(/fusion/);
  });
});
