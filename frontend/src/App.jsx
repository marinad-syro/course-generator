import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import HomePage from "./pages/HomePage";
import FirstCoursePage from "./pages/FirstCoursePage";
import LearningPathwayPage from "./pages/LearningPathwayPage";
import LessonPage from "./pages/LessonPage";
import SignInPage from "./pages/SignInPage";
import MyPathwaysPage from "./pages/MyPathwaysPage";
import SignUpPage from "./pages/SignUpPage";
import NavBar from "./Components/NavBar";

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  // Update auth state when location changes (e.g., after login/out)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, [location]);

  return (
    <>
      {showNavbar && <NavBar isAuthenticated={isAuthenticated} onSignOut={() => setIsAuthenticated(false)} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/first-course" element={<FirstCoursePage />} />
        <Route path="/learning-pathway" element={<LearningPathwayPage />} />
        <Route path="/lesson" element={<LessonPage />} />
        <Route path="/signin" element={<SignInPage onSignIn={() => setIsAuthenticated(true)} />} />
        <Route path="/my-pathways" element={<MyPathwaysPage />} />
        <Route path="/signup" element={<SignUpPage onSignUp={() => setIsAuthenticated(true)} />} />
      </Routes>
    </>
  );
}

export default App
