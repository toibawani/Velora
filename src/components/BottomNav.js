import React from 'react';
import { Compass, BookOpen, Zap, BarChart2, Users } from 'lucide-react';
import '../styles/BottomNav.css';

/**
 * BottomNav Component
 * 
 * Mobile-first fixed bottom navigation bar ensuring 48px+ touch targets,
 * thumb-zone navigation, and clean screen switching on mobile viewports.
 */
function BottomNav({ currentScreen, setScreen }) {
  const navItems = [
    { id: 'universe', label: 'Home', icon: Compass },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'games', label: 'Flow', icon: Zap },
    { id: 'analytics', label: 'Insights', icon: BarChart2 },
    { id: 'community', label: 'Community', icon: Users },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.id)}
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
