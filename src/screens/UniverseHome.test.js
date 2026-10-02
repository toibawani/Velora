import { fireEvent, render, screen } from '@testing-library/react';
import UniverseHome from './UniverseHome';
import { ThemeProvider } from '../context/ThemeContext';

/** The props every render in this file needs, as fresh mocks each time. */
const baseProps = () => ({
  user: { name: 'Ada' },
  setScreen: jest.fn(),
  setSelectedSubject: jest.fn(),
  setLearnView: jest.fn(),
  onOpenLesson: jest.fn(),
  onOpenDeepRead: jest.fn(),
  onLogout: jest.fn(),
  showToast: jest.fn(),
});

const renderUniverse = (overrides = {}) => {
  const props = { ...baseProps(), ...overrides };

  // container is returned alongside the props because several tests below
  // assert on the index's DOM shape rather than on accessible names - the
  // density guarantee is a fact about how many entries exist, and asking for
  // 188 accessible names to assert on it would be absurd.
  const { container } = render(
    <ThemeProvider>
      <UniverseHome {...props} />
    </ThemeProvider>
  );
  return { ...props, container };
};

describe('editorial knowledge atlas', () => {
  test('shows the six major fields and hierarchical topic preview', () => {
    renderUniverse();

    ['Science', 'Philosophy', 'History', 'Political Science', 'Geography', 'Literature'].forEach((field) => {
      expect(screen.getByRole('button', { name: new RegExp(`^${field},`) })).toBeInTheDocument();
    });
    expect(screen.getByText('Field → discipline → subfield → topic')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Motion' })).toBeInTheDocument();
  });

  test('searches across fields and reveals the selected hierarchy', () => {
    renderUniverse();
    fireEvent.change(screen.getByLabelText('Search the knowledge atlas'), { target: { value: 'Monsoons' } });

    const monsoonResult = screen.getByRole('button', { name: /Monsoons.*Geography/i });
    fireEvent.click(monsoonResult);

    expect(screen.getByRole('heading', { name: 'Geography' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Monsoons' })).toBeInTheDocument();
  });

  /**
   * These two replaced tests asserted the broken behaviour, so they are the
   * regression risk this fix has to answer for. The old suite was satisfied by a
   * toast and a discarded topic; both were symptoms of the bug, not evidence of
   * the design.
   */
  test('a topic with a lesson behind it opens that exact lesson', () => {
    const { onOpenLesson, setSelectedSubject, showToast } = renderUniverse();

    // Philosophy is reached because Stoicism is one of its written lessons.
    // Reach it the way a reader would: pick the field, then tap the topic line.
    // Nothing expands any more - every topic in the field is already on screen -
    // so the discipline and subfield clicks the old layout required are gone.
    fireEvent.click(screen.getByRole('button', { name: /^Philosophy,/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Stoicism$/ }));

    fireEvent.click(screen.getByRole('button', { name: /Read the lesson/i }));

    expect(onOpenLesson).toHaveBeenCalledWith('philosophy', 'stoicism');
    expect(setSelectedSubject).toHaveBeenCalledWith('philosophy');
    // The point of the fix: no more "coming next" for a topic that has content.
    expect(showToast).not.toHaveBeenCalled();
  });

  test('an unwritten topic says so instead of navigating nowhere', () => {
    const { onOpenLesson, onOpenDeepRead, showToast } = renderUniverse();

    // 'Motion' opens the atlas on Classical Mechanics, which is listed but has
    // no lesson written. This used to navigate to the physics topic index and
    // silently drop the topic.
    expect(screen.getByRole('heading', { name: 'Motion' })).toBeInTheDocument();
    // Every unwritten topic now carries the status in its accessible name, so
    // the call to action has to be found by exact label rather than by a loose
    // /Not written yet/ match that would hit 180 topic lines as well.
    fireEvent.click(screen.getByRole('button', { name: 'Not written yet', exact: true }));

    expect(onOpenLesson).not.toHaveBeenCalled();
    expect(onOpenDeepRead).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('not written yet'), 'info');
  });

  test('black holes resolves to the deep read rather than a single lesson', () => {
    const { onOpenDeepRead, onOpenLesson } = renderUniverse();

    fireEvent.click(screen.getByRole('button', { name: /^Philosophy,/ }));
    // Reach a deep-read topic through search, which searches the whole atlas.
    fireEvent.change(screen.getByLabelText('Search the knowledge atlas'), {
      target: { value: 'Black Holes' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Black Holes.*Science/i }));
    fireEvent.click(screen.getByRole('button', { name: /Open the deep read/i }));

    expect(onOpenDeepRead).toHaveBeenCalledWith('black-holes');
    expect(onOpenLesson).not.toHaveBeenCalled();
  });

  test('states how much of the active field is actually written', () => {
    renderUniverse();

    // The old layout had no way to show this, which is how 7 written topics
    // came to look like 573. The count is split across a <strong>, so match on
    // the element's own text rather than a regex over one text node.
    const coverage = screen.getByText((_, element) =>
      element?.className === 'uh-coverage' &&
      /Science:\s*3\s*of 188 topics written/.test(element.textContent || '')
    );
    expect(coverage).toBeInTheDocument();
  });
});

/**
 * The index's job is density and honesty. These tests assert both, because
 * neither is visible in a snapshot and both are the reason the pill grid went.
 */
describe('atlas index', () => {
  test('every topic in the field is on screen without expanding anything', () => {
    const { container } = renderUniverse();

    // Science is the largest field at 188 topics. The old layout showed 7 of
    // them until a reader expanded Classical Mechanics, and then still only
    // that one discipline's. Here all 188 are in the DOM at once.
    const entries = container.querySelectorAll('.aix-entry');
    expect(entries).toHaveLength(188);

    // And nothing on screen is a disclosure control any more. This is the
    // density guarantee: no topic is behind a click.
    expect(screen.queryByRole('button', { expanded: true })).not.toBeInTheDocument();
    expect(container.querySelectorAll('.uh-topic-grid')).toHaveLength(0);
  });

  test('marks each topic as written or not written', () => {
    const { container } = renderUniverse();

    // The key above the index explains the marker shapes, and it is rendered
    // before the entries, so it is excluded by scoping to the index itself
    // rather than by offset arithmetic that would break if the key moved.
    const entries = container.querySelectorAll('.aix-entry');
    const markers = container.querySelectorAll('.aix-entry .aix-marker');
    expect(entries).toHaveLength(188);
    expect(markers).toHaveLength(188);

    // Science resolves 3 topics to real content. If the content grows, raise
    // these in the same commit as the content.
    expect(container.querySelectorAll('.aix-entry .aix-marker.written')).toHaveLength(3);
    expect(container.querySelectorAll('.aix-entry .aix-marker.unwritten')).toHaveLength(185);
  });

  test('says "not written yet" in the accessible name, not just in colour', () => {
    renderUniverse();

    // Status by marker colour alone would be invisible to a screen reader and
    // to anyone who cannot separate the accent from the tertiary ink. Motion is
    // on Science, which is the field open on arrival.
    expect(screen.getByRole('button', { name: 'Motion, not written yet' })).toBeInTheDocument();

    // A written topic carries no such suffix, so the two states are
    // distinguishable by name alone. Black Holes sits under Astrophysics and
    // resolves to the deep read, so it is written despite looking like a topic
    // that would not be.
    expect(screen.getByRole('button', { name: 'Black Holes' })).toBeInTheDocument();
  });

  test('offers the field coverage as written-of-total on each tab', () => {
    renderUniverse();

    // The reader can compare fields at a glance: Literature is 0 of 92, Science
    // is 3 of 188. Nothing in the old layout made that comparison possible.
    expect(screen.getByRole('button', { name: /^Science, .*3 of 188 topics written$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Literature, .*0 of 92 topics written$/ })).toBeInTheDocument();
  });
});

describe('theme control in the header', () => {
  afterEach(() => {
    localStorage.removeItem('velora_theme_preference');
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  test('defaults to Auto and switches the document to dark when Dark is pressed', () => {
    renderUniverse();

    // 'Dark' is deliberately an exact match. The atlas now renders every physics
    // topic at once, which puts "Dark Matter" on screen, and a loose /Dark/
    // regex matches both the theme control and the topic line. That collision is
    // real for assistive tech too, so the theme control carries a fuller name.
    const auto = screen.getByRole('button', { name: /^Theme: Auto/ });
    const dark = screen.getByRole('button', { name: /^Theme: Dark/ });
    expect(auto).toHaveAttribute('aria-pressed', 'true');
    expect(dark).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(dark);

    expect(dark).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('velora_theme_preference')).toBe('dark');
  });
});
