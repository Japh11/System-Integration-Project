import axios from "axios";

//const SCHOLAR_API_URL = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/scholar";
const API_BASE_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
const SCHOLAR_API_URL = `${API_BASE_URL}/api/scholar`;

const ScholarChangePasswordApi = {
    requestPasswordReset: async (email) => {
        const response = await axios.post(`${SCHOLAR_API_URL}/reset-password?email=${email}`);
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await axios.post(
            `${SCHOLAR_API_URL}/save-password`,
            new URLSearchParams({ token, newPassword }), // ✅ Use URLSearchParams for form data
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } } // ✅ Correct headers
        );
        return response.data;
    }
};

export default ScholarChangePasswordApi;
