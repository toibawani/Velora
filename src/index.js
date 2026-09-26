import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-500.css';
import '@fontsource/source-serif-4/latin-600.css';
import '@fontsource/source-serif-4/latin-700.css';
import '@fontsource/fraunces/latin-400.css';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/fraunces/latin-400-italic.css';
import '@fontsource/fraunces/latin-500-italic.css';

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
