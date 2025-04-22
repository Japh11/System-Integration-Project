import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";
import ScholarApi from "../services/ScholarApi";
import { getSubmissionsByScholar, undoSubmission } from "../services/SubmissionApi";
import "../pages/css/ScholarDashboard.css";
import "../pages/css/Assignment.css";


const ScholarAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarData();
  }, []);

  const fetchScholarData = async () => {
    try {
      const scholarId = localStorage.getItem("scholarId");
      const data = await getSubmissionsByScholar(scholarId);
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (err) {
      setError("Failed to load submissions.");
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    setFilteredSubmissions(
      status === "all"
        ? submissions
        : submissions.filter((s) => s.status === status)
    );
  };

  const handleUndoSubmission = async (id) => {
    try {
      await undoSubmission(id);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "unsubmitted" } : s))
      );
      setFilteredSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "unsubmitted" } : s))
      );
      setMessage("Submission undone successfully");
    } catch {
      setError("Failed to undo submission");
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
              <h1>Your Submissions</h1>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <div className="filter-buttons">
              {["all", "verified", "unverified", "unsubmitted"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange(s)}
                  className={filter === s ? "active" : ""}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {filteredSubmissions.length > 0 ? (
              <ul className="submission-list">
                {filteredSubmissions.map((s) => (
                  <li key={s.id} className="submission-item">
                    <div>
                      <p><strong>Assignment:</strong> {s.assignment?.title || "N/A"}</p>
                      <p><strong>Status:</strong> {s.status}</p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {s.submittedAt
                          ? new Date(s.submittedAt).toLocaleString()
                          : "N/A"}
                      </p>
                      {s.filePath && (
                        <p>
                          <strong>Files:</strong>
                          <ul>
                            {s.filePath.split(",").map((file, idx) => (
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
                        </p>
                      )}
                    </div>
                    {s.status !== "verified" && s.status !== "unsubmitted" && (
                      <button
                        className="btn-danger"
                        onClick={() => handleUndoSubmission(s.id)}
                      >
                        Undo Turn-In
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No submissions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarAssignment;
