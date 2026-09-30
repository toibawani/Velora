import React from 'react';
import ReactDOM from 'react-dom/client';
// Two families, and only two. Fraunces carries every heading; Source Sans 3
// carries everything you actually read. Source Serif 4 used to sit in the
// middle as a "reading" face, which made it three families rather than a
// pairing and cost four extra font files on every first visit.
//
// The weight list is not decoration. CSS resolves an unavailable weight by
// walking to a neighbour, and the direction it walks differs above and below
// 500: asking for 500 without one loaded quietly gives you 400, which is how
// every medium-weight label in this app ended up looking like body text.
// Everything requested in the CSS has a file here, and nothing here is
// unrequested except 300, which the hero lede uses deliberately.
import '@fontsource/source-sans-3/latin-300.css';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-500.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/source-sans-3/latin-700.css';
import '@fontsource/fraunces/latin-400.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/fraunces/latin-900.css';
import '@fontsource/fraunces/latin-400-italic.css';

// Preserve compatibility tokens for existing feature screens while index.css
// owns the new global editorial surface.
import './styles/design-tokens.css';
import './index.css';
import App from './App';
import './styles/global-compat.css';
// Imported here in one fixed order rather than from each component. They
// cascade against each other, and letting the order depend on which component
// happened to load first made that order vary between builds.
import './styles/FlowStateGame.css';
import './styles/PhysicsSimulations.css';
import './styles/RelativityLab.css';
import './styles/ShareAchievementModal.css';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
