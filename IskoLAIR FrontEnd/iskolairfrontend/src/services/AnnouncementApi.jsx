import axios from "axios";

const API_URL = "http://localhost:8080/api/announcements"; // Adjust based on your backend mapping

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Unauthorized: No token found");
    }
    return { Authorization: `Bearer ${token}` };
};

const handleRequestError = (error) => {
    console.error("API error:", error);
    throw error.response?.data || "An unexpected error occurred.";
};

const AnnouncementApi = {
    createAnnouncement: async (title, description, photos) => {
        try {
            const staffId = localStorage.getItem("staffId");
            if (!staffId) {
                throw new Error("Missing staff ID");
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("createdByJson", JSON.stringify({ id: staffId }));

            if (photos && photos.length > 0) {
                photos.forEach((photo) => {
                    formData.append("photos", photo);
                });
            }

            const response = await axios.post(`${API_URL}/create`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data", // Important for FormData
                },
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },

    getAllAnnouncements: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },

    getAnnouncementById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },

    updateAnnouncement: async (id, title, description, photos, existingPhotos) => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (existingPhotos && existingPhotos.length > 0) {
                existingPhotos.forEach((photo) => {
                    formData.append("existingPhotos", photo);
                });
            }

            if (photos && photos.length > 0) {
                photos.forEach((photo) => {
                    formData.append("photos", photo);
                });
            }

            const response = await axios.put(`${API_URL}/update/${id}`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data", // Important for FormData
                },
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },
};

export default AnnouncementApi;