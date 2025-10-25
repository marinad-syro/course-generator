import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupComponent from '../Components/SignupComponent';
import NavBar from '../Components/NavBar';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate('/'); // Navigate to home page after successful sign-up
  };

  return (
    <div className="signup-page">
      <NavBar />
      <div className="signup-container">
        <SignupComponent 
          onSignupSuccess={handleSignupSuccess} 
          onSwitchToSignin={() => navigate('/signin')}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
