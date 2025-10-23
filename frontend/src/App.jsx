import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FirstCoursePage from "./pages/FirstCoursePage";
import LearningPathwayPage from "./pages/LearningPathwayPage";
import LessonPage from "./pages/LessonPage";


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
      </Routes>
    </>
  );
}

export default App
