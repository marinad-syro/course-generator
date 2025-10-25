import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import "./FirstCoursePage.css";
import api from "../api";

function FirstCoursePage() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [pathway, setPathway] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateCourse = async () => {
    if (!area.trim()) {
      setError("Please enter an area to explore.");
      return;
    }

    setLoading(true);
    setError(null);
    setPathway(null);

    try {
      const response = await api.post("/generate-pathway-json/", { area });
      navigate('/learning-pathway', { state: { pathway: response.data } });
    } catch (err) {
      setError(err.message || "Failed to generate course pathway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="first-course-page">
      <NavBar />

      {/* Background Ellipses */}
      <div className="bg-ellipse bg-ellipse-1"></div>
      <div className="bg-ellipse bg-ellipse-2"></div>

      <div className="content-container">
        <div className="explore-box">
          <h1>What area would you like to explore?</h1>
          <input 
            type="text" 
            className="explore-input" 
            placeholder="eg. The Roman Empire" 
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={loading}
          />
          <button 
            className="create-course-button" 
            onClick={handleCreateCourse} 
            disabled={loading}
          >
            {loading ? "Generating..." : "Create Course"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

      </div>

      <footer className="course-footer">
        <h2>Sopheo</h2>
        <p>Contact: sopheo.contact@gmail.com</p>
      </footer>
    </div>
  );
}

export default FirstCoursePage;


  