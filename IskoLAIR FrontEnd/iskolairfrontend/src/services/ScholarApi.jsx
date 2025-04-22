import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Base URL for the API

const ScholarApi = {
    
    registerScholar: async (scholarData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/admin/register-scholar`, scholarData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Scholar registration failed");
        }
    },

    loginScholar: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login-scholar`, credentials);
            
            // Store the JWT token and scholarId after successful login
            const token = response.data["jwt-token"];  // Assuming the response contains the token
            const scholarId = response.data["scholarId"];  // Assuming scholarId is in the response
    
            // Store both token and scholarId in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("scholarId", scholarId);
    
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Scholar login failed");
        }
    },
    

    getScholarDetails: async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Unauthorized: No token found");
            }
    
            const response = await axios.get(`${API_URL}/scholars/info`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Unauthorized: No token found or token expired");
            }
            throw new Error("Failed to fetch scholar details");
        }
    },
    
    

    getAllScholars: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/admin/scholars`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("✅ Fetched Scholars List:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Fetching Scholars List:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to fetch scholars list");
        }
    },

    updateScholar: async (id, updatedScholar) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${API_URL}/scholars/${id}`, updatedScholar, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to update scholar");
        }
    },

        // ✅ Archive scholar (formerly delete)
        archiveScholar: async (id) => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(`${API_URL}/scholars/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || "Failed to archive scholar");
            }
        },
    
        // ✅ Reactivate archived scholar
        reactivateScholar: async (id) => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.put(`${API_URL}/scholars/reactivate/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || "Failed to reactivate scholar");
            }
        },

    getAssignmentsForScholar: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/assignments/scholar`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Unauthorized: No token found or token expired");
            }
            throw new Error("Failed to fetch assignments for scholar");
        }
    },
    uploadProfilePicture: async (id, file) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`${API_URL}/scholars/${id}/upload-profile-picture`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Profile Picture Upload Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Uploading Profile Picture:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to upload profile picture");
        }
    },
    getProfilePicture: async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.get(`${API_URL}/scholars/${id}/profile-picture`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Fetched Profile Picture URL:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Fetching Profile Picture:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to fetch profile picture");
        }
    },
};

export default ScholarApi;