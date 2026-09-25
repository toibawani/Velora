import React, { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, Users, BarChart3, LogOut } from 'lucide-react';
import '../styles/MobileNav.css';

function MobileNav({ currentScreen, setScreen, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', screen: 'universe', icon: Home },
    { name: 'Learn', screen: 'learn', icon: BookOpen },
    { name: 'Flow Games', screen: 'games', icon: () => '🎮' },
    { name: 'Analytics', screen: 'analytics', icon: BarChart3 },
    { name: 'Community', screen: 'community', icon: Users },
    { name: 'Challenges', screen: 'challenges', icon: () => '🏆' },
  ];

  // Close nav on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (screen) => {
    setScreen(screen);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile navigation"
        aria-expanded={isOpen}
      >
        <Menu size={24} strokeWidth={2} />
      </button>

      {isOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`mobile-nav ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-nav-header">
          <h3>VELORA</h3>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <nav className="mobile-nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isEmoji = typeof Icon === 'function' && Icon().length === 1;
            return (
              <button
                key={item.screen}
                className={`mobile-nav-item ${currentScreen === item.screen ? 'active' : ''}`}
                onClick={() => handleNavClick(item.screen)}
                aria-current={currentScreen === item.screen ? 'page' : undefined}
              >
                {isEmoji ? (
                  <span style={{ marginRight: '12px', fontSize: '1.25rem' }}>{Icon()}</span>
                ) : (
                  <Icon size={20} strokeWidth={2} style={{ marginRight: '12px' }} />
                )}
                {item.name}
              </button>
            );
          })}
        </nav>

        {onLogout && (
          <button
            className="mobile-nav-logout"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut size={20} strokeWidth={2} style={{ marginRight: '8px' }} />
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default MobileNav;
