import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import LoadingCard from './components/LoadingCard';
import CommandPalette from './components/CommandPalette';
import KeyboardHelp from './components/KeyboardHelp';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Core Landing / Auth Screens (loaded directly for instant initial render)
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import BottomNav from './components/BottomNav';
import MobileNav from './components/MobileNav';
import OnboardingTour from './components/OnboardingTour';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

// Lazy-loaded heavy module bundles for ultra-fast initial paint & code-splitting
const UniverseHome = lazy(() => import('./screens/UniverseHome'));
const LandingPage = lazy(() => import('./screens/LandingPage'));
const LearnScreen = lazy(() => import('./screens/Learn'));
const CommunityScreen = lazy(() => import('./screens/Community'));
const GlossaryScreen = lazy(() => import('./screens/Glossary'));
const AnalyticsScreen = lazy(() => import('./screens/Analytics'));
const DoubtsScreen = lazy(() => import('./screens/Doubts'));
const ChallengesScreen = lazy(() => import('./screens/Challenges'));
const DictionaryScreen = lazy(() => import('./screens/Dictionary'));
const GameHubScreen = lazy(() => import('./screens/Games'));
const JourneyScreen = lazy(() => import('./screens/Journey'));

/**
 * Minimalist, elegant loading indicator for lazy-loaded screen bundles
 */
function ScreenLoader() {
  return (
    <main className="screen-loader" aria-label="Preparing your learning space" aria-busy="true">
      <div className="screen-loader-heading"><span className="screen-loader-line screen-loader-title" /><span className="screen-loader-line screen-loader-short" /></div>
      <LoadingCard count={3} label="Preparing your learning space" />
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [learnView, setLearnView] = useState('overview');
  const [toast, setToast] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useKeyboardShortcuts({
    'cmd+k': () => setCommandPaletteOpen(true),
    'cmd+/': () => setKeyboardHelpOpen((open) => !open),
    escape: () => { setCommandPaletteOpen(false); setKeyboardHelpOpen(false); }
  });

  const handleLogin = (email, password) => {
    setUser({ email, name: email.split('@')[0] });
    setScreen('universe');
    showToast('Welcome back. Pick up where your curiosity left off.', 'success');
  };

  const handleRegister = (email, password, name) => {
    setUser({ email, name });
    showToast('Your account is ready. Welcome to VELORA.', 'success');
    // Show onboarding tour for new users
    let alreadyOnboarded = false;
    try {
      alreadyOnboarded = Boolean(localStorage.getItem('velora_onboarding_done'));
    } catch {
      alreadyOnboarded = false;
    }
    if (!alreadyOnboarded) {
      setScreen('universe');
      setShowOnboarding(true);
    } else {
      setScreen('universe');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('splash');
  };

  return (
    <ErrorBoundary>
      <div className="app">
        {screen === 'splash' ? null : (
          <MobileNav currentScreen={screen} setScreen={setScreen} onLogout={handleLogout} />
        )}
        <Suspense fallback={<ScreenLoader />}>
        {screen === 'splash' && <SplashScreen setScreen={setScreen} />}

        {screen === 'landing' && <LandingPage setScreen={setScreen} />}

        {screen === 'login' && (
          <LoginScreen setScreen={setScreen} onLogin={handleLogin} showToast={showToast} />
        )}

        {screen === 'register' && (
          <RegisterScreen setScreen={setScreen} onRegister={handleRegister} showToast={showToast} />
        )}

        {screen === 'universe' && user && (
          <UniverseHome
            user={user}
            setScreen={setScreen}
            setSelectedSubject={setSelectedSubject}
            setLearnView={setLearnView}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}

        {screen === 'learn' && user && (
          <LearnScreen
            setScreen={setScreen}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            initialView={learnView}
            setInitialView={setLearnView}
            showToast={showToast}
          />
        )}

        {screen === 'community' && user && (
          <CommunityScreen setScreen={setScreen} />
        )}

        {screen === 'glossary' && user && (
          <GlossaryScreen setScreen={setScreen} />
        )}

        {screen === 'analytics' && user && (
          <AnalyticsScreen setScreen={setScreen} user={user} />
        )}

        {screen === 'doubts' && user && (
          <DoubtsScreen setScreen={setScreen} />
        )}

        {screen === 'challenges' && user && (
          <ChallengesScreen setScreen={setScreen} />
        )}

        {screen === 'dictionary' && user && (
          <DictionaryScreen setScreen={setScreen} />
        )}

        {screen === 'games' && user && (
          <GameHubScreen setScreen={setScreen} />
        )}

        {screen === 'journey' && user && (
          <JourneyScreen setScreen={setScreen} />
        )}

        {user && screen !== 'splash' && screen !== 'login' && screen !== 'register' && screen !== 'landing' && (
          <BottomNav currentScreen={screen} setScreen={setScreen} />
        )}

        {/* Smart Onboarding Tour for new users */}
        {showOnboarding && user && (
          <OnboardingTour
            onComplete={() => setShowOnboarding(false)}
            setSelectedSubject={setSelectedSubject}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={(nextScreen) => {
          if (nextScreen === 'learn' && !selectedSubject) setSelectedSubject('physics');
          setScreen(nextScreen);
        }} />
        <KeyboardHelp isOpen={keyboardHelpOpen} onClose={() => setKeyboardHelpOpen(false)} />
      </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;