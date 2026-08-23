import React, { useState, Suspense, lazy } from 'react';
import './App.css';

// Core Landing / Auth Screens (loaded directly for instant initial render)
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import BottomNav from './components/BottomNav';

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
      color: 'var(--text-secondary, #888888)',
      fontFamily: "Inter, -apple-system, sans-serif",
      gap: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#4f7df3',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Synthesizing Universe...
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

  const handleLogin = (email, password) => {
    setUser({ email, name: email.split('@')[0] });
    setScreen('universe');
  };

  const handleRegister = (email, password, name) => {
    setUser({ email, name });
    setScreen('universe');
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
            onLogout={handleLogout}
          />
        )}

        {screen === 'learn' && user && (
          <LearnScreen
            setScreen={setScreen}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
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

        {user && screen !== 'splash' && screen !== 'login' && screen !== 'register' && (
          <BottomNav currentScreen={screen} setScreen={setScreen} />
        )}
      </Suspense>
    </div>
  );
}

export default App;