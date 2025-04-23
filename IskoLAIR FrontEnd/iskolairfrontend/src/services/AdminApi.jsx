import axios from "axios";

// Correct usage of environment variable with the correct prefix
//const API_URL = process.env.REACT_APP_ISKOLAIR_API_URL || "http://localhost:8080/api/auth";
const API_BASE_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
const API_URL = `${API_BASE_URL}/api/auth`;

const handleApiCall = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "An error occurred");
    }
};

const AdminApi = {
    registerAdmin: (adminData) => handleApiCall("register-admin", adminData),
    loginAdmin: (credentials) => handleApiCall("login-admin", credentials),
    getAdminDetails: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/admin/info`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch admin details");
        }
    },
};

export default AdminApi;
