import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import api from '../api';
import './LessonPage.css';

const LessonPage = () => {
  const location = useLocation();
  const { area, module, lesson } = location.state || {};
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lesson) return;

    const fetchLessonContent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.post('/generate-lesson-content/', {
          area: area?.name || area,
          module: module?.name || module,
          topic: lesson?.name || lesson
        });
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to load lesson content. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [area, module, lesson]);

  if (!lesson) {
    return (
      <div className="lesson-page">
        <NavBar />
        <div className="lesson-container">
          <div className="lesson-header">
            <h1>No lesson data found</h1>
            <p className="back-link">
              <Link to="/my-pathways">← Back to My Pathways</Link>
            </p>
          </div>
          <div className="lesson-content">
            <p>Please navigate from a learning pathway or select a valid lesson.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <NavBar />
      <div className="lesson-container">
        <div className="lesson-header">
          <h1>{lesson?.name || lesson}</h1>
          <p className="module-info">
            <span className="area">{area?.name || area}</span> • <span className="module">{module?.name || module}</span>
          </p>
          <p className="back-link">
            <Link to="/my-pathways">← Back to My Pathways</Link>
          </p>
        </div>
        
        <div className="lesson-content-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating your lesson content...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div 
              className="lesson-content" 
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
