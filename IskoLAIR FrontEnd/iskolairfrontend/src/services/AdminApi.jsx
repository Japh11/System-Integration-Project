import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

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
