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
            Learn differently. Think deeply.
          </p>
        </div>

        {/* Value proposition */}
        <p className="splash-description">
          An immersive learning experience for Physics, Philosophy,
          Chemistry, Biology, History, and Mathematics.
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