import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    // Update auth state when it changes
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem('access_token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="navigation">
      <Link to="/" className="logo">Sopheo</Link>
      <nav className="nav-links">
        {authenticated ? (
          <>
            <Link to="/my-pathways" className="nav-link">
              My Pathways
            </Link>
            <button 
              onClick={handleSignOut} 
              className="nav-link sign-out-button"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/signin" className="nav-link">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}