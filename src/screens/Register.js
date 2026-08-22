import React, { useState } from 'react';
import '../styles/Auth.css';

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
        <p className="auth-subtitle">Start your learning journey today</p>

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

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create account
          </button>
        </form>

        <button 
          onClick={() => setScreen('login')} 
          className="btn btn-secondary" 
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          Already have an account? Login
        </button>

        <button 
          onClick={() => setScreen('splash')} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#F1EFE8', 
            color: '#5F5E5A', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Register;