import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FirstCoursePage from "./pages/FirstCoursePage";


function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/first-course" element={<FirstCoursePage />} />
      </Routes>
    </>
  );
}

export default App
