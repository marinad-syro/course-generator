import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInComponent from '../Components/SignInComponent';
import NavBar from '../Components/NavBar';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();

  const handleSigninSuccess = () => {
    navigate('/'); // Navigate to home page after successful sign-in
  };

  return (
    <div className="signin-page">
      <NavBar />
      <div className="signin-container">
        <SignInComponent 
          onSigninSuccess={handleSigninSuccess} 
          onSwitchToSignup={() => navigate('/signup')} // Optional: navigate to a full signup page if you create one
        />
      </div>
    </div>
  );
};

export default SignInPage;
