import React, { useState } from 'react';
import api from '../api';
import './SignupComponent.css'; // Reusing the same CSS for a consistent look

const SignInComponent = ({ onSigninSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // The backend's login view expects 'username', so we send the email as the username.
      const response = await api.post('/users/login/', { username: email, password });
      localStorage.setItem('token', response.data.access);
      onSigninSuccess();
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-box">
        <h2>Sign In to Your Account</h2>
        <form onSubmit={handleSignin}>
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
          <button type="submit">Sign In</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="switch-form-text">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="switch-form-button">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInComponent;
