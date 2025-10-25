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
      // First, register the user
      await api.post('/users/register/', { email, password, username: email });
      
      // Then, log in to get the JWT tokens
      const response = await api.post('/token/', { 
        username: email, 
        password 
      });
      
      // Store both access and refresh tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      onSignupSuccess();
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-box">
        <h2>Sign Up to Unlock Your Course</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="switch-form-text">
          Already have an account?{' '}
          <button onClick={onSwitchToSignin} className="switch-form-button">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
