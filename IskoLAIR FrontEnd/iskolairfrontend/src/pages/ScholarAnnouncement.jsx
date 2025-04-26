import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementApi from "../services/AnnouncementApi";
import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";
import "../pages/css/ScholarDashboard.css";
import "../pages/css/Announcement.css";
import profileImg from "../assets/temp-profile.jpg";

const ScholarAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
  const FILE_URL = API_URL.replace("/api", "");

  const fetchAnnouncements = async () => {
    try {
      const data = await AnnouncementApi.getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError("Failed to load announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="announcement-page">
      <ScholarHeader />
      <div className="staff-dashboard">
        <ScholarNavbar />

        <div className="announcement-content">
          <div className="announcement-scrollable">
            <ul>
              {announcements.map((announcement) => (
                <li key={announcement.id} className="announcement-page-box">
                  <div className="announcement-header">
                    <img src={profileImg} alt="Profile" className="announcement-profile" />
                    <div className="announcement-header-text">
                      <h3 className="announcement-author">IskoLAIR</h3>
                      <p className="announcement-date">
                        {new Date(announcement.createdDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="announcement-text">
                    <h2 className="announcement-title">{announcement.title}</h2>
                    <p>{announcement.description}</p>
                  </div>

                  {announcement.photos && announcement.photos.length > 0 && (
                    <div className="announcement-photos">
                      {announcement.photos.map((photo, index) => {
                        const filename = photo.trim().split("\\").pop();
                        const photoUrl = `${FILE_URL}/uploads/${filename}`;

                        return (
                          <img
                            key={index}
                            src={photoUrl}
                            alt={`Photo ${index + 1}`}
                            className="announcement-image"
                            onClick={() => setLightboxImage(photoUrl)}
                          />
                        );
                      })}
                      {lightboxImage && (
                        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
                          <img src={lightboxImage} alt="Enlarged" className="lightbox-image" />
                        </div>
                      )}
                    </div>
                  )}

                  <hr className="announcement-divider" />

                  {/* <div className="announcement-actions">
                    <span className="icon">👍</span>
                    <span className="icon">💬</span>
                  </div> */}
                </li>
              ))}
            </ul>
            {announcements.length === 0 && <p>No announcements found.</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarAnnouncement;
