import axios from "axios";

//const API_URL = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/assignments"; // Use the environment variable
const API_BASE_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
const API_URL = `${API_BASE_URL}/api/assignments`


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Unauthorized: No token found");
    }
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};
const handleRequestError = (error) => {
    console.error(error);
    // re‑throw so callers can catch in UI
    throw error;
  };



const AssignmentApi = {
    createAssignment: async (assignmentData) => {
        try {
            const staffId = localStorage.getItem("staffId");
            if (!staffId) {
                throw new Error("Missing staff ID");
            }

            const assignmentDataWithStaff = { ...assignmentData, staff: { id: staffId } };
            const response = await axios.post(`${API_URL}/create`, assignmentDataWithStaff, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },
    getAllAssignments: async () => {
        try {
            const response = await axios.get(`${API_URL}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    },

    getAssignmentsForScholar: async () => {
        try {
            const response = await axios.get(`${API_URL}/scholar`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    }, 
    deleteAssignment: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            handleRequestError(error);
        }
    }
};

export default AssignmentApi;
