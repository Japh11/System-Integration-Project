import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffApi from "../services/StaffApi";
import logo from "../assets/IskoLAIR_Logo.png";
import profilePlaceholder from "../assets/profiletemp.jpg"; // Placeholder image

const StaffHeader = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(profilePlaceholder); // Default to placeholder

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        if (!staffId) throw new Error("No staff ID found");

        const response = await StaffApi.getProfilePicture(staffId);
        setProfilePicture(response.profilePicture || profilePlaceholder); // Use fetched picture or placeholder
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div className="staff-header">
      <img src={logo} alt="IskoLAIR Logo" className="logo" />
      <img
        src={profilePicture}
        alt="Profile"
        style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
        onClick={() => navigate("/staff/profile")}
      />
    </div>
  );
};

export default StaffHeader;