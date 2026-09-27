import { fireEvent, render, screen } from '@testing-library/react';
import UniverseHome from './UniverseHome';
import { ThemeProvider } from '../context/ThemeContext';

const renderUniverse = (overrides = {}) => {
  const props = {
    user: { name: 'Ada' },
    setScreen: jest.fn(),
    setSelectedSubject: jest.fn(),
    setLearnView: jest.fn(),
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

  test('keeps catalog-only disciplines as preview paths', () => {
    const { showToast, setSelectedSubject, setScreen } = renderUniverse();

    fireEvent.click(screen.getByRole('button', { name: /^Chemistry 32 topics$/ }));
    fireEvent.click(screen.getByRole('button', { name: /Keep this path/i }));

    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Science → Chemistry'), 'info');
    expect(setSelectedSubject).not.toHaveBeenCalled();
    expect(setScreen).not.toHaveBeenCalledWith('learn');
  });

  test('hands live subjects into the existing learning experience', () => {
    const { setSelectedSubject, setLearnView, setScreen } = renderUniverse();

    fireEvent.click(screen.getByRole('button', { name: /Open learning path/i }));

    expect(setSelectedSubject).toHaveBeenCalledWith('physics');
    expect(setLearnView).toHaveBeenCalledWith('overview');
    expect(setScreen).toHaveBeenCalledWith('learn');
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
