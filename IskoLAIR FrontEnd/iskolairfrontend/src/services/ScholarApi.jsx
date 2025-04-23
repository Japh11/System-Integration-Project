import axios from "axios";

//const API_URL = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api"; // Use the environment variable
const API_BASE_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
const API_URL = `${API_BASE_URL}/api`;

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

    deleteScholar: async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${API_URL}/scholars/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to delete scholar");
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
};

export default ScholarApi;