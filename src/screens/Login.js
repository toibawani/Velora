import React, { useState } from 'react';
import '../styles/Auth.css';

function Login({ setScreen, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your learning journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
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