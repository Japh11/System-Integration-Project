import axios from "axios";

// Use the environment variable for the API URL
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
            new URLSearchParams({ token, newPassword }), // Form data
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } } // Correct headers
        );
        return response.data;
    }
};

export default ScholarChangePasswordApi;
