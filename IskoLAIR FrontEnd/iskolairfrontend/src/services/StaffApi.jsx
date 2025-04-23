import axios from "axios";

//const API_URL_ADMIN = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/admin"; // Use the environment variable
//const API_URL_STAFF = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/staff"; // Use the environment variable
//const API_URL_AUTH = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/auth"; // Use the environment variable
const API_BASE_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
const API_URL_ADMIN = `${API_BASE_URL}/api/admin`;
const API_URL_STAFF = `${API_BASE_URL}/api/staff`;
const API_URL_AUTH = `${API_BASE_URL}/api/auth`;

const StaffApi = {
    getVisibleStaff: async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.get(`${API_URL_STAFF}/visible`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Visible Staff List:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Fetching Visible Staff:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to fetch visible staff");
        }
    },

    registerStaff: async (staffData) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found in localStorage");
                throw new Error("Unauthorized: No token found");
            }

            console.log("✅ Token being sent for Staff Registration:", token);

            const response = await axios.post(`${API_URL_ADMIN}/register-staff`, staffData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("✅ Staff Registration Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Registering Staff:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Staff registration failed");
        }
    },

    createScholar: async (scholarData) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found in localStorage");
                throw new Error("Unauthorized: No token found");
            }

            console.log("✅ Token being sent for Scholar Registration:", token);
            console.log("✅ Headers:", {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            });

            const response = await axios.post(
                `${API_URL_AUTH}/register-scholar`,
                scholarData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Register Scholar Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Registering Scholar:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to create scholar");
        }
    },

    updateStaff: async (id, updatedStaff) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.put(`${API_URL_STAFF}/${id}`, updatedStaff, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Staff Update Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Updating Staff:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to update staff");
        }
    },

    deleteStaff: async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.delete(`${API_URL_STAFF}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Staff Deletion Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Deleting Staff:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to delete staff");
        }
    },

    getAllStaff: async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found in localStorage");
                throw new Error("Unauthorized: No token found");
            }

            const response = await axios.get(`${API_URL_ADMIN}/staff`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Fetched Staff List:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error Fetching Staff List:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error || "Failed to fetch staff list");
        }
    },
};

export default StaffApi;
