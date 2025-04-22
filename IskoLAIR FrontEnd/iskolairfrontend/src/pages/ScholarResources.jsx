import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResourcesApi from "../services/ResourcesApi";
import logo from "../assets/IskoLAIR_Logo.png";
import "../pages/css/ScholarDashboard.css"; // 👈 reuse the dashboard layout
import "../pages/css/Resources.css";

const ScholarResources = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    ResourcesApi.getAllResources()
      .then(data => setResources(data))
      .catch(() => setError("Failed to load resources"));
  }, []);

  return (
    <div>
      {/* --- Header --- */}
      <div className="scholar-header">
        <img src={logo} alt="IskoLAIR Logo" className="logo" />
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          style={{ width: 40, height: 40, cursor: "pointer" }}
          onClick={() => navigate("/scholar/profile")}
        />
      </div>

      <div className="scholar-dashboard">
        {/* --- Sidebar Nav --- */}
        <div className="scholar-navigationbar">
          <button onClick={() => navigate("/scholar/dashboard")}>Home</button>
          <button onClick={() => navigate("/scholar/announcements")}>Announcements</button>
          <button onClick={() => navigate("/scholar/assignments")}>Assignments</button>
          <button onClick={() => navigate("/scholar/resources")}>Resources</button>
          <button onClick={() => navigate("/scholar/aboutus")}>About Us</button>
          <button onClick={() => navigate("/Smessages")}>Chat</button>
        </div>

        {/* --- Content Area --- */}
        <div className="scholar-dashboard-content">
          <div className="scholar-first-half">
            <h2>Resources</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="resources-scrollable">
              <ul>
                {resources.map(r => (
                  <li key={r.id} className="resources-page-box">
                    <h3>{r.title}</h3>
                    <div>
                      {r.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={r.fileUrl}
                          alt={r.title}
                          style={{ width: "200px", height: "auto" }}
                        />
                      ) : (
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download File
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarResources;
