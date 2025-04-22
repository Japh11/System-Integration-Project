import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const StaffNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="Navigationbar">
      <button className={location.pathname === "/staff/dashboard" ? "active" : ""} onClick={() => navigate("/staff/dashboard")}>Home</button>
      <button className={location.pathname === "/announcements" ? "active" : ""} onClick={() => navigate("/announcements")}>Announcements</button>
      <button className={location.pathname === "/assignments" ? "active" : ""} onClick={() => navigate("/assignments")}>Assignments</button>
      <button className={location.pathname === "/messages" ? "active" : ""} onClick={() => navigate("/messages")}>Messages</button>
      <button className={location.pathname === "/resources" ? "active" : ""} onClick={() => navigate("/resources")}>Resources</button>
    </div>
  );
};

export default StaffNavbar;
