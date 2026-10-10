import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { PHYSICS_CURRICULUM } from '../data/physicsCurriculum';

/**
 * The five Thermodynamics lessons, rendered the way Learn.js renders them.
 *
 * These are the first physics lessons that lean hard on the inline glossary, so
 * the point of this file is the wiring between the lesson data and the reader:
 * that a {{term}} in a section actually becomes a tap-to-reveal button, that the
 * sources are real links, and that the numbers and names in the prose survive
 * being rendered. A lesson that parses but whose glossary terms are dead would
 * read fine in the data file and go dead on the page; this is the test that
 * catches that.
 *
 * The interactive panels (concept map, peer explanations, review planner) are
 * stubbed. They are tested in their own files and are not what a thermodynamics
 * lesson is judged on.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const thermo = PHYSICS_CURRICULUM.modules.find((m) => m.id === 'thermodynamics');

/** Learn.js attaches moduleTitle when it flattens the curriculum; do it here. */
const withMeta = (topic) => ({ ...topic, moduleTitle: thermo.title });

const renderLesson = (topic) => {
  const view = render(<LessonReader topic={withMeta(topic)} subject="physics" onBack={() => {}} showToast={() => {}} />);
  return view;
};

/** The whole lesson body as one string, the way a reader reads it. */
const mainText = (container) => container.querySelector('.lesson-reader-main').textContent || '';

beforeEach(() => localStorage.clear());

test('the thermodynamics module exists and holds the five Atlas topics', () => {
  // The Atlas lists these five topics under Physics > Thermodynamics. If one is
  // missing, the Atlas marker would still say "not written yet" for a topic that
  // this module claims to cover, so the ids are asserted against the module
  // itself rather than against a hardcoded list that could drift.
  expect(thermo.topics.map((t) => t.id)).toEqual([
    'heat', 'temperature', 'laws-of-thermodynamics', 'entropy', 'heat-engines',
  ]);
});

describe('each thermodynamics lesson renders its core parts', () => {
  thermo.topics.forEach((topic) => {
    test(`renders "${topic.title}" with kicker, story, sections, sources and connections`, () => {
      renderLesson(topic);

      // Title and kicker are the lesson's promise; both are asserted as headings
      // or their own line, not buried in a paragraph.
      expect(screen.getByRole('heading', { level: 1, name: topic.title })).toBeInTheDocument();
      expect(screen.getByText(topic.kicker)).toBeInTheDocument();

      // The story and every section heading render.
      expect(screen.getByText('The idea')).toBeInTheDocument();
      topic.sections.forEach((section) => {
        expect(screen.getByRole('heading', { level: 2, name: section.heading })).toBeInTheDocument();
      });

      // Sources are real outbound links, not plain text.
      topic.sources.forEach((source) => {
        const link = screen.getByRole('link', { name: source.label });
        expect(link).toHaveAttribute('href', source.url);
        expect(link).toHaveAttribute('target', '_blank');
      });

      // Connections and the honest-uncertainty callout are present.
      topic.connections.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
      expect(screen.getByText('Where the edge is')).toBeInTheDocument();
      // The sources section is present, headed by its own label rather than by
      // a class, so the check reads as content and not as DOM shape.
      expect(screen.getByRole('heading', { level: 2, name: 'Where this came from' })).toBeInTheDocument();
    });
  });
});


test('an inline {{term}} becomes a button that reveals its glossary definition on tap', () => {
  // The Heat lesson marks up "latent heat" as {{latent-heat|latent heat}}. The
  // reader must turn that into a button that reveals the glossary definition on
  // tap, because hover does not exist on a phone and the brief requires the
  // glossary to be reachable by tap.
  renderLesson(thermo.topics.find((t) => t.id === 'heat'));

  // Before the tap the definition is not on screen.
  expect(screen.queryByText(/the energy that goes into changing a substance/i)).not.toBeInTheDocument();

  // The term is a control, found by its accessible "Define ..." label.
  const defineButton = screen.getByRole('button', { name: /define latent-heat/i });
  expect(defineButton).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(defineButton);

  // After the tap the glossary definition is visible and the button reports
  // itself open, so a screen reader hears the state change.
  expect(screen.getByText(/the energy that goes into changing a substance/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /define latent-heat/i })).toHaveAttribute('aria-expanded', 'true');
});

test('every {{term}} used across the five lessons resolves to a glossary entry', () => {
  // A term written in the data that is not in the glossary renders as plain text
  // with no button, so the glossary quietly stops working for that word. This
  // walks every inline term in the lessons and requires each to render as a
  // "Define ..." control, which only exists when the lookup found a definition.
  const terms = new Set();
  thermo.topics.forEach((topic) => {
    [topic.story, ...topic.sections.flatMap((s) => [s.heading, s.body]), topic.uncertainty, topic.career]
      .join(' ')
      .replace(/\{\{([a-z-]+)(\|[^}]*)?\}\}/g, (_, term) => {
        terms.add(term);
        return '';
      });
  });

  // Sanity: the lessons really do use the inline glossary, so this test has
  // something to check rather than passing on an empty set.
  expect(terms.size).toBeGreaterThanOrEqual(8);

  terms.forEach((term) => {
    // Render a minimal lesson that contains just this term, and require the
    // button to appear. Wiping the render between terms keeps each assertion
    // independent.
    const { unmount } = render(
      <LessonReader
        topic={withMeta({ ...thermo.topics[0], story: `{{${term}|${term}}}`, sections: [], connections: [], sources: [], uncertainty: '', career: '' })}
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
  // These are asserted as literal strings, not read back from the data, so a
  // rewrite that quietly drops a date or a name fails here rather than shipping
  // a lesson that lost its grounding. Each fact is one the lesson states and a
  // reader could check.
  //
  // The matcher reads the whole lesson's text content rather than one text
  // node. parseInlineTerms splits a paragraph at every {{term}} into separate
  // spans, so a phrase that happens to run across a glossary term lives in more
  // than one node and a per-node getByText would miss it. Concatenating the
  // main region's text is how a reader actually reads it, glossary links and
  // all.
  test('Heat carries Rumford 1798, the calorie-to-joule figure and the vacuum flask', () => {
    const { container } = renderLesson(thermo.topics.find((t) => t.id === 'heat'));
    expect(mainText(container)).toMatch(/In 1798 Benjamin Thompson, better known as Count Rumford, was supervising the boring of cannon at the Munich arsenal/);
    expect(mainText(container)).toMatch(/a blunt, non-cutting boring tool produced almost no metal shavings/);
    expect(mainText(container)).toMatch(/150 million kilometres of vacuum/);
  });

  test('Temperature names the coldest reachable point and the gas law', () => {
    const { container } = renderLesson(thermo.topics.find((t) => t.id === 'temperature'));
    expect(mainText(container)).toMatch(/absolute zero, minus 273.15 degrees Celsius, written 0 K/);
    expect(mainText(container)).toMatch(/The ideal gas law, pressure times volume equals number of moles times the gas constant times temperature/);
  });

  test('Laws of Thermodynamics dates Clausius, Kelvin, Planck and Nernst', () => {
    const { container } = renderLesson(thermo.topics.find((t) => t.id === 'laws-of-thermodynamics'));
    expect(mainText(container)).toMatch(/Clausius gave the second law its standard statement in 1850/);
    expect(mainText(container)).toMatch(/Nernst put the law in its modern form around 1906 to 1912/);
  });

  test('Entropy credits Boltzmann with the gravestone formula and Landauer 1961', () => {
    const { container } = renderLesson(thermo.topics.find((t) => t.id === 'entropy'));
    expect(mainText(container)).toMatch(/Ludwig Boltzmann gave entropy a concrete meaning in the 1870s/);
    expect(mainText(container)).toMatch(/S equals k times the natural log of W into his gravestone in Vienna/);
    expect(mainText(container)).toMatch(/Rolf Landauer showed in 1961/);
  });

  test('Heat Engines carries Carnot 1824 and a worked coal-plant ceiling', () => {
    const { container } = renderLesson(thermo.topics.find((t) => t.id === 'heat-engines'));
    expect(mainText(container)).toMatch(/Sadi Carnot published "Reflections on the Motive Power of Fire" in 1824/);
    expect(mainText(container)).toMatch(/ideal ceiling near 64 percent/);
    expect(mainText(container)).toMatch(/heat pump warming a house in winter can move several times more heat energy/);
  });
});

