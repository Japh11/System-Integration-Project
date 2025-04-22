import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./css/LandingPage.css";
import logo from "../assets/IskoLAIR_Logo.png"; 
import background from "../assets/background-image.png"; // Import background image

const LandingPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  return (
    <>
      {/* Header */}
      <div className="landingpage-header">
        <img src={logo} alt="Logo" className="landingpage-logo" /> 
        <div className="landingpage-header-rightside">
          <h5>Official DOST</h5>
          <button 
            className="landingpage-signin-button"
            onClick={() => navigate("/scholar/login")} // ✅ Redirect to Scholar Login
          >
            Sign in
          </button>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${background})` }}>
        <div className="hero-overlay"></div> {/* Gradient Overlay */}
        <div className="hero-content">
          <img src={logo} alt="Logo" className="hero-logo" />
          <h2 className="hero-title">[Catchy Title]</h2>
          <p className="hero-subtitle">
            <strong>[Subtitle]</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Maecenas ultrices ipsum nulla.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h2 className="about-title">About IskoLAIR</h2>
        <p className="about-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices ipsum nulla. 
          Etiam in velit est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
          Proin commodo dolor purus. Donec finibus sit amet mi a mollis. 
          Mauris ultrices ligula massa, in aliquam nisl cursus in.
        </p>
      </div>
    </>
  );
};

export default LandingPage;
