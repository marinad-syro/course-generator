import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/'); // Navigate to home page after sign out
  };

  const menuItems = isLoggedIn
    ? [
        { label: 'View My Pathways', path: '/my-pathways' },
        { label: 'Sign Out', onClick: handleSignOut },
      ]
    : [
        { label: 'Sign In', path: '/signin' },
      ];
  return (
      <header className="navigation">
        <div onClick={() => navigate('/')} className="logo">Sopheo</div>
        <button className="menu-icon" aria-label="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M6 24H42M6 12H42M6 36H42" stroke="#471532" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="nav-divider"></div>
        {isMenuOpen && <DropdownMenu items={menuItems} />}
      </header>

  );
}