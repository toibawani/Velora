import { fireEvent, render, screen, within } from '@testing-library/react';
import UniverseHome from './UniverseHome';
import { ThemeProvider } from '../context/ThemeContext';
import { saveLastLesson, saveLessonProgress } from '../utils/resumePath';
import { getDailyRabbitHole, readNotebook, saveAnswer, dateKey } from '../utils/dailyRabbitHole';

/**
 * Home is two screens: the day's card, and a field.
 *
 * These tests are about the two promises the rebuild makes. First, the daily
 * card is one question from real dictionary content, and an answer written into
 * it is in the notebook afterwards - no placeholder and no invented streak.
 * Second, a field opens as its own page and a topic with content opens that
 * content on one click, with no preview panel in between.
 */
const baseProps = () => ({
  user: { name: 'Ada' },
  setScreen: jest.fn(),
  setSelectedSubject: jest.fn(),
  setLearnView: jest.fn(),
  onOpenLesson: jest.fn(),
  onOpenDeepRead: jest.fn(),
  onForgetProfile: jest.fn(),
  showToast: jest.fn(),
});

const renderUniverse = (overrides = {}) => {
  const props = { ...baseProps(), ...overrides };
  render(
    <ThemeProvider>
      <UniverseHome {...props} />
    </ThemeProvider>
  );
  return props;
};

const openField = (name) => {
  const tab = screen.getByRole('button', { name: new RegExp(`^${name}, \\d+ of \\d+ topics written$`) });
  fireEvent.click(tab);
};

describe('the daily rabbit hole', () => {
  beforeEach(() => localStorage.clear());

  test('asks one question, drawn from a real dictionary entry', () => {
    renderUniverse();
    const daily = getDailyRabbitHole();

    expect(screen.getByRole('heading', { name: daily.prompt })).toBeInTheDocument();
    // The dictionary is the source: its explanation is inside the fold, not a
    // hand-written answer somewhere else.
    fireEvent.click(screen.getByText('Compare with the dictionary'));
    expect(screen.getByText(daily.term.explanation)).toBeInTheDocument();
    expect(screen.getByText(daily.term.example, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText(daily.term.term, { exact: false }).length).toBeGreaterThan(0);
  });

  test('starts with an honest empty notebook, not sample entries', () => {
    renderUniverse();
    expect(screen.getByText('Nothing saved yet. Today’s answer will be the first entry.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('saves the answer in the reader’s words and shows it in the notebook', () => {
    renderUniverse();
    const daily = getDailyRabbitHole();
    const box = screen.getByLabelText('Explain it back, in your own words');

    fireEvent.change(box, { target: { value: 'It is the last line you can still turn back from.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save to notebook' }));

    // Once in the notebook, once in the box that is still holding the draft.
    expect(screen.getAllByText('It is the last line you can still turn back from.')).toHaveLength(2);
    expect(screen.getByText('1 answer kept in this browser.')).toBeInTheDocument();
    expect(readNotebook()).toHaveLength(1);
    expect(readNotebook()[0].date).toBe(daily.date);
  });

  test('a second save replaces the answer instead of adding a second entry', () => {
    renderUniverse();
    const box = screen.getByLabelText('Explain it back, in your own words');

    fireEvent.change(box, { target: { value: 'first try' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save to notebook' }));
    fireEvent.change(box, { target: { value: 'corrected' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update today’s answer' }));

    expect(readNotebook()).toHaveLength(1);
    expect(readNotebook()[0].text).toBe('corrected');
    expect(screen.queryByText('first try')).not.toBeInTheDocument();
  });

  test('cannot save a blank answer, and says so rather than pretending', () => {
    renderUniverse();
    expect(screen.getByRole('button', { name: 'Save to notebook' })).toBeDisabled();
  });

  test('deleting an entry removes it from the notebook and the storage', () => {
    renderUniverse();
    fireEvent.change(screen.getByLabelText('Explain it back, in your own words'), { target: { value: 'mine' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save to notebook' }));

    fireEvent.click(screen.getByRole('button', { name: /^Delete the answer for/ }));

    expect(readNotebook()).toEqual([]);
    expect(screen.getByText('Nothing saved yet. Today’s answer will be the first entry.')).toBeInTheDocument();
  });

  test('an answer saved yesterday is still in the box when the screen is opened again', () => {
    const daily = getDailyRabbitHole();
    saveAnswer({
      date: dateKey(), entryId: daily.id, prompt: daily.prompt, termId: daily.termId, text: 'kept',
    });
    renderUniverse();

    expect(screen.getByLabelText('Explain it back, in your own words')).toHaveValue('kept');
    expect(screen.getByRole('button', { name: 'Update today’s answer' })).toBeInTheDocument();
  });

  test('every day has a diagram with a control, not a decorative picture', () => {
    renderUniverse();
    expect(screen.getByRole('img', { name: /./ })).toBeInTheDocument();
    // The control differs by diagram: a slider where a quantity is continuous,
    // a stir button where the box is shuffled. Both are read by role so the
    // assertion does not depend on a class name. The cave used to be a still
    // picture, so this failed on the days the daily rotation landed on it.
    const control = screen.queryByRole('button', { name: /Stir the box/i })
      || screen.queryByRole('slider');
    expect(control).not.toBeNull();
    expect(control).toBeInTheDocument();
  });
});

describe('a field is its own page', () => {
  test('the six fields are tabs with their real coverage', () => {
    renderUniverse();
    ['Science', 'Philosophy', 'History', 'Political Science', 'Geography', 'Literature'].forEach((field) => {
      expect(screen.getByRole('button', { name: new RegExp(`^${field}, \\d+ of \\d+ topics written$`) })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /^Science, 89 of 188 topics written$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Literature, 0 of 92 topics written$/ })).toBeInTheDocument();
  });

  test('opening Science replaces Today with the field and its disciplines', () => {
    renderUniverse();
    openField('Science');

    expect(screen.getByRole('heading', { level: 1, name: 'Science' })).toBeInTheDocument();
    expect(screen.getByText((_, element) =>
      element?.className === 'shelf-count' && /89\s*of 188 topics written/.test(element.textContent || '')
    )).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Disciplines in Science' })).toBeInTheDocument();
    expect(screen.queryByText('One question a day.')).not.toBeInTheDocument();
  });

  test('a topic with a deep read opens it on one click, with no preview step', () => {
    const { onOpenDeepRead, onOpenLesson, setSelectedSubject } = renderUniverse();
    openField('Science');
    // Black Holes is filed under Space Science > Astrophysics, so open that
    // discipline the way a reader would rather than reaching past the rail.
    fireEvent.click(screen.getByRole('button', { name: /^Space Science/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Black Holes, open' }));

    expect(onOpenDeepRead).toHaveBeenCalledWith('black-holes', undefined);
    expect(onOpenLesson).not.toHaveBeenCalled();
    expect(setSelectedSubject).toHaveBeenCalledWith('physics');
    expect(screen.queryByRole('button', { name: /Open the deep read/i })).not.toBeInTheDocument();
  });

  test('a philosophy topic opens the deep read on the level that carries it', () => {
    const { onOpenDeepRead } = renderUniverse();
    openField('Philosophy');
    fireEvent.click(screen.getByRole('button', { name: /^Branches/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Free Will, open' }));

    expect(onOpenDeepRead).toHaveBeenCalledWith('philosophy-core', 'are-we-free');
  });

  test('a written lesson opens that exact lesson and remembers it', () => {
    const { onOpenLesson, setSelectedSubject, showToast } = renderUniverse();
    openField('Philosophy');
    fireEvent.click(screen.getByRole('button', { name: /^Philosophical Traditions/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Stoicism, open' }));

    expect(onOpenLesson).toHaveBeenCalledWith('philosophy', 'stoicism');
    expect(setSelectedSubject).toHaveBeenCalledWith('philosophy');
    expect(showToast).not.toHaveBeenCalled();
  });

  test('an unwritten topic is named as unwritten and cannot be clicked', () => {
    renderUniverse();
    openField('Science');

    // A status coloured in only would be invisible to a screen reader, so the
    // state is in the name as well as in the ink.
    const unwritten = screen.getByLabelText('Quantum Tunneling, not written yet');
    expect(unwritten.tagName).not.toBe('BUTTON');
    expect(within(unwritten).getByText('not written yet')).toBeInTheDocument();
  });

  test('searching an unwritten topic says why it did not open', () => {
    const { onOpenLesson, onOpenDeepRead, showToast } = renderUniverse();
    fireEvent.change(screen.getByLabelText('Search the knowledge atlas'), { target: { value: 'Quantum Tunneling' } });
    fireEvent.click(screen.getByRole('button', { name: 'Quantum Tunneling, Science' }));

    expect(onOpenLesson).not.toHaveBeenCalled();
    expect(onOpenDeepRead).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('not written yet'), 'info');
  });

  test('searching a written topic opens it directly', () => {
    const { onOpenDeepRead } = renderUniverse();
    fireEvent.change(screen.getByLabelText('Search the knowledge atlas'), { target: { value: 'Black Holes' } });
    fireEvent.click(screen.getByRole('button', { name: 'Black Holes, Science' }));

    expect(onOpenDeepRead).toHaveBeenCalledWith('black-holes', undefined);
  });

  test('the way back to Today is one control, not a scroll to the top', () => {
    renderUniverse();
    openField('Science');
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByText('One question a day.')).toBeInTheDocument();
  });
});

describe('the resume card', () => {
  beforeEach(() => localStorage.clear());

  test('says how much of the lesson is left', () => {
    saveLastLesson('physics', 'black-holes', 'Black Holes');
    saveLessonProgress('physics', 'black-holes', 62);
    renderUniverse();

    const card = screen.getByRole('region', { name: 'Black Holes' });
    expect(within(card).getByText('62% read')).toBeInTheDocument();
    expect(within(card).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '62');
  });

  test('a lesson with no recorded position shows no bar rather than an empty one', () => {
    saveLastLesson('physics', 'black-holes', 'Black Holes');
    renderUniverse();

    const card = screen.getByRole('region', { name: 'Black Holes' });
    expect(within(card).queryByRole('progressbar')).toBeNull();
    expect(within(card).getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });

  test('resuming opens the lesson the card names', () => {
    saveLastLesson('philosophy', 'platos-cave', "Plato's Cave");
    const view = renderUniverse();
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(view.onOpenLesson).toHaveBeenCalledWith('philosophy', 'platos-cave');
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
    const auto = screen.getByRole('button', { name: /^Theme: Auto/ });
    const dark = screen.getByRole('button', { name: /^Theme: Dark/ });
    expect(auto).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(dark);
    expect(dark).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
