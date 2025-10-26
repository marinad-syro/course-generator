import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import api from '../api';
import './LearningPathwayPage.css';

const LearningPathwayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [pathway, setPathway] = useState(location.state?.pathway);
  const [loading, setLoading] = useState(!location.state?.pathway);
  const [error, setError] = useState('');
  const pathwayId = id || window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchPathway = async () => {
      if (!pathway && pathwayId) {
        try {
          setLoading(true);
          const response = await api.get(`/areas/${pathwayId}/`);
          setPathway(response.data);
        } catch (err) {
          console.error('Error fetching pathway:', err);
          setError('Failed to load pathway. Please try again.');
          
          // If unauthorized, redirect to sign-in
          if (err.response?.status === 401) {
            navigate('/signin', { state: { from: location.pathname } });
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPathway();
  }, [pathwayId, pathway, navigate, location.pathname]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="learning-pathway-container">
          <div>Loading pathway...</div>
        </div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div>
        <NavBar />
        <div className="learning-pathway-container" style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1>Pathway Not Found</h1>
          <p>We couldn't find the learning pathway you're looking for.</p>
          <button 
            onClick={() => navigate('/my-pathways')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4a6fa5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Back to My Pathways
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="learning-pathway-container" style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div className="pathway-header" style={{
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <h1 style={{
            fontSize: '2rem',
            margin: '0 0 0.5rem 0',
            color: '#333'
          }}>
            {pathway.area || 'Learning Pathway'}
          </h1>
        </div>

        <div className="modules-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {pathway.modules && pathway.modules.length > 0 ? (
            pathway.modules.map((module, index) => (
              <div key={index} className="module" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  fontSize: '1.4rem'
                }}>
                  Module {index + 1}: {module.title}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {module.lessons && module.lessons.map((lesson, i) => (
                                    <li key={i} className="lesson-title">
                    <Link to="/lesson" state={{ area: pathway.title, module: module.title, lesson: lesson.title }}>
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            ))
          ) : (
            <p>No modules found for this pathway.</p>
          )}

        </div>
      </div>
      {/* Authentication is now handled by the backend */}
    </div>
  );
};

export default LearningPathwayPage;
