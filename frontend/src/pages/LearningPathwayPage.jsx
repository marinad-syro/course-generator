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
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Extract the numeric ID from the URL
  const getPathwayId = () => {
    if (id && !isNaN(parseInt(id))) return parseInt(id);
    const pathParts = window.location.pathname.split('/');
    const potentialId = pathParts[pathParts.length - 1];
    return !isNaN(parseInt(potentialId)) ? parseInt(potentialId) : null;
  };
  
  const pathwayId = getPathwayId();

  useEffect(() => {
    const fetchPathwayAndModules = async () => {
      if (!pathwayId) {
        setError('Invalid pathway ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Only fetch pathway if not passed via location state
        if (!pathway) {
          const pathwayResponse = await api.get(`/areas/${pathwayId}/`);
          setPathway(pathwayResponse.data);
        }

        // Always fetch modules
        const modulesResponse = await api.get(`/areas/${pathwayId}/modules/`);
        setModules(Array.isArray(modulesResponse.data) ? modulesResponse.data : []);
        
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/signin', { state: { from: location.pathname } });
        } else if (err.response?.status === 404) {
          setError('Pathway not found. It may have been deleted or you may not have permission to view it.');
        } else {
          setError('Failed to load pathway data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPathwayAndModules();
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
          margin: '0 auto',
          marginTop: '6rem',
          borderRadius: '10px',
          backgroundColor: '#E4DCE0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <h1>Pathway Not Found</h1>
          <p>We couldn't find the learning pathway you're looking for.</p>
          <button 
            onClick={() => navigate('/my-pathways')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#15472A',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {modules.length > 0 ? (
            modules.map((module) => (
              <div 
                key={module.id} 
                className="module-card"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{module.name}</h3>
                <div className="lessons-list" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        state={{ 
                          area: pathway,
                          module: module,
                          lesson: lesson
                        }}
                        style={{
                          display: 'block',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          color: '#333',
                          transition: 'background-color 0.2s',
                          ':hover': {
                            backgroundColor: '#e9ecef'
                          }
                        }}
                      >
                        {lesson.name}
                      </Link>
                    ))
                  ) : (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      color: '#6c757d',
                      fontStyle: 'italic'
                    }}>
                      No lessons available for this module yet.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#6c757d'
            }}>
              No modules available for this pathway yet.
            </div>
          )}
        </div>
      </div>
      {/* Authentication is now handled by the backend */}
    </div>
  );
};

export default LearningPathwayPage;
