import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementApi from "../services/AnnouncementApi";
import "../pages/css/AnnouncementModal.css";

const AnnouncementFormModal = ({ onClose, id }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [newPhotos, setNewPhotos] = useState([]); // New files
    const [existingPhotos, setExistingPhotos] = useState([]); // Existing photo URLs
    const [filePreviews, setFilePreviews] = useState([]); // Previews for new files
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchAnnouncement = async () => {
                try {
                    const announcement = await AnnouncementApi.getAnnouncementById(id);
                    setTitle(announcement.title || "");
                    setDescription(announcement.description || "");
                    setExistingPhotos(announcement.photos || []);
                } catch (err) {
                    setError("Failed to load announcement");
                }
            };
            fetchAnnouncement();
        }
    }, [id]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setNewPhotos((prev) => [...prev, ...files]);
        setFilePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    };

    const handleRemoveExistingPhoto = (index) => {
        setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
    };

    const handleRemoveNewPhoto = (index) => {
        const updatedPhotos = [...newPhotos];
        const updatedPreviews = [...filePreviews];
        updatedPhotos.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setNewPhotos(updatedPhotos);
        setFilePreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await AnnouncementApi.updateAnnouncement(id, title, description, newPhotos, existingPhotos);
            } else {
                await AnnouncementApi.createAnnouncement(title, description, newPhotos);
            }
            onClose();
            navigate("/announcements");
        } catch (err) {
            setError(id ? "Failed to update announcement" : "Failed to create announcement");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{id ? "Update Announcement" : "Create Announcement"}</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className="announcement-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handlePhotoChange}
                    />

                    {/* Existing Photos */}
                    {existingPhotos.length > 0 && (
                        <div className="photo-preview">
                            <h4>Existing Photos</h4>
                            {existingPhotos.map((url, index) => (
                                <div key={index} className="photo-item">
                                    <img src={url} alt={`Existing Photo ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                                    <button type="button" onClick={() => handleRemoveExistingPhoto(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* New Photo Previews */}
                    {filePreviews.length > 0 && (
                        <div className="photo-preview">
                            <h4>New Photo Previews</h4>
                            {filePreviews.map((preview, index) => (
                                <div key={index} className="photo-item">
                                    <img src={preview} alt={`New Photo ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                                    <button type="button" onClick={() => handleRemoveNewPhoto(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit">{id ? "Update" : "Create"}</button>
                </form>
            </div>
        </div>
    );
};

export default AnnouncementFormModal;