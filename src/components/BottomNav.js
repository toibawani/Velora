import React from 'react';
import '../styles/BottomNav.css';

/**
 * BottomNav Component
 * 
 * Mobile-first fixed bottom navigation bar ensuring 48px+ touch targets,
 * thumb-zone navigation, and clean screen switching on mobile viewports.
 */
function BottomNav({ currentScreen, setScreen }) {
  const navItems = [
    { id: 'universe', label: 'Home', icon: '🌌' },
    { id: 'learn', label: 'Learn', icon: '⚛️' },
    { id: 'games', label: 'Flow', icon: '⚡' },
    { id: 'analytics', label: 'Insights', icon: '📊' },
    { id: 'community', label: 'Community', icon: '👥' },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.id)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
