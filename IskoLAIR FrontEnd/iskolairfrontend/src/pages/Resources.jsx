import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/IskoLAIR_Logo.png";
import ResourcesApi from "../services/ResourcesApi";
import ResourcesForm from '../components/ResourcesForm';
import "../pages/css/Resources.css";
import profileImg from '../assets/temp-profile.jpg';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import GetAppIcon from '@mui/icons-material/GetApp';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation()

  const API_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
  const FILE_URL = API_URL.replace("/api", ""); // remove /api for file loading

  const load = () => {
    ResourcesApi.getAllResources()
      .then(r => setResources(r))
      .catch(() => setError("Failed to load resources"));
  };

  useEffect(load, []);

  const handleDelete = id => {
    ResourcesApi.deleteResource(id)
      .then(() => setResources(resources.filter(r => r.id !== id)))
      .catch(() => setError("Failed to delete resource"));
  };

  const handleSaved = () => {
    setEditId(null);
    load();
  };

  return (
    <div className="resources-page">
      <div className="staff-header">
        <img src={logo} alt="Logo" className="logo" />
        <img src={profileImg} alt="Profile" className="profile-icon"
             onClick={() => navigate("/staff/profile")} />
      </div>

      <div className="resources-container">
        <div className="Navigationbar">
          <button
            className={location.pathname === "/staff/dashboard" ? "active" : ""}
            onClick={() => navigate("/staff/dashboard")}
          >
            Home
          </button>
          <button
            className={location.pathname === "/announcements" ? "active" : ""}
            onClick={() => navigate("/announcements")}
          >
            Announcements
          </button>
          <button
            className={location.pathname === "/assignments" ? "active" : ""}
            onClick={() => navigate("/assignments")}
          >
            Assignments
          </button>
          <button
            className={location.pathname === "/messages" ? "active" : ""}
            onClick={() => navigate("/messages")}
          >
            Messages
          </button>
          <button
            className={location.pathname === "/resources" ? "active" : ""}
            onClick={() => navigate("/resources")}
          >
            Resources
          </button>
        </div>

        <div className="resources-content">
          <ResourcesForm
            key={editId || 'new'}
            id={editId}
            onCancel={() => setEditId(null)}
            onSaved={handleSaved}
          />

          {error && <p className="error-message">{error}</p>}

          <div className="resources-scrollable">
            <ul>
              {resources.map(r => {
                const filename = r.fileUrl.trim().split("\\").pop();
                const resourceUrl = `${FILE_URL}/uploads/${filename}`;

                return (
                  <li key={r.id} className="resources-page-box">
                    <div className="resources-header">
                      <img src={profileImg} alt="" className="resources-profile" />
                      <div className="resources-header-text">
                        <h3 className="resources-author">IskoLAIR</h3>
                      </div>
                      <div className="resources-more">
                        <button className="more-button"
                          onClick={() => setActiveDropdownId(prev => prev === r.id ? null : r.id)}
                        >
                          <MoreVertIcon sx={{ color: '#334f7d' }} />
                        </button>
                        {activeDropdownId === r.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item"
                              onClick={() => { setEditId(r.id); setError(""); }}
                            >
                              Edit
                            </button>
                            <button className="dropdown-item delete-item"
                              onClick={() => handleDelete(r.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="resources-text">
                      <h2 className="resource-title">{r.title}</h2>
                    </div>
                    <div className="resources-file">
                      {r.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)
                        ? <img src={resourceUrl} alt={r.title} className="resource-image" />
                        : <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                            <GetAppIcon /> Download
                          </a>
                      }
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;