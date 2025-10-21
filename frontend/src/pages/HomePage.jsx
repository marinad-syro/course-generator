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
            Learn with a course tailored to your needs.<br />
            No deadlines. No constraints on what you learn.<br />
            Just name a topic and start your journey.
          </p>
        </section>

        {/* Start Now Button */}
        <button className="cta-button" onClick={() => navigate("/first-course")}>
          Start Now
        </button>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">The missing piece in self-learning</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/9ea82b141f17e47db4b1f999bcb1d62735457afa?width=180" 
              alt="Journey" 
              className="feature-icon"
            />
            <h3 className="feature-title">Clear sequence</h3>
            <p className="feature-description">
              With a ready-made, editable learning pathway you can actually focus on learning, not planning
            </p>
          </div>

          <div className="feature-card">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/bfb9536bef1c5c2df01ad92ecee525a0d1e997ca?width=180" 
              alt="Voice And Touch" 
              className="feature-icon"
            />
            <h3 className="feature-title">Interactive interface</h3>
            <p className="feature-description">
              Experience a smooth learning process through an interface designed for your comfort and engagement
            </p>
          </div>

          <div className="feature-card">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/d1b01d254f4c95ae0e0382cddc6d535b70f9f1a5?width=180" 
              alt="Learning" 
              className="feature-icon"
            />
            <h3 className="feature-title">Lasting knowledge</h3>
            <p className="feature-description">
              Our lessons are designed to give you a thorough understanding of the topic, not just basic facts
            </p>
          </div>

          <div className="feature-card">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/7fdcc59f7b2019f9175a82bf331e91c10fd9dd5d?width=180" 
              alt="Positive Dynamic" 
              className="feature-icon"
            />
            <h3 className="feature-title">Progress-tracking</h3>
            <p className="feature-subtitle">(coming soon)</p>
            <p className="feature-description">
              Gain insights about your learning process and achievements with our visual progress-tracking system
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <h2 className="feedback-heading">Help us improve</h2>
        <p className="feedback-intro">
          Your input is highly appreciated!<br />
          Leave feedback and recommendations to improve our initial product.
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
        <div className="footer-contact">Contact:</div>
        <div className="footer-credits">Icons by icons8.com</div>
      </footer>
    </div>
  );
}

export default HomePage;
