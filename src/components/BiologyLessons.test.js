import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonReader from './LessonReader';
import { CURRICULUM } from '../data/curriculum';
import { resolveAtlasTopic } from '../data/atlasResolution';

/**
 * The eight Biology lessons.
 *
 * Chemistry was the first subject outside the original three, and the fix that
 * made it reachable was a discipline-to-subject map in atlasResolution. This
 * file exists to check that fix generalised: a second discipline added to the
 * same map, with no change to how a tap resolves, has to be reachable too. The
 * failure it guards against is the one that made chemistry invisible - content
 * written, tests green, and every Atlas tap still saying "not written yet".
 *
 * The two modules covered are the first two the Atlas lists, Cell Biology and
 * Molecular Biology. The other eight biology modules are listed in Atlas order
 * with topic stubs and no lesson content, and the Atlas says so; the tests here
 * render only written topics and assert that every stub resolves as unwritten
 * rather than opening an empty reader.
 */
jest.mock('./ConceptMap', () => () => <div data-testid="concept-map" />);
jest.mock('./PeerExplanations', () => () => <div data-testid="peer-explanations" />);
jest.mock('./SmartReviewPlanner', () => () => <div data-testid="review-planner" />);

const biology = CURRICULUM.biology;
const allTopics = biology.modules.flatMap((module) =>
  module.topics.map((topic) => ({ ...topic, moduleTitle: module.title }))
);
const writtenTopics = allTopics.filter((topic) => topic.sections?.length > 0);
const stubTopics = allTopics.filter((topic) => !topic.sections?.length);

const renderLesson = (topic) =>
  render(<LessonReader topic={topic} subject="biology" onBack={() => {}} showToast={() => {}} />);

// The reader's body is the page's <main>, so it is reachable by role and the
// tests do not need the render result at all.
const mainText = () => screen.getByRole('main').textContent || '';

beforeEach(() => localStorage.clear());

test('the first six biology modules hold the Atlas topics in Atlas order', () => {
  expect(biology.name).toBe('Biology');
  // Check first 6 modules match expected order from Atlas
  const expectedFirstSix = [
    'Cell biology',
    'Molecular biology',
    'Genetics',
    'Microbiology',
    'Botany',
    'Zoology',
  ];
  expect(biology.modules.map((m) => m.title).slice(0, 6)).toEqual(expectedFirstSix);
  // Total modules should be 10 (7 written + 3 unwritten)
  expect(biology.modules.length).toBe(10);
  expect(biology.modules[0].topics.map((t) => t.title)).toEqual([
    'Cell Structure',
    'Organelles',
    'Cell Division',
    'Cell Signaling',
  ]);
  expect(biology.modules[2].topics.map((t) => t.title)).toEqual([
    'Heredity',
    'Mutations',
    'Genetic Disorders',
    'Genomics',
  ]);
  expect(biology.modules[3].topics.map((t) => t.title)).toEqual([
    'Bacteria',
    'Viruses',
    'Fungi',
    'Protozoa',
  ]);
  expect(biology.modules[1].topics.map((t) => t.title)).toEqual([
    'DNA',
    'RNA',
    'Gene Expression',
    'Protein Synthesis',
  ]);
  expect(biology.modules[4].topics.map((t) => t.title)).toEqual([
    'Plant Structure',
    'Plant Physiology',
    'Reproduction',
    'Plant Evolution',
  ]);
  expect(biology.modules[5].topics.map((t) => t.title)).toEqual([
    'Animal Anatomy',
    'Animal Physiology',
    'Animal Behaviour',
  ]);
  expect(biology.modules[6].topics.map((t) => t.title)).toEqual([
    'Anatomy',
    'Physiology',
    'Nervous System',
    'Circulatory System',
    'Respiratory System',
    'Digestive System',
    'Endocrine System',
  ]);
});

test('every written biology lesson is reachable from the Atlas', () => {
  // Before the discipline map, all eight of these resolved to 'unwritten'
  // because the Science field maps to the physics curriculum and the biology
  // lessons live in a different file.
  writtenTopics.forEach((topic) => {
    const module = biology.modules.find((m) => m.title === topic.moduleTitle);
    expect(module).toBeDefined();
    const resolution = resolveAtlasTopic({
      fieldId: 'science',
      disciplineId: 'biology',
      moduleName: topic.moduleTitle === 'Cell biology' ? 'Cell Biology' : 'Molecular Biology',
      topic: topic.title,
    });
    expect(resolution.kind).toBe('lesson');
    expect(resolution.kind === 'lesson' ? resolution.subject : null).toBe('biology');
    expect(resolution.kind === 'lesson' ? resolution.topicId : null).toBe(topic.id);
  });
});

test('a biology topic is not silently borrowed from the physics curriculum', () => {
  // 'DNA' exists only in biology. If the discipline were ignored, the resolver
  // would search physics and answer unwritten, so this asserts the difference
  // between "the map works" and "the map happens to contain a word that matches".
  const underPhysics = resolveAtlasTopic({ fieldId: 'science', disciplineId: 'physics', moduleName: '', topic: 'DNA' });
  expect(underPhysics.kind).toBe('unwritten');
});

describe('each biology lesson renders its core parts', () => {
  writtenTopics.forEach((topic) => {
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
  const lesson = (id) => allTopics.find((t) => t.id === id);

  test('Cell Structure dates Hooke 1665, Virchow 1855 and gives the size range', () => {
    renderLesson(lesson('cell-structure'));
    const text = mainText();
    expect(text).toMatch(/Robert Hooke pointed a microscope at a thin slice of cork in 1665/);
    expect(text).toMatch(/Rudolf Virchow added the part that matters most in 1855/);
    expect(text).toMatch(/1 to 2 micrometres across/);
    expect(text).toMatch(/about 5 nanometres thick/);
  });

  test('Organelles carries Margulis 1967 and the mitochondrial genome length', () => {
    renderLesson(lesson('organelles'));
    const text = mainText();
    expect(text).toMatch(/Lynn Margulis argued in 1967/);
    expect(text).toMatch(/16,569 base pairs/);
    expect(text).toMatch(/Camillo Golgi in 1898/);
  });

  test('Cell Division gives the cycle lengths and the trisomy 21 rate', () => {
    renderLesson(lesson('cell-division'));
    const text = mainText();
    expect(text).toMatch(/runs a cycle of roughly 24 hours/);
    expect(text).toMatch(/about 8\.4 million/);
    expect(text).toMatch(/roughly one in 700 births/);
    expect(text).toMatch(/HeLa cells, taken from Henrietta Lacks in 1951/);
  });

  test('Cell Signaling dates Sutherland 1957 and the nitric oxide Nobel', () => {
    renderLesson(lesson('cell-signaling'));
    const text = mainText();
    expect(text).toMatch(/Earl Sutherland described the first such relay in 1957/);
    expect(text).toMatch(/around 800 members in humans/);
    expect(text).toMatch(/shared the 1998 Nobel Prize/);
  });

  test('DNA dates the 1953 structure and names Franklin, whose data was used', () => {
    renderLesson(lesson('dna'));
    const text = mainText();
    expect(text).toMatch(/published the double helix in April 1953/);
    expect(text).toMatch(/photograph 51/);
    expect(text).toMatch(/3\.1 billion base pairs/);
    expect(text).toMatch(/Only about 1\.5 per cent of the human genome codes for protein/);
  });

  test('RNA dates the intron discovery and the RNA world hypothesis', () => {
    renderLesson(lesson('rna'));
    const text = mainText();
    expect(text).toMatch(/Introns were discovered in 1977 by Phillip Sharp and Richard Roberts/);
    expect(text).toMatch(/Walter Gilbert named the idea the RNA world in 1986/);
    expect(text).toMatch(/about 200 adenine bases/);
  });

  test('Gene Expression dates the lac operon and gives the gene count', () => {
    renderLesson(lesson('gene-expression'));
    const text = mainText();
    expect(text).toMatch(/François Jacob and Jacques Monod described the lac operon in 1961/);
    expect(text).toMatch(/about 20,000 protein-coding genes/);
    expect(text).toMatch(/X-inactivation/);
  });

  test('Protein Synthesis gives the codon arithmetic and the 2009 Nobel structure work', () => {
    renderLesson(lesson('protein-synthesis'));
    const text = mainText();
    expect(text).toMatch(/Nirenberg and Heinrich Matthaei built a synthetic RNA of only uracil in 1961/);
    expect(text).toMatch(/UAA, UAG and UGA stop/);
    expect(text).toMatch(/2009 Nobel Prize in Chemistry/);
    expect(text).toMatch(/about 15 to 20 amino acids per second/);
  });
});

test('the unwritten biology modules stay unwritten rather than pretending', () => {
  // The boundary of this batch, asserted rather than described. Every topic in
  // the eight unwritten modules must report honestly, and the Atlas must not be
  // able to turn a title-only stub into a lesson. Without this, a later batch
  // could add a module that resolves to a reader with nothing in it and no test
  // would notice the mismatch.
  expect(stubTopics.length).toBe(35);
  stubTopics.forEach((topic) => {
    const resolution = resolveAtlasTopic({
      fieldId: 'science',
      disciplineId: 'biology',
      moduleName: topic.moduleTitle,
      topic: topic.title,
    });
    expect(resolution.kind).toBe('unwritten');
  });
});
