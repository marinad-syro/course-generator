import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import NavBar from '../Components/NavBar';
import './MyPathwaysPage.css';

const MyPathwaysPage = () => {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        // Get the access token
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          // Redirect to sign in if not authenticated
          navigate('/signin');
          return;
        }

        // Fetch the user's areas
        const response = await api.get('/areas/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setPathways(response.data);
        } else {
          setError('Unexpected response format from server');
        }
      } catch (err) {
        console.error('Error fetching pathways:', err);
        if (err.response && err.response.status === 401) {
          // If unauthorized, clear tokens and redirect to sign in
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/signin');
          return;
        }
        setError('Failed to load your pathways. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPathways();
  }, [navigate]);

  if (loading) {
    return (
      <div className="my-pathways-page">
        <NavBar />
        <div className="loading-container">
          <div>Loading your learning pathways...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-pathways-page">
      <NavBar />
      <div className="pathways-list-container">
        <h1>My Learning Pathways</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : pathways.length > 0 ? (
          <ul className="pathways-list">
            {pathways.map((pathway) => (
              <li key={pathway.id} className="pathway-item">
                <Link 
                  to={`/learning-pathway/${pathway.id}`} 
                  className="pathway-link"
                >
                  {pathway.name || `Pathway ${pathway.id}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any learning pathways yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPathwaysPage;
