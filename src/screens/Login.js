import React, { useState } from 'react';
import '../styles/Auth.css';
import { getErrorMessage } from '../utils/validation';

function Login({ setScreen, onLogin }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    const eErr = getErrorMessage('Email', email);
    const pErr = getErrorMessage('Password', password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr || !email || !password) {
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your learning journey</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          <button
            onClick={() => setScreen('register')}
            className="auth-link"
          >
            Don't have an account? <span>Sign up</span>
          </button>
          <button
            onClick={() => setScreen('splash')}
            className="auth-back"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;