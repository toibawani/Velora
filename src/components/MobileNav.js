import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, BookOpen, BookText, Users, BarChart3, LogOut, Gamepad2 } from 'lucide-react';
import '../styles/MobileNav.css';
import { useFocusTrap } from '../hooks/useFocusTrap';

function MobileNav({ currentScreen, setScreen, onForgetProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);
  useFocusTrap(isOpen, drawerRef, { onClose: () => setIsOpen(false) });

  const navItems = [
    { name: 'Home', screen: 'universe', icon: Home },
    { name: 'Learn', screen: 'learn', icon: BookOpen },
    { name: 'Curious Dictionary', screen: 'dictionary', icon: BookText },
    { name: 'Flow Games', screen: 'games', icon: Gamepad2 },
    { name: 'Analytics', screen: 'analytics', icon: BarChart3 },
    { name: 'Community', screen: 'community', icon: Users },
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
      toggleRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (screen) => {
    setScreen(screen);
    setIsOpen(false);
  };

  const handleForgetProfile = () => {
    if (onForgetProfile) {
      onForgetProfile();
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className="mobile-nav-toggle"
        ref={toggleRef}
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
        ref={drawerRef}
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
            return (
              <button
                key={item.screen}
                className={`mobile-nav-item ${currentScreen === item.screen ? 'active' : ''}`}
                onClick={() => handleNavClick(item.screen)}
                aria-current={currentScreen === item.screen ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {onForgetProfile && (
          <button
            className="mobile-nav-logout"
            onClick={handleForgetProfile}
            aria-label="Forget this device profile"
          >
            <LogOut size={20} strokeWidth={2} />
            Forget this profile
          </button>
        )}
      </div>
    </>
  );
}

export default MobileNav;
