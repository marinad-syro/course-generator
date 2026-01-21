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

  const fetchPathways = React.useCallback(async () => {
    try {
      // Get the access token
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await api.get('/areas/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setPathways(response.data);
      } else {
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/signin');
        return;
      }
      setError('Failed to load your pathways. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Call fetchPathways on component mount
  useEffect(() => {
    fetchPathways();
  }, [fetchPathways]);

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

  const handleAddNewPathway = () => {
    navigate('/first-course');
  };

  return (
    <div className="my-pathways-page">
      <NavBar />
      <div className="pathways-container">
    
        
        {loading ? (
          <p>Loading your pathways...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : pathways.length === 0 ? (
          <div className="no-pathways">
            <p>You haven't created any learning pathways yet.</p>
            <button
              onClick={handleAddNewPathway}
              className="create-pathway-button"
            >
              Create Your First Pathway
            </button>
          </div>
        ) : (
          <>
          <div className="pathways-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {pathways.map((pathway) => (
              <Link 
                to={`/learning-pathway/${pathway.id}`} 
                key={pathway.id} 
                className="pathway-card"
                state={{ pathway }}
                style={{
                  marginLeft: '2rem',
                  marginRight: '2rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 8px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                  {pathway.name || 'Untitled Pathway'}
                </h3>
              </Link>
            ))}
          </div>
          <button 
            onClick={handleAddNewPathway}
            className="add-pathway-button"
            style={{
              fontFamily: 'Inria Serif',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#15472A',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              float: 'right',
              marginTop: '2rem',
              marginRight: '3.7rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
         Add New Course
          </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPathwaysPage;
