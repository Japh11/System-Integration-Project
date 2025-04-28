import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/IskoLAIR_Logo.png";
import AnnouncementApi from "../services/AnnouncementApi";
import AnnouncementFormModal from './AnnouncementForm';
import "../pages/css/Announcement.css";
import profileImg from '../assets/temp-profile.jpg';

import StaffHeader from '../components/StaffHeader';
import StaffNavbar from '../components/StaffNavbar';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // Store the id of the announcement to edit
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState(null);

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

  const handleDeleteAnnouncement = async (id) => {
    try {
      await AnnouncementApi.deleteAnnouncement(id);
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    } catch (err) {
      setError("Failed to delete announcement");
    }
  };

  const [activeDropdownId, setActiveDropdownId] = useState(null);

  return (
    <div className="announcement-page">
      <StaffHeader />
        <div className="staff-dashboard">
          <StaffNavbar />

        <div className="announcement-content">
          <div className="CreateAnnouncement-A" onClick={() => { setEditId(null); setShowModal(true); }}>
            <div className="create-post-container">
              <img src={profileImg} alt="Profile" className="create-post-profile" />
            <div className="create-post-textbox">Create Announcement</div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="announcement-scrollable">
            <ul>
              {announcements.map((announcement) => (
                <li key={announcement.id} className="announcement-page-box">
                <div className="announcement-header">
                  <img src={profileImg} alt="Profile" className="announcement-profile" />
                  <div className="announcement-header-text">
                    <h3 className="announcement-author">IskoLAIR</h3>
                    <p className="announcement-date">{new Date(announcement.createdDate).toLocaleString()}</p>
                  </div>
                  <div className="announcement-more">
                    <button
                      className="more-button"
                      onClick={() =>
                        setActiveDropdownId((prevId) =>
                          prevId === announcement.id ? null : announcement.id
                        )
                      }
                    >
                      <MoreVertIcon sx={{ color: '#334f7d' }} />
                    </button>

                    {activeDropdownId === announcement.id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setEditId(announcement.id);
                            setShowModal(true);
                            setActiveDropdownId(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item delete-item"
                          onClick={() => {
                            handleDeleteAnnouncement(announcement.id);
                            setActiveDropdownId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              
                <div className="announcement-text">
                  <h2 className="announcement-title">{announcement.title}</h2>
                  <p>{announcement.description}</p>
                </div>
              
                {announcement.photos && announcement.photos.length > 0 && (
                  <div className="announcement-photos">
                  {announcement.photos.map((url, index) => (
                    <img
                      key={index}
                      src={url.startsWith("data:") || url.startsWith("http") ? url : `data:image/jpeg;base64,${url}`}
                      alt={`Photo ${index + 1}`}
                      className="announcement-image"
                      onClick={() => setLightboxImage(url.startsWith("data:") || url.startsWith("http") ? url : `data:image/jpeg;base64,${url}`)}
                    />
                  ))}
                  {lightboxImage && (
                    <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
                      <img src={lightboxImage} alt="Enlarged" className="lightbox-image" />
                    </div>
                  )}
                </div>
                )}
              
                <hr className="announcement-divider" />
              
                {/*<div className="announcement-actions">
                  <ThumbUpIcon className="icon" sx={{ color: '#334f7d' }} />
                  <ChatBubbleOutlineIcon className="icon" sx={{ color: '#334f7d' }} />

                </div>*/}
              </li>
              
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
      <AnnouncementFormModal
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchAnnouncements(); // 🔄 refresh announcements
        }}
        id={editId}
      />
    )}
    </div>
  );
};

export default Announcement;
