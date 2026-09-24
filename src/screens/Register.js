import React, { useState } from 'react';
import '../styles/Auth.css';
import { getErrorMessage } from '../utils/validation';

/**
 * Register Screen
 *
 * Clean, token-backed registration form. Inline styles removed in favour
 * of Auth.css utility classes (.btn-secondary, .btn-ghost, .btn-full).
 */
function Register({ setScreen, onRegister, showToast }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(getErrorMessage('Username', value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(getErrorMessage('Email', value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(getErrorMessage('Password', value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nErr = getErrorMessage('Username', name);
    const eErr = getErrorMessage('Email', email);
    const pErr = getErrorMessage('Password', password);
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (nErr || eErr || pErr || !name || !email || !password) {
      if (showToast) {
        showToast('Please fill in all fields correctly.', 'error');
      }
      return;
    }
    onRegister(email, password, name);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Join VELORA</h1>
        <p className="auth-subtitle">Start your intellectual exploration today</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameError && (
              <span className="auth-field-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {nameError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && (
              <span className="auth-field-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {emailError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && (
              <span className="auth-field-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {passwordError}
              </span>
            )}
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