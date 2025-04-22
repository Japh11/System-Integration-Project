import axios from "axios";

const API_URL = "http://localhost:8080/api/submissions";

export const submitAssignment = async (assignmentId, scholarId, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("files", file); // match backend's @RequestParam("files")
  });

  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/submit/${assignmentId}/${scholarId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Fetch all submissions
export const getAllSubmissions = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const getSubmissionsByScholar = async (scholarId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized: No token found. Please log in.");
  }

  const response = await axios.get(`${API_URL}/scholar/${scholarId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getSubmissionsByAssignment = async (assignmentId) => {
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  if (!token) {
    throw new Error("Unauthorized: No token found. Please log in.");
  }

  const response = await axios.get(`${API_URL}/assignment/${assignmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  return response.data;
};


// Verify a submission
export const verifySubmission = async (submissionId) => {
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  if (!token) {
    throw new Error("Unauthorized: No token found. Please log in.");
  }

  const response = await axios.patch(`${API_URL}/verify/${submissionId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  return response.data;
};

export const undoSubmission = async (submissionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");

  const response = await axios.patch(
    `http://localhost:8080/api/submissions/undo/${submissionId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
