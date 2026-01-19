import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import ProgressBar from '../Components/ProgressBar';
import LessonItem from '../Components/LessonItem';
import api from '../api';
import './LearningPathwayPage.css';

const LearningPathwayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [pathway, setPathway] = useState(location.state?.pathway);
  const [progressData, setProgressData] = useState(null);
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
    const fetchPathwayAndProgress = async () => {
      if (!pathwayId) {
        setError('Invalid pathway ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch pathway if not passed via location state
        if (!pathway) {
          const pathwayResponse = await api.get(`/areas/${pathwayId}/`);
          setPathway(pathwayResponse.data);
        }

        // Fetch progress data (includes modules and lessons with completion status)
        const progressResponse = await api.get(`/areas/${pathwayId}/progress/`);
        setProgressData(progressResponse.data);

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

    fetchPathwayAndProgress();
  }, [pathwayId, pathway, navigate, location.pathname]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="learning-pathway-container">
          <div className="loading-message">Loading pathway...</div>
        </div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div>
        <NavBar />
        <div className="learning-pathway-container">
          <div className="error-container">
            <h1>Pathway Not Found</h1>
            <p>We couldn't find the learning pathway you're looking for.</p>
            <button
              onClick={() => navigate('/my-pathways')}
              className="back-button"
            >
              Back to My Pathways
            </button>
          </div>
        </div>
      </div>
    );
  }

  const modules = progressData?.modules || [];

  return (
    <div>
      <NavBar />
      <div className="learning-pathway-container">
        <div className="pathway-header">
          <h1>{pathway.name || 'Learning Pathway'}</h1>

          {progressData && (
            <div className="pathway-progress">
              <ProgressBar
                percentage={progressData.percentage}
                completedCount={progressData.completed_lessons}
                totalCount={progressData.total_lessons}
                size="large"
              />
            </div>
          )}
        </div>

        <div className="modules-container">
          {modules.length > 0 ? (
            modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <h3>{module.name}</h3>
                  <div className="module-progress">
                    <ProgressBar
                      percentage={module.percentage}
                      completedCount={module.completed_count}
                      totalCount={module.total_count}
                      size="small"
                    />
                  </div>
                </div>

                <div className="lessons-list">
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        area={pathway}
                        module={module}
                        isCompleted={lesson.completed}
                      />
                    ))
                  ) : (
                    <div className="no-lessons">
                      No lessons available for this module yet.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-modules">
              No modules available for this pathway yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathwayPage;
