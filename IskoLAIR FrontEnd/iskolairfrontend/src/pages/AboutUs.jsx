import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/IskoLAIR_Logo.png";
import "../pages/css/ScholarDashboard.css";
import "../pages/css/AboutUs.css";
import ScholarNavbar from "../components/ScholarNavbar"; // Import the ScholarNavbar component

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* --- Header --- */}
      <div className="scholar-header">
        <img src={logo} alt="IskoLAIR Logo" className="logo" />
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
          onClick={() => navigate("/scholar/profile")}
        />
      </div>

      {/* --- Main Container --- */}
      <div className="announcement-container">
        {/* --- Sidebar Navigation --- */}
        <ScholarNavbar /> {/* Use the ScholarNavbar component here */}

        {/* --- Content --- */}
        <div className="about-us-content">
          <h1>About Us</h1>
          <p>Welcome to IskoLAIR! This platform is designed to help scholars manage their academic journey efficiently.</p>
          <p>Our mission is to provide a seamless experience for scholars, staff, and administrators.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;