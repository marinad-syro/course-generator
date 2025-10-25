import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

export default function NavBar({ isAuthenticated, onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Remove all auth-related items from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Close the menu
    setIsMenuOpen(false);
    
    // Call the parent's sign out handler
    onSignOut();
    
    // Navigate to home page
    navigate('/');
  };

  const menuItems = isAuthenticated
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
      <button 
        className="menu-icon" 
        aria-label="Menu" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M6 24H42M6 12H42M6 36H42" stroke="#471532" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="nav-divider"></div>
      {isMenuOpen && <DropdownMenu items={menuItems} onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
}