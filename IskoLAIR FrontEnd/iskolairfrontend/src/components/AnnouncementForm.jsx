import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnnouncementApi from "../services/AnnouncementApi";
 
const AnnouncementForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
 
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]); // New files to upload
    const [filePreviews, setFilePreviews] = useState([]); // Previews for new files
    const [photoUrls, setPhotoUrls] = useState([]); // Existing photo URLs
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        const loadData = async () => {
            if (isEdit) {
                console.log(`🔍 Fetching data for announcement ID: ${id}`); // Log the ID being fetched
                try {
                    const announcement = await AnnouncementApi.getAnnouncementById(id);
                    if (announcement) {
                        console.log("✅ Announcement fetched successfully:", announcement); // Log the fetched data
   
                        // Extract only the necessary fields
                        const { title, description, photos } = announcement;
                        setTitle(title || "");
                        setDescription(description || "");
                        setPhotoUrls(photos || []); // Set existing photo URLs
                    } else {
                        console.error("❌ Announcement not found");
                    }
                } catch (error) {
                    console.error("❌ Failed to load announcement:", error);
                }
            } else {
                console.log("🆕 Creating a new announcement (no ID provided)");
            }
            setIsLoading(false);
        };
   
        loadData();
    }, [id, isEdit]);
 
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        console.log("Selected files:", selectedFiles); // Log the selected files
   
        // Append new files to the existing ones
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
   
        // Generate previews for the new files and append them to the existing previews
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    };
 
    const handleRemovePhoto = (url) => {
        setPhotoUrls(photoUrls.filter((photo) => photo !== url)); // Remove photo URL
    };
 
    const handleRemovePreview = (index) => {
        const updatedFiles = [...files];
        const updatedPreviews = [...filePreviews];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setFiles(updatedFiles);
        setFilePreviews(updatedPreviews);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
 
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
 
        // Append new files
        files.forEach((file) => {
            formData.append("photos", file);
        });
 
        // Append existing photo URLs
        photoUrls.forEach((url) => {
            formData.append("existingPhotos", url); // Backend should handle this
        });
 
        try {
            if (isEdit) {
                await AnnouncementApi.updateAnnouncement(id, title, description, files, photoUrls);
                alert("Announcement updated!");
            } else {
                await AnnouncementApi.createAnnouncement(title, description, files);
                alert("Announcement created!");
            }
            navigate("/staff/dashboard");
        } catch (error) {
            alert("Something went wrong. Check console.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
 
    if (isLoading) return <p>Loading...</p>;
 
    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEdit ? "Edit Announcement" : "Create Announcement"}</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            {/* Display existing photos */}
            {photoUrls.length > 0 && (
                <div>
                    <h4>Existing Photos</h4>
                    <ul>
                        {photoUrls.map((url, index) => (
                            <li key={index}>
                                <img src={url} alt={`Photo ${index + 1}`} style={{ width: "100px" }} />
                                <button type="button" onClick={() => handleRemovePhoto(url)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Display previews for new photos */}
            {filePreviews.length > 0 && (
                <div>
                    <h4>New Photo Previews</h4>
                    <ul>
                        {filePreviews.map((preview, index) => (
                            <li key={index}>
                                <img src={preview} alt={`Preview ${index + 1}`} style={{ width: "100px" }} />
                                <button type="button" onClick={() => handleRemovePreview(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* File input for new photos */}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
        </form>
    );
};
 
export default AnnouncementForm;
 