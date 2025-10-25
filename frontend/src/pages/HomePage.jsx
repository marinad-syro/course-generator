import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createFeedback } from "../api";
import "./HomePage.css";
import NavBar from "../Components/NavBar";

function HomePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setSubmitStatus({ success: false, message: "Please enter your feedback" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    try {
      await createFeedback({ message: `${title}: ${feedback}` });
      setTitle("");
      setFeedback("");
      setSubmitStatus({ success: true, message: "Thank you for your feedback!" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.detail || "Failed to submit feedback. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Decorative Background Elements */}
      <div className="bg-ellipse bg-ellipse-1"></div>
      <div className="bg-ellipse bg-ellipse-2"></div>
      <div className="bg-ellipse bg-ellipse-3"></div>
      <div className="bg-ellipse bg-ellipse-4"></div>

      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <div className="hero-container">
        <section className="hero">
          <h1 className="hero-title">Curiosity, made easy</h1>
          <p className="hero-description">
            No more drowning in random websites.
            <br />
            Just name a topic and <span className="hero-highlight">learn with structure</span>.
          </p>
        </section>

        {/* Start Now Button */}
        <button className="cta-button" onClick={() => navigate("/first-course")}>
          Start Now
        </button>
      </div>

      {/* Feedback Section */}
      <section className="feedback-section">
        <h2 className="feedback-heading">Leave your feedback!</h2>
        <p className="feedback-intro">
          Your input is highly appreciated!<br />
          Leave feedback and recommendations to improve my initial product.
        </p>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-card">
            <div className="form-fields">
              <textarea
                className="feedback-textarea"
                placeholder="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
          {submitStatus.message && (
            <p className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </p>
          )}
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-logo">Sopheo</div>
        <div className="footer-contact">Contact: sopheo.contact@gmail.com</div>
      </footer>
    </div>
  );
}

export default HomePage;
