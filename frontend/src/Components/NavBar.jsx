import { Link } from 'react-router-dom';
import './NavBar.css';

export default function Navbar() {
  // Check if user is authenticated (you might want to get this from your auth context)
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  return (
    <header className="navigation">
      <Link to="/" className="logo">Sopheo</Link>
      <nav className="nav-links">
        {isAuthenticated ? (
          <Link to="/my-pathways" className="nav-link">
            My Pathways
          </Link>
        ) : (
          <Link to="/signin" className="nav-link">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}