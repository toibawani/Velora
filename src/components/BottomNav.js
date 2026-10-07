import React from 'react';
import PropTypes from 'prop-types';
import { PRIMARY_SCREENS } from '../navigation';
import '../styles/BottomNav.css';

/**
 * BottomNav Component
 *
 * Mobile-first fixed bottom navigation bar ensuring 48px+ touch targets,
 * thumb-zone navigation, and clean screen switching on mobile viewports.
 *
 * The items come from src/navigation.js rather than a list of its own. The
 * Curious Dictionary used to be missing from this bar, which meant that on the
 * widths where this bar is the only permanent nav, the dictionary was one
 * drawer tap away instead of one tap. The list used to live here, and a
 * screen added to the app could easily be left out of it, so it lives in one
 * place now and this bar is capped at the six entries marked primary.
 */
function BottomNav({ currentScreen, setScreen }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {PRIMARY_SCREENS.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="mobile-nav-icon">
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  color={isActive ? 'var(--color-accent)' : 'var(--color-text-muted)'}
                />
              </span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
