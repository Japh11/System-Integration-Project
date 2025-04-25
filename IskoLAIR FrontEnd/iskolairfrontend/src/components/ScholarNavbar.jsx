import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ScholarNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="Navigationbar">
      <button className={location.pathname === "/scholar/dashboard" ? "active" : ""} onClick={() => navigate("/scholar/dashboard")}>Home</button>
      <button className={location.pathname === "/scholar/announcements" ? "active" : ""} onClick={() => navigate("/scholar/announcements")}>Announcements</button>
      <button className={location.pathname === "/scholar/assignments" ? "active" : ""} onClick={() => navigate("/scholar/assignments")}>Assignments</button>
      <button className={location.pathname === "/scholar/resources" ? "active" : ""} onClick={() => navigate("/scholar/resources")}>Resources</button>
      <button className={location.pathname === "/scholar/aboutus" ? "active" : ""} onClick={() => navigate("/scholar/aboutus")}>About Us</button>
      <button className={location.pathname === "/scholar/messages" ? "active" : ""} onClick={() => navigate("/Smessages")}>Chat</button>
      <button className={location.pathname === "/scholar/FAQ" ? "active" : ""} onClick={() => navigate("/FAQ")}>Usual Inquires</button>
    </div>
  );
};

export default ScholarNavbar;
