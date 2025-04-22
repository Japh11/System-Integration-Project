import axios from "axios";

const API_URL = process.env.ISKOLAIR_API_URL || "http://localhost:8080/api/fileresources"; // Default to localhost if not set


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized: No token found");
  }
  return { Authorization: `Bearer ${token}` };
};

const handleRequestError = (error) => {
  console.error("Resources API error:", error);
  throw error.response?.data || "An unexpected error occurred.";
};

const ResourcesApi = {
  createResource: async (title, file) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const response = await axios.post(API_URL, formData, {
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

  getAllResources: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  getResourceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  updateResource: async (id, title, file) => {
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (file) formData.append("file", file);

      const response = await axios.put(`${API_URL}/${id}`, formData, {
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

  deleteResource: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
};

export default ResourcesApi;