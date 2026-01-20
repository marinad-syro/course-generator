import React, { useState } from 'react';
import api from '../api';
import './SignupComponent.css';

const SignupComponent = ({ onSignupSuccess, onSwitchToSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Register the user (backend derives username from email and returns tokens)
      const response = await api.post('/users/register/', { email, password });

      // Store both access and refresh tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

      onSignupSuccess();
    } catch (err) {
      const details = err?.response?.data?.details || err?.response?.data?.error || err.message;
      setError(`Failed to sign up. ${typeof details === 'string' ? details : JSON.stringify(details)}`);
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-box">
        <h2>Sign Up to Create a Course</h2>
        <p>You need to have a free account where the course will be saved.</p>
        <form onSubmit={handleSignup}>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="submit">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="switch-form-text">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToSignin} className="switch-form-button">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
