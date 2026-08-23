import React, { useState } from 'react';
import '../styles/Auth.css';

/**
 * Register Screen
 *
 * Clean, token-backed registration form. Inline styles removed in favour
 * of Auth.css utility classes (.btn-secondary, .btn-ghost, .btn-full).
 */
function Register({ setScreen, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password, name);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Join VELORA</h1>
        <p className="auth-subtitle">Start your intellectual exploration today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          <button
            onClick={() => setScreen('login')}
            className="auth-link"
          >
            Already have an account? <span>Sign in</span>
          </button>
          <button
            onClick={() => setScreen('splash')}
            className="auth-back"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;