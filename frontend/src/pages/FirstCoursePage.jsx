import { useState } from "react";
import NavBar from "../Components/NavBar";
import "./FirstCoursePage.css";
import api from "../api";

function FirstCoursePage() {
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
      setPathway(response.data);
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

        {pathway && (
          <div className="pathway-results">
            <h2>{pathway.title}</h2>
            {pathway.modules.map((module, index) => (
              <div key={index} className="module">
                <h3>{module.title}</h3>
                <ul>
                  {module.lessons.map((lesson, i) => (
                    <li key={i}>{lesson.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="course-footer">
        <h2>Sopheo</h2>
        <p>Contact:</p>
        <p>Icons by icons8.com</p>
      </footer>
    </div>
  );
}

export default FirstCoursePage;


  