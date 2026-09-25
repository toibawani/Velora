import { fireEvent, render, screen } from '@testing-library/react';
import UniverseHome from './UniverseHome';

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

  render(<UniverseHome {...props} />);
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
