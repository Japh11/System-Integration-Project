import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScholarApi from "../services/ScholarApi";
import logo from "../assets/IskoLAIR_Logo.png";
import profilePlaceholder from "../assets/profiletemp.jpg"; // Placeholder image

const ScholarHeader = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(profilePlaceholder); // Default to placeholder

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const scholarId = localStorage.getItem("scholarId");
        if (!scholarId) throw new Error("No scholar ID found");

        const response = await ScholarApi.getProfilePicture(scholarId);
        setProfilePicture(response.profilePicture || profilePlaceholder); // Use fetched picture or placeholder
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div className="scholar-header">
      <img src={logo} alt="IskoLAIR Logo" className="logo" />
      <img
        src={profilePicture}
        alt="Profile"
        style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
        onClick={() => navigate("/scholar/profile")}
      />
    </div>
  );
};

export default ScholarHeader;