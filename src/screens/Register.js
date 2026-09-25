import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'register-name-error' : undefined}
              required
            />
            {nameError && (
              <span className="auth-field-error" id="register-name-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {nameError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'register-email-error' : undefined}
              required
            />
            {emailError && (
              <span className="auth-field-error" id="register-email-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {emailError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'register-password-error' : undefined}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            {passwordError && (
              <span className="auth-field-error" id="register-password-error" style={{ color: '#E74C3C', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
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