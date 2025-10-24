import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
        const response = await api.post('/api/generate-lesson-content/', { 
          area: area,
          module: module,
          topic: lesson 
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
      <div>
        <NavBar />
        <div className="lesson-container">
          <h1>No lesson data found.</h1>
          <p>Please navigate from a learning pathway.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="lesson-container">
        <h1>{lesson}</h1>
        {loading && <p>Generating your lesson...</p>}
        {error && <p className="error-message">{error}</p>}
        {content && <div className="lesson-content" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default LessonPage;
