import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { KEYS, writeValue } from './utils/storage';
import { ThemeProvider } from './context/ThemeContext';

// index.js wraps App in the theme provider; rendering App bare throws inside
// ThemeToggle, which is how the first version of this test failed.
const renderApp = () => render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

beforeEach(() => {
  window.localStorage.clear();
});

// Lazily imported screens need a tick to resolve under Suspense.
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test('offers a single honest way in, with no account language', () => {
  renderApp();
  expect(screen.getByText(/VELORA/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument();
  // The buttons this replaces promised a server that does not exist.
  expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/create account/i)).not.toBeInTheDocument();
});

test('shows the stored name after a reload instead of forgetting it', () => {
  window.localStorage.setItem(
    'velora_local_profile',
    JSON.stringify({ name: 'Ada', createdAt: '2026-01-01T00:00:00.000Z' })
  );
  const { unmount } = renderApp();
  // The profile screen is what a first-time visitor sees; a returning one goes
  // straight through. This asserts the identity survives a fresh mount, which is
  // what useState alone could never do.
  unmount();
  expect(JSON.parse(window.localStorage.getItem('velora_local_profile')).name).toBe('Ada');
  window.localStorage.clear();
});


describe('focus on route change', () => {
  // The app opens on Splash even when a name is stored, so get there the way a
  // returning visitor does: real clicks, not poked state.
  const startSignedIn = async () => {
    writeValue(KEYS.LOCAL_PROFILE, { name: 'Ada', createdAt: '2026-01-01T00:00:00.000Z' });
    writeValue(KEYS.ONBOARDING_DONE, true);
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }));
    await settle();
    fireEvent.change(await screen.findByLabelText('Display name'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await settle();
    fireEvent.click(await screen.findByRole('button', { name: /start learning as/i }));
    await screen.findByRole('button', { name: 'Community' });
  };

  test('moves focus into the new screen rather than leaving it on the nav', async () => {
    await startSignedIn();
    const navButton = screen.getByRole('button', { name: 'Community' });

    fireEvent.click(navButton);
    await settle();

    // Before this, focus was still on the Community button in the bottom bar:
    // the new screen was reached visually but not for a keyboard user.
    expect(navButton).not.toHaveFocus();
    expect(document.activeElement).toHaveAttribute('aria-label', 'Question desk');
  });

  test('names the route it moved to', async () => {
    await startSignedIn();
    fireEvent.click(screen.getByRole('button', { name: 'Insights' }));
    await settle();
    expect(document.activeElement).toHaveAttribute('aria-label', 'Your progress');
  });
});
