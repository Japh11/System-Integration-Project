import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";
import ScholarApi from "../services/ScholarApi";
import AssignmentApi from "../services/AssignmentApi";
import { getSubmissionsByScholar, undoSubmission } from "../services/SubmissionApi";
import axios from "axios";
import "../pages/css/ScholarDashboard.css";
import "../pages/css/Assignment.css";

const ScholarAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarData();
  }, []);

  const fetchScholarData = async () => {
    try {
      const scholarId = localStorage.getItem("scholarId");
      const [assignmentsData, submissionsData] = await Promise.all([
        AssignmentApi.getAllAssignments(),
        getSubmissionsByScholar(scholarId)
      ]);

      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError("Failed to load assignments or submissions.");
    }
  };

  const getSubmission = (assignmentId) =>
    submissions.find((s) => s.assignment?.id === assignmentId);

  const hasSubmitted = (assignmentId) => {
    const sub = getSubmission(assignmentId);
    return sub && (sub.status === "verified" || sub.status === "unverified");
  };

  const handleFileChange = (e, assignmentId) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: prev[assignmentId]
        ? [...prev[assignmentId], ...newFiles]
        : newFiles,
    }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const files = selectedFiles[assignmentId];
    if (!files || files.length === 0) {
      setMessage("Please select at least one file before submitting.");
      return;
    }

    const scholarId = localStorage.getItem("scholarId");
    const token = localStorage.getItem("token");
    if (!scholarId || !token) {
      setMessage("Unauthorized: Please log in again.");
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/submissions/submit/${assignmentId}/${scholarId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSubmission = response.data;
      setSubmissions((prev) => [...prev, newSubmission]);
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      setMessage("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.status === 401
          ? "Unauthorized: Please log in again."
          : "Failed to submit assignment. Please try again."
      );
    }
  };

  const handleUndoTurnIn = async (submissionId) => {
    try {
      await undoSubmission(submissionId);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: "unsubmitted" } : s))
      );
      setMessage("Submission undone successfully.");
    } catch (err) {
      console.error("Undo error", err);
      setError("Failed to undo submission. Try again.");
    }
  };

  return (
    <div className="assignment-page">
      <ScholarHeader />
      <div className="staff-dashboard">
        <ScholarNavbar />

        <div className="assignment-wrapper">
          <div className="assignment-container">
            <div className="assignment-header">
              <h1>Assignments</h1>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {assignments.length > 0 ? (
              <ul className="submission-list">
                {assignments.map((a) => {
                  const sub = getSubmission(a.id);
                  const submitted = hasSubmitted(a.id);

                  return (
                    <li key={a.id} className="submission-item">
                      <div>
                        <p><strong>Assignment:</strong> {a.title}</p>
                        <p><strong>Due:</strong> {a.dueDate}</p>
                        <p><strong>Status:</strong> {sub ? sub.status : "Not submitted"}</p>
                        {sub?.filePath && (
                            <div>
                              <p><strong>Files:</strong></p>
                              <ul>
                                {sub.filePath.split(",").map((file, idx) => (
                                  <li key={idx}>
                                    <a
                                      href={`http://localhost:8080/uploads/${file.trim().split("\\").pop()}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                    >
                                      {file.trim().split("\\").pop()}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                      {submitted ? (
                        sub.status !== "verified" && (
                          <button className="btn-danger" onClick={() => handleUndoTurnIn(sub.id)}>
                            Undo Turn-In
                          </button>
                        )
                      ) : (
                        <div>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, a.id)}
                          />
                          {selectedFiles[a.id] && selectedFiles[a.id].length > 0 && (
                            <ul>
                              {selectedFiles[a.id].map((file, idx) => (
                                <li key={idx}>{file.name}</li>
                              ))}
                            </ul>
                          )}
                          <button onClick={() => handleSubmitAssignment(a.id)}>Submit</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarAssignment;