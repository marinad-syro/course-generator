import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
      <header className="navigation">
        <div className="logo">Sopheo</div>
        <button className="menu-icon" aria-label="Menu">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M6 24H42M6 12H42M6 36H42" stroke="#471532" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="nav-divider"></div>
      </header>

  );
}