import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import SignupComponent from '../Components/SignupComponent';
import './LearningPathwayPage.css';

const LearningPathwayPage = () => {
    const location = useLocation();
  const { pathway } = location.state || {};
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsSignedUp(true);
    }
  }, []);

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
  };

  if (!pathway) {
    return (
      <div>
        <NavBar />
        <div className="learning-pathway-container">
          <h1>No learning pathway found.</h1>
          <p>Please go back and create a course first.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className={`learning-pathway-container ${!isSignedUp ? 'blurred' : ''}`}>
        <div className="pathway-container">
            <h1 className="pathway-title">{pathway.title}</h1>
        </div>
        <div className="pathway-results">
          {pathway.modules.map((module, index) => (
            <div key={index} className="module">
              <h3 className="module-title">{module.title}</h3>
              <ul>
                {module.lessons.map((lesson, i) => (
                                    <li key={i} className="lesson-title">
                    <Link to="/lesson" state={{ area: pathway.title, module: module.title, lesson: lesson.title }}>
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {!isSignedUp && <SignupComponent onSignupSuccess={handleSignupSuccess} />}
    </div>
  );
};

export default LearningPathwayPage;
