import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FirstCoursePage from "./pages/FirstCoursePage";
import LearningPathwayPage from "./pages/LearningPathwayPage";
import LessonPage from "./pages/LessonPage";
import SignInPage from "./pages/SignInPage";
import MyPathwaysPage from "./pages/MyPathwaysPage";
import SignUpPage from "./pages/SignUpPage";


function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
                <Route path="/first-course" element={<FirstCoursePage />} />
                <Route path="/learning-pathway" element={<LearningPathwayPage />} />
        <Route path="/lesson" element={<LessonPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/my-pathways" element={<MyPathwaysPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App
