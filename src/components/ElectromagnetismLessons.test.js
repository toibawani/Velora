import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { PHYSICS_CURRICULUM } from '../data/physicsCurriculum';

/**
 * The seven Electromagnetism lessons, rendered the way Learn.js renders them.
 *
 * Same job as LessonReader.test.js does for Thermodynamics: prove that the data
 * reaches the page, that every {{term}} becomes a working definition, that the
 * sources are links rather than decoration, and that the dates and numbers the
 * prose claims are actually in the rendered text. A lesson whose numbers were
 * quietly dropped in a rewrite would read fine in the data file and be wrong on
 * the page.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const em = PHYSICS_CURRICULUM.modules.find((m) => m.id === 'electromagnetism');
const withMeta = (topic) => ({ ...topic, moduleTitle: em.title });

const renderLesson = (topic) =>
  render(<LessonReader topic={withMeta(topic)} subject="physics" onBack={() => {}} showToast={() => {}} />);

const mainText = (container) => container.querySelector('.lesson-reader-main').textContent || '';

beforeEach(() => localStorage.clear());

test('the electromagnetism module holds the seven Atlas topics, in Atlas order', () => {
  // These are the exact names the Atlas lists under Physics > Electromagnetism.
  // The resolver matches on the slug of the title, so a rename here silently
  // turns the Atlas marker back to "not written yet" for that topic.
  expect(em.topics.map((t) => t.title)).toEqual([
    'Electric Charge',
    'Electric Fields',
    'Electric Potential',
    'Current Electricity',
    'Magnetism',
    'Electromagnetic Induction',
    'Maxwell’s Equations',
  ]);
  expect(em.topics.map((t) => t.id)).toEqual([
    'electric-charge',
    'electric-fields',
    'electric-potential',
    'current-electricity',
    'magnetism',
    'electromagnetic-induction',
    'maxwells-equations',
  ]);
});

describe('each electromagnetism lesson renders its core parts', () => {
  em.topics.forEach((topic) => {
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
  // A term with no glossary entry renders as plain text with no button, so the
  // lesson silently loses a definition it claims to offer. This walks the real
  // data rather than a copy of it.
  const terms = new Set();
  em.topics.forEach((topic) => {
    [topic.story, ...topic.sections.flatMap((s) => [s.heading, s.body]), topic.uncertainty, topic.career]
      .join(' ')
      .replace(/\{\{([a-z][a-zA-Z /-]*?)(\|[^}]*)?\}\}/g, (_, term) => {
        terms.add(term.trim());
        return '';
      });
  });

  expect(terms.size).toBeGreaterThanOrEqual(4);
  terms.forEach((term) => {
    const { unmount } = render(
      <LessonReader
        topic={withMeta({ ...em.topics[0], story: `{{${term}|${term}}}`, sections: [], connections: [], sources: [], uncertainty: '', career: '' })}
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
  const lesson = (id) => em.topics.find((t) => t.id === id);

  test('Electric Charge carries Coulomb 1785, the elementary charge and Millikan', () => {
    const { container } = renderLesson(lesson('electric-charge'));
    expect(mainText(container)).toMatch(/measured the force between two charged objects in 1785 with a torsion balance/);
    expect(mainText(container)).toMatch(/1\.602 x 10\^-19 coulombs/);
    expect(mainText(container)).toMatch(/between 1909 and 1913 by watching charged oil droplets/);
    expect(mainText(container)).toMatch(/6\.24 x 10\^18 electrons/);
  });

  test('Electric Fields carries the field definition, the breakdown strength and the Casimir dates', () => {
    const { container } = renderLesson(lesson('electric-fields'));
    expect(mainText(container)).toMatch(/measured in newtons per coulomb/);
    expect(mainText(container)).toMatch(/roughly 120 volts per metre/);
    expect(mainText(container)).toMatch(/around 3 million volts per metre/);
    expect(mainText(container)).toMatch(/predicted in 1948 and measured in 1997/);
  });

  test('Electric Potential works a kettle and a collider through the same definition', () => {
    const { container } = renderLesson(lesson('electric-potential'));
    expect(mainText(container)).toMatch(/One volt is one joule per coulomb/);
    expect(mainText(container)).toMatch(/2,300 joules a second, or 2\.3 kilowatts/);
    expect(mainText(container)).toMatch(/6\.8 trillion electronvolts/);
    expect(mainText(container)).toMatch(/about 1\.1 microjoules/);
  });

  test('Current Electricity names Ohm 1827, the drift velocity and Onnes 1911', () => {
    const { container } = renderLesson(lesson('current-electricity'));
    expect(mainText(container)).toMatch(/Georg Ohm published his law in 1827/);
    expect(mainText(container)).toMatch(/a fraction of a millimetre per second/);
    expect(mainText(container)).toMatch(/1\.7 x 10\^-8 ohm metres/);
    expect(mainText(container)).toMatch(/below 4\.2 kelvin/);
    expect(mainText(container)).toMatch(/in 1911, three years after he first liquefied helium/);
  });

  test('Magnetism dates Ørsted to 1820 and the last field reversal', () => {
    const { container } = renderLesson(lesson('magnetism'));
    expect(mainText(container)).toMatch(/In April 1820/);
    expect(mainText(container)).toMatch(/between about 25 and 65 microtesla/);
    expect(mainText(container)).toMatch(/about 780,000 years ago/);
    expect(mainText(container)).toMatch(/in 1931 Paul Dirac showed/);
  });

  test('Electromagnetic Induction dates Faraday and Lenz, and states the disagreement', () => {
    const { container } = renderLesson(lesson('electromagnetic-induction'));
    expect(mainText(container)).toMatch(/On 29 August 1831/);
    expect(mainText(container)).toMatch(/Heinrich Lenz stated this in 1834/);
    expect(mainText(container)).toMatch(/20 to 100 kilohertz/);
    expect(mainText(container)).toMatch(/Richard Feynman argued that the "flux rule"/);
  });

  test('Maxwell’s Equations carries 1861, 1865, Heaviside 1884 and the defined speed of light', () => {
    const { container } = renderLesson(lesson('maxwells-equations'));
    expect(mainText(container)).toMatch(/he added a displacement current in 1861/);
    expect(mainText(container)).toMatch(/In 1865 James Clerk Maxwell published a paper/);
    expect(mainText(container)).toMatch(/Oliver Heaviside rewrote them as the four vector equations taught today, in 1884/);
    expect(mainText(container)).toMatch(/299,792,458 metres per second/);
    expect(mainText(container)).toMatch(/Heinrich Hertz generated and detected these waves in 1887/);
  });
});
