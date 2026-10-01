import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import LoadingCard from './components/LoadingCard';
import CommandPalette from './components/CommandPalette';
import KeyboardHelp from './components/KeyboardHelp';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Core Landing / Auth Screens (loaded directly for instant initial render)
import SplashScreen from './screens/Splash';
import LocalProfileScreen from './screens/LocalProfile';
import { getProfile, clearProfile } from './utils/localProfile';
import BottomNav from './components/BottomNav';
import MobileNav from './components/MobileNav';
import OnboardingTour from './components/OnboardingTour';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { KEYS, readValue } from './utils/storage';

// Lazy-loaded heavy module bundles for ultra-fast initial paint & code-splitting
const UniverseHome = lazy(() => import('./screens/UniverseHome'));
const LandingPage = lazy(() => import('./screens/LandingPage'));
const LearnScreen = lazy(() => import('./screens/Learn'));
const CommunityScreen = lazy(() => import('./screens/Community'));
const AnalyticsScreen = lazy(() => import('./screens/Analytics'));
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
  // The identity here is a name stored in this browser, read once at startup.
  // Before this, the user object lived only in useState and vanished on
  // refresh, which is why "Log out" used to end a session that never began.
  const [user, setUser] = useState(() => getProfile());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [learnView, setLearnView] = useState('overview');
  const [toast, setToast] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [topicRequest, setTopicRequest] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // A lesson request handed to Learn by another screen. Until now the only way
  // into a lesson was to navigate to Learn and find the topic by hand, which is
  // why buttons that promised a specific lesson could only promise the screen.
  const openLesson = (subject, topicId) => {
    setSelectedSubject(subject);
    setTopicRequest({ subject, topicId });
    setLearnView('overview');
    setScreen('learn');
  };

  useKeyboardShortcuts({
    'cmd+k': () => setCommandPaletteOpen(true),
    'cmd+/': () => setKeyboardHelpOpen((open) => !open),
    escape: () => { setCommandPaletteOpen(false); setKeyboardHelpOpen(false); }
  });

  const handleStart = (profile) => {
    setUser(profile);
    setScreen('universe');
    let alreadyOnboarded = false;
    try {
      alreadyOnboarded = Boolean(readValue(KEYS.ONBOARDING_DONE, false));
    } catch {
      alreadyOnboarded = false;
    }
    if (!alreadyOnboarded) setShowOnboarding(true);
  };

  // Removes the stored name from this device. It is not a sign out: there is no
  // session to end and no server to tell. The label on the control says so.
  const handleForgetProfile = () => {
    clearProfile();
    setUser(null);
    setScreen('splash');
  };

  return (
    <ErrorBoundary>
      <div className="app">
        {screen === 'splash' ? null : (
          <MobileNav currentScreen={screen} setScreen={setScreen} onForgetProfile={handleForgetProfile} />
        )}
        <Suspense fallback={<ScreenLoader />}>
        {screen === 'splash' && <SplashScreen setScreen={setScreen} />}

        {screen === 'landing' && <LandingPage setScreen={setScreen} />}

        {screen === 'profile' && (
          <LocalProfileScreen setScreen={setScreen} onStart={handleStart} showToast={showToast} />
        )}

        {screen === 'universe' && user && (
          <UniverseHome
            user={user}
            setScreen={setScreen}
            setSelectedSubject={setSelectedSubject}
            setLearnView={setLearnView}
            onForgetProfile={handleForgetProfile}
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
            pendingTopic={topicRequest}
            onLessonOpened={() => setTopicRequest(null)}
            showToast={showToast}
          />
        )}

        {screen === 'community' && user && (
          <CommunityScreen setScreen={setScreen} onOpenLesson={openLesson} />
        )}

        {screen === 'analytics' && user && (
          <AnalyticsScreen setScreen={setScreen} user={user} />
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

        {user && screen !== 'splash' && screen !== 'profile' && screen !== 'landing' && (
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