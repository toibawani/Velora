import React from 'react';
import ReactDOM from 'react-dom/client';
// Three families, each with one job. Source Serif 4 used to be removed from
// here to save four font files, which left --font-reading aliased to the UI sans
// and meant the long-form screens (Black Holes, History, Philosophy) were set in
// the same face as the nav chrome. That is the "same font at a different weight"
// problem, not a solution to it: a sans is efficient at short lengths and tiring
// at 60 characters for a paragraph.
//
// Fraunces    - display. Editorial voice, optical sizing, the Atlas index.
// Source Serif 4 - long-form body. Drawn for screen reading at this size.
// Source Sans 3 - UI chrome. Nav, buttons, status tags, dense labels.
//
// The weight list is not decoration. CSS resolves an unavailable weight by
// walking to a neighbour, and the direction it walks differs above and below
// 500: asking for 500 without one loaded quietly gives you 400, which is how
// every medium-weight label in this app ended up looking like body text.
// Everything requested in the CSS has a file here, and nothing here is
// unrequested. Source Sans 3 deliberately loads no 900: --weight-black is
// requested by h1 and resolves to 700 rather than to a synthesised bold.
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
// Three files, not four: 400 and 600 carry all long-form body and bold-led
// emphasis, and the italic is there because the Dictionary prints definitions in
// italic and a synthesised slant looks broken next to a real one.
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-600.css';
import '@fontsource/source-serif-4/latin-400-italic.css';

// Preserve compatibility tokens for existing feature screens while index.css
// owns the new global editorial surface.
import './styles/design-tokens.css';
import './index.css';
import App from './App';
import './styles/global-compat.css';

/**
 * VELORA root: hydrate the app, apply fonts and theme, and provide the
 * theme context to the whole tree.
 */
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
