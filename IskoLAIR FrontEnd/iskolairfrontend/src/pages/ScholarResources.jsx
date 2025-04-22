import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResourcesApi from "../services/ResourcesApi";
import logo from "../assets/IskoLAIR_Logo.png";
import "../pages/css/ScholarResources.css"; // 👈 specific styles for resources
import GetAppIcon from '@mui/icons-material/GetApp';

import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";

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
      <ScholarHeader />
        <div className="chat-body">
          <ScholarNavbar />

        {/* --- Content Area --- */}
        <div className="scholar-dashboard-content">
          <div className="scholar-first-half">
            <h2>Resources</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="resources-scrollable">
            <ul>
            {resources.map(r => (
              <div className="resource-card">
              <h3 className="resources-author">IskoLAIR</h3>
              <h2 className="resource-title">{r.title}</h2>
            
              <div className="resource-file-wrapper">
                {r.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={r.fileUrl}
                    alt={r.title}
                    className="resource-image"
                  />
                ) : (
                  <div className="resource-icon">📄</div>
                )}
            
                <div className="resource-filename">
                  {decodeURIComponent(r.fileUrl.split("/").pop())}
                </div>
            
                <div className="resource-download">
                  <a href={r.fileUrl} download target="_blank" rel="noopener noreferrer" title="Download file">
                    <GetAppIcon sx={{ fontSize: 28, color: "#334f7d" }} />
                  </a>
                </div>
              </div>
            </div>
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
