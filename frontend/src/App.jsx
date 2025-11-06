import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import HomePage from "./pages/HomePage";
import FirstCoursePage from "./pages/FirstCoursePage";
import LearningPathwayPage from "./pages/LearningPathwayPage";
import LessonPage from "./pages/LessonPage";
import SignInPage from "./pages/SignInPage";
import MyPathwaysPage from "./pages/MyPathwaysPage";
import SignUpPage from "./pages/SignUpPage";
import NavBar from "./Components/NavBar";

// Protected route component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on initial load and on location change
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const isAuth = !!token;
      if (isAuth !== isAuthenticated) {
        setIsAuthenticated(isAuth);
      }
    };

    // Initial check
    checkAuth();

    // Set up storage event listener to detect changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <>
      <NavBar 
        isAuthenticated={isAuthenticated} 
        onSignOut={handleSignOut} 
      />
      <main>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/first-course" element={<FirstCoursePage />} />
        <Route 
          path="/learning-pathway" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LearningPathwayPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/learning-pathway/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LearningPathwayPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route 
          path="/signin" 
          element={
              <SignInPage onSignIn={() => setIsAuthenticated(true)} />
          } 
        />
        <Route 
          path="/my-pathways" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MyPathwaysPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/signup"
          element={<SignUpPage onSignIn={() => setIsAuthenticated(true)} />}
        />
        </Routes>
      </main>
    </>
  );
}

export default App;
