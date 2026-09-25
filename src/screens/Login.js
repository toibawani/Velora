import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Auth.css';
import { getErrorMessage } from '../utils/validation';

function Login({ setScreen, onLogin, showToast }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) setEmailError(getErrorMessage('Email', value));
  };

  const handleEmailBlur = () => {
    setTouched((current) => ({ ...current, email: true }));
    setEmailError(getErrorMessage('Email', email));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) setPasswordError(getErrorMessage('Password', value));
  };

  const handlePasswordBlur = () => {
    setTouched((current) => ({ ...current, password: true }));
    setPasswordError(getErrorMessage('Password', password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eErr = getErrorMessage('Email', email);
    const pErr = getErrorMessage('Password', password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr || !email || !password) {
      if (showToast) {
        showToast('Please check your email and password.', 'error');
      }
      return;
    }
    onLogin(email.trim().toLowerCase(), password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your learning journey</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'login-email-error' : undefined}
              required
            />
            {emailError && (
              <span className="auth-field-error" id="login-email-error">
                {emailError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'login-password-error' : undefined}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            {passwordError && (
              <span className="auth-field-error" id="login-password-error">
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
            type="button"
            onClick={() => setScreen('register')}
            className="auth-link"
          >
            Don't have an account? <span>Sign up</span>
          </button>
          <button
            type="button"
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