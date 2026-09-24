import React, { useState } from 'react';
import '../styles/MobileNav.css';

function MobileNav({ currentScreen, setScreen, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', screen: 'universe' },
    { name: 'Learn', screen: 'learn' },
    { name: 'Community', screen: 'community' },
    { name: 'Analytics', screen: 'analytics' },
  ];

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open mobile navigation"
        aria-expanded={isOpen}
      >
        ☰
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
      >
        <div className="mobile-nav-header">
          <h3>VELORA</h3>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-nav-list" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <button
              key={item.screen}
              className={`mobile-nav-item ${currentScreen === item.screen ? 'active' : ''}`}
              onClick={() => {
                setScreen(item.screen);
                setIsOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {onLogout && (
          <button className="mobile-nav-logout" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default MobileNav;
