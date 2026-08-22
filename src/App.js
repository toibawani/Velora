import React, { useState } from 'react';
import './App.css';

// Screen Components
import UniverseHome from './screens/UniverseHome';
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import LearnScreen from './screens/Learn';
import CommunityScreen from './screens/Community';
import GlossaryScreen from './screens/Glossary';
import AnalyticsScreen from './screens/Analytics';
import DoubtsScreen from './screens/Doubts';
import ChallengesScreen from './screens/Challenges';
import DictionaryScreen from './screens/Dictionary';
import GameHubScreen from './screens/Games';
import JourneyScreen from './screens/Journey';

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
      {screen === 'splash' && <SplashScreen setScreen={setScreen} />}

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
    </div>
  );
}

export default App;