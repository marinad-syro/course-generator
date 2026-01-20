import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Update auth state when it changes
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem('access_token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close menu when clicking outside or on a link
  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthenticated(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navigation">
      <Link to="/" className="logo">Sopheo</Link>

      <button
        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/feedback" className="nav-link" onClick={closeMenu}>
          Feedback
        </Link>
        {authenticated ? (
          <>
            <Link to="/my-pathways" className="nav-link" onClick={closeMenu}>
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
          <Link to="/signin" className="nav-link" onClick={closeMenu}>
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}