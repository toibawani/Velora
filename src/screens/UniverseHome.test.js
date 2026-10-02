import { fireEvent, render, screen } from '@testing-library/react';
import UniverseHome from './UniverseHome';
import { ThemeProvider } from '../context/ThemeContext';

const renderUniverse = (overrides = {}) => {
  const props = {
    user: { name: 'Ada' },
    setScreen: jest.fn(),
    setSelectedSubject: jest.fn(),
    setLearnView: jest.fn(),
    onOpenLesson: jest.fn(),
    onOpenDeepRead: jest.fn(),
    onLogout: jest.fn(),
    showToast: jest.fn(),
    ...overrides,
  };

  render(
    <ThemeProvider>
      <UniverseHome {...props} />
    </ThemeProvider>
  );
  return props;
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
    expect(screen.getByRole('button', { name: /^Physical Geography 20 topics$/ })).toBeInTheDocument();
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
    // Reach it the way a reader would: pick the field, expand the discipline
    // that holds it, open the subfield, then tap the topic. Only the first
    // discipline of a field is expanded on arrival, so the intermediate clicks
    // are real steps a person also has to take.
    fireEvent.click(screen.getByRole('button', { name: /^Philosophy,/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Philosophical Traditions/ }));
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
    fireEvent.click(screen.getByRole('button', { name: /Not written yet/i }));

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

describe('theme control in the header', () => {
  afterEach(() => {
    localStorage.removeItem('velora_theme_preference');
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  test('defaults to Auto and switches the document to dark when Dark is pressed', () => {
    renderUniverse();

    const auto = screen.getByRole('button', { name: /Auto/ });
    const dark = screen.getByRole('button', { name: /Dark/ });
    expect(auto).toHaveAttribute('aria-pressed', 'true');
    expect(dark).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(dark);

    expect(dark).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('velora_theme_preference')).toBe('dark');
  });
});
