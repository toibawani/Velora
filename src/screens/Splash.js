import React from 'react';
import '../styles/Splash.css';

/**
 * Splash — First screen the user sees.
 *
 * Clean, confident, minimal. Like a premium product's welcome gate.
 * No emojis, no pastel gradients, no clutter. Just the brand and two actions.
 */
function SplashScreen({ setScreen }) {
  return (
    <div className="splash">
      <div className="splash-content">
        {/* Brand mark */}
        <div className="splash-brand">
          <h1 className="splash-wordmark">VELORA</h1>
          <p className="splash-tagline">
            Learn what stays with you.
          </p>
        </div>

        {/* Value proposition */}
        <p className="splash-description">
          A calm learning space for physics, philosophy, and history—built for people who want to understand the why, not just pass the test.
        </p>

        {/* Actions */}
        <div className="splash-actions">
          <button
            className="splash-btn splash-btn-primary"
            onClick={() => setScreen('login')}
          >
            Sign in
          </button>
          <button
            className="splash-btn splash-btn-secondary"
            onClick={() => setScreen('register')}
          >
            Create account
          </button>
        </div>

        {/* Footer micro-copy */}
        <p className="splash-footer">
          Free for everyone. No credit card required.
        </p>
      </div>
    </div>
  );
}

export default SplashScreen;