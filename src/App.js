import React, { useState, Suspense, lazy } from 'react';
import './App.css';

// Core Landing / Auth Screens (loaded directly for instant initial render)
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import BottomNav from './components/BottomNav';
import OnboardingTour from './components/OnboardingTour';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary, #111111)',
      color: 'var(--text-secondary, #a0a0a0)',
      fontFamily: "var(--font-sans, 'Inter', -apple-system, sans-serif)",
      gap: '16px'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'var(--accent-primary, #667eea)',
        borderRadius: '50%',
        animation: 'spin 0.8s cubic-bezier(0.16, 1, 0.3, 1) infinite'
      }} />
      <span style={{ fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
        Preparing your workspace...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [learnView, setLearnView] = useState('overview');

  const handleLogin = (email, password) => {
    setUser({ email, name: email.split('@')[0] });
    setScreen('universe');
  };

  const handleRegister = (email, password, name) => {
    setUser({ email, name });
    // Show onboarding tour for new users
    const alreadyOnboarded = localStorage.getItem('velora_onboarding_done');
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
    <div className="app">
      <Suspense fallback={<ScreenLoader />}>
        {screen === 'splash' && <SplashScreen setScreen={setScreen} />}

        {screen === 'landing' && <LandingPage setScreen={setScreen} />}

        {screen === 'login' && (
          <LoginScreen setScreen={setScreen} onLogin={handleLogin} />
        )}

        {screen === 'register' && (
          <RegisterScreen setScreen={setScreen} onRegister={handleRegister} />
        )}

        {screen === 'universe' && user && (
          <UniverseHome
            user={user}
            setScreen={setScreen}
            setSelectedSubject={setSelectedSubject}
            setLearnView={setLearnView}
            onLogout={handleLogout}
          />
        )}

        {screen === 'learn' && user && (
          <LearnScreen
            setScreen={setScreen}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            initialView={learnView}
            setInitialView={setLearnView}
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
      </Suspense>
    </div>
  );
}

export default App;