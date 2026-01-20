import { useState } from "react";
import { createFeedback } from "../api";
import NavBar from "../Components/NavBar";
import "./FeedbackPage.css";

function FeedbackPage() {
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
    <div className="feedback-page">
      <NavBar />
      <div className="feedback-content">
        <section className="feedback-section">
          <h2 className="feedback-heading">Leave your feedback!</h2>
          <p className="feedback-intro">
            Your input is highly appreciated!<br />
            Leave feedback and recommendations to improve my project.
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
      </div>
      <footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-logo">Sopheo</div>
        <div className="footer-contact">Contact: sopheo.contact@gmail.com</div>
      </footer>
    </div>
  );
}

export default FeedbackPage;
