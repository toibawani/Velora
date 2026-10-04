import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
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
  // "Insights" is now in both the header and the bottom bar, because the header
  // renders the same shared registry. Scope the lookup to the bar so this keeps
  // testing the bottom nav rather than whichever of the two mounts first.
  const bottomBarButton = (name) =>
    within(document.querySelector('.mobile-bottom-nav')).getByRole('button', { name });

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
    // Wait for the bar, not for any "Insights" button: the header renders the
    // same shared list, so a bare findByRole matches two and throws.
    await waitFor(() => expect(bottomBarButton('Insights')).toBeInTheDocument());
  };

  test('moves focus into the new screen rather than leaving it on the nav', async () => {
    await startSignedIn();
    fireEvent.click(screen.getByRole('button', { name: /open mobile navigation/i }));
    const navButton = await screen.findByRole('button', { name: 'Question desk' });

    fireEvent.click(navButton);
    await settle();

    // Before this, focus was still on the nav button: the new screen was reached
    // visually but not for a keyboard user.
    expect(navButton).not.toHaveFocus();

    // Waited on rather than asserted once.
    //
    // The screen is lazily imported behind Suspense, and focus is moved by an
    // effect keyed on the route. `settle()` is a single macrotask, which is
    // enough when the module is already in the require cache and not enough
    // when seventy other suites are competing for the event loop: this test
    // failed intermittently under the full parallel run and passed alone, which
    // is the signature of a timing assumption rather than a broken app.
    //
    // What is being asserted is that focus eventually lands on the new route,
    // not that it happens within one tick. Waiting for it states that.
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('aria-label', 'Question desk');
    });
  });

  test('names the route it moved to', async () => {
    await startSignedIn();
    fireEvent.click(bottomBarButton('Insights'));
    await settle();
    expect(document.activeElement).toHaveAttribute('aria-label', 'Your progress');
  });
});
