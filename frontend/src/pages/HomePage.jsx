import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import NavBar from "../Components/NavBar";

function HomePage() {
  const navigate = useNavigate();

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
        <button className="cta-button" onClick={() => navigate("/signup")}>
          Start Now
        </button>
      </div>
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
