import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import AssignmentApi from "../services/AssignmentApi";
import AnnouncementApi from "../services/AnnouncementApi";
import { getSubmissionsByScholar, undoSubmission } from "../services/SubmissionApi";
import axios from "axios";
import "../pages/css/ScholarDashboard.css";

import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";

const ScholarDashboard = () => {
  const [scholar, setScholar] = useState(null);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found. Please log in.");
        return;
      }
      try {
        const data = await ScholarApi.getScholarDetails();
        setScholar(data);
      } catch (err) {
        setError(err.message.includes("No token")
          ? "Your session has expired. Please log in again."
          : "Failed to load scholar details. Please try again.");
      }
    };

    const fetchAssignments = async () => {
      try {
        const data = await AssignmentApi.getAllAssignments();
        setAssignments(data);
        setFilteredAssignments(data);
      } catch {
        setError("Failed to load assignments. Please try again.");
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const data = await AnnouncementApi.getAllAnnouncements();
        setAnnouncements(data);
      } catch {
        setError("Failed to load announcements. Please try again.");
      }
    };

    fetchScholarDetails();
    fetchAssignments();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!scholar?.id) return;
      try {
        const data = await getSubmissionsByScholar(scholar.id);
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      }
    };
    loadSubmissions();
  }, [scholar]);

  const handleFileChange = (e, assignmentId) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(prev => ({
      ...prev,
      [assignmentId]: prev[assignmentId]
        ? [...prev[assignmentId], ...newFiles]
        : newFiles
    }));
  };

  const handleSubmitAssignment = async assignmentId => {
    const files = selectedFiles[assignmentId];
    if (!files || files.length === 0) {
      setMessage("Please select at least one file before submitting.");
      return;
    }

    const scholarId = scholar?.id;
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
      setSubmissions(prev => [...prev, newSubmission]);
      setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
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
      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId ? { ...s, status: "unsubmitted" } : s
        )
      );
      setMessage("Submission undone successfully.");
    } catch (err) {
      console.error("Undo error", err);
      setError("Failed to undo submission. Try again.");
    }
  };

  const hasSubmitted = id => {
    const sub = submissions.find(s => s.assignment?.id === id);
    return sub && (sub.status === "unverified" || sub.status === "verified");
  };

  const getSubmission = id =>
    submissions.find(s => s.assignment?.id === id);

  const handleFilterChange = status => {
    switch (status) {
      case "all":
        setFilteredAssignments(assignments);
        break;
      case "completed":
        setFilteredAssignments(assignments.filter(a => hasSubmitted(a.id)));
        break;
      case "pending":
        setFilteredAssignments(assignments.filter(a => {
          const sub = getSubmission(a.id);
          const isPastDue = new Date(a.dueDate) < new Date();
          return !sub && !isPastDue;
        }));
        break;
      case "past due":
        setFilteredAssignments(assignments.filter(a => {
          const sub = getSubmission(a.id);
          const isPastDue = new Date(a.dueDate) < new Date();
          return !sub && isPastDue;
        }));
        break;
      default:
        setFilteredAssignments(assignments);
    }
  };

  return (
    <div>
      <ScholarHeader />
        <div className="chat-body">
          <ScholarNavbar />

        <div className="scholar-dashboard-content">
          <div className="scholar-first-half">
            <h2>Scholar Dashboard</h2>
          </div>

          <div className="scholar-second-half">
            <div className="scholar-assignment">
              <div className="section-header">
                <h3>Assignments</h3>
                <div className="filter-buttons">
                  <button onClick={() => handleFilterChange("all")}>All</button>
                  <button onClick={() => handleFilterChange("pending")}>Pending</button>
                  <button onClick={() => handleFilterChange("completed")}>Completed</button>
                  <button onClick={() => handleFilterChange("past due")}>Past Due</button>
                  <button style={{ marginLeft: 8 }} onClick={() => window.location.reload()}>Refresh</button>
                </div>
              </div>

              <div className="scrollable-content">
                {filteredAssignments.length > 0 ? (
                  <ul>
                    {filteredAssignments.map(a => {
                      const sub = getSubmission(a.id);
                      const done = hasSubmitted(a.id);
                      return (
                        <li key={a.id}>
                          <strong>{a.title}</strong>
                          <p>
                            Submission Status:{" "}
                            {sub
                              ? sub.status === "verified"
                                ? "Verified ✅"
                                : sub.status === "unsubmitted"
                                ? "Undone"
                                : "Submitted (Pending)"
                              : "Not submitted"}
                          </p>
                          {done ? (
                            <>
                              <button onClick={() => handleUndoTurnIn(sub.id)}>Undo Turn‑In</button>
                              <div>
                                <p><strong>View Files:</strong></p>
                                <ul>
                                  {sub.filePath.split(",").map((path, i) => {
                                    const fileName = path.split("\\").pop();
                                    return (
                                      <li key={i}>
                                        <a
                                          href={`http://localhost:8080/uploads/${fileName}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          download
                                        >
                                          {fileName}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <>
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
                              <button onClick={() => handleSubmitAssignment(a.id)}>
                                Submit
                              </button>
                            </>
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

            <div className="scholar-announcement">
              <div className="section-header">
                <h3>Announcements</h3>
              </div>
              <div className="scrollable-content">
                {announcements.length > 0 ? (
                  <ul>
                    {announcements.map(a => (
                      <li key={a.id}>
                        <h4>{a.title}</h4>
                        <p>{a.description}</p>
                        {a.photos?.length > 0 && (
                          <div>
                            <h5>Photos:</h5>
                            <ul>
                              {a.photos.map((url, i) => (
                                <li key={i}>
                                  <img
                                    src={url}
                                    alt={`Photo ${i + 1}`}
                                    style={{ width: 100, marginRight: 10 }}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No announcements available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {message && <p className="info-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ScholarDashboard;