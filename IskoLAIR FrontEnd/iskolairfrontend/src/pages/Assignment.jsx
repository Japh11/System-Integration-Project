import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/IskoLAIR_Logo.png";
import AssignmentApi from "../services/AssignmentApi";
import { getSubmissionsByAssignment, verifySubmission } from "../services/SubmissionApi";

import "../pages/css/Announcement.css";
import "../pages/css/Assignment.css";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await AssignmentApi.getAllAssignments();
        setAssignments(data);
      } catch {
        setError("Error fetching assignments");
      }
    }
    loadAssignments();
  }, []);

  const handleViewSubmissions = async assignmentId => {
    try {
      const subs = await getSubmissionsByAssignment(assignmentId);
      setSubmissions(subs);
      setFilteredSubmissions(subs);
      setSelectedSubmission(null);
    } catch {
      setError("Failed to fetch submissions");
    }
  };

  const handleFilterChange = status => {
    setFilter(status);
    setFilteredSubmissions(
      status === "all"
        ? submissions
        : submissions.filter(s => s.status === status)
    );
  };

  const handleVerifySubmission = async submissionId => {
    try {
      await verifySubmission(submissionId);
      setMessage("Submission verified");
      setSubmissions(subs =>
        subs.map(s => s.id === submissionId ? { ...s, status: "verified" } : s)
      );
      setFilteredSubmissions(subs =>
        subs.map(s => s.id === submissionId ? { ...s, status: "verified" } : s)
      );
    } catch {
      setError("Failed to verify");
    }
  };

  const handleDeleteAssignment = async assignmentId => {
    try {
      await AssignmentApi.deleteAssignment(assignmentId);
      setAssignments(a => a.filter(x => x.id !== assignmentId));
      setMessage("Assignment deleted");
      setSubmissions([]);
      setFilteredSubmissions([]);
      setSelectedSubmission(null);
    } catch {
      setError("Failed to delete");
    }
  };

  return (
    <div className="assignment-page">
      {/* Header */}
      <div className="staff-header">
        <img src={logo} alt="IskoLAIR Logo" className="logo" />
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="profile-pic"
          onClick={() => navigate("/staff/profile")}
        />
      </div>

      {/* Sidebar */}
      <div className="announcement-container">
        <div className="Navigationbar">
          <button className={location.pathname === "/staff/dashboard" ? "active" : ""} onClick={() => navigate("/staff/dashboard")}>Home</button>
          <button className={location.pathname === "/announcements" ? "active" : ""} onClick={() => navigate("/announcements")}>Announcements</button>
          <button className={location.pathname === "/assignments" ? "active" : ""} onClick={() => navigate("/assignments")}>Assignments</button>
          <button className={location.pathname === "/messages" ? "active" : ""} onClick={() => navigate("/messages")}>Messages</button>
          <button className={location.pathname === "/resources" ? "active" : ""} onClick={() => navigate("/resources")}>Resources</button>
        </div>

        {/* Main Content */}
        <div className="announcement-content">
          <div className="CreateAnnouncement-A">
            <button onClick={() => navigate("/assignments/create")}>Create Assignment</button>
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          {/* Assignments */}
          <div className="panel assignment-list-panel">
            {assignments.map(a => (
              <div key={a.id} className="assignment-card">
                <div>
                  <h2>{a.title}</h2>
                  <p><strong>Due:</strong> {a.dueDate}</p>
                </div>
                <div className="assignment-actions">
                  <button onClick={() => handleViewSubmissions(a.id)}>View Submissions</button>
                  <button onClick={() => handleDeleteAssignment(a.id)}>Delete</button>
                </div>
              </div>
            ))}
            {assignments.length === 0 && <p>No assignments found.</p>}
          </div>

          {/* Submissions */}
          {submissions.length > 0 && (
            <section className="panel submissions-panel">
              <h2>Submissions</h2>
              <div className="filter-buttons">
                {["all", "verified", "unverified"].map(s => (
                  <button key={s} onClick={() => handleFilterChange(s)} className={filter === s ? "active" : ""}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <ul className="submission-list">
                {filteredSubmissions.map(s => (
                  <li key={s.id} className="submission-item">
                    <div>
                      <p><strong>Scholar:</strong> {s.scholar ? `${s.scholar.firstName} ${s.scholar.lastName}` : "N/A"}</p>
                      <p><strong>Status:</strong> {s.status}</p>
                    </div>
                    <div className="submission-actions">
                      <button onClick={() => setSelectedSubmission(s)}>View Details</button>
                      {s.status === "unverified" && (
                        <button onClick={() => handleVerifySubmission(s.id)}>Verify</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Submission Details */}
          {selectedSubmission && (
            <section className="panel details-panel">
              <h2>Submission Details</h2>
              <p><strong>Scholar:</strong> {selectedSubmission.scholar ? `${selectedSubmission.scholar.firstName} ${selectedSubmission.scholar.lastName}` : "N/A"}</p>
              <p><strong>Status:</strong> {selectedSubmission.status}</p>
              <p>
                <strong>Submitted On:</strong>{" "}
                {selectedSubmission.submittedAt
                  ? new Date(selectedSubmission.submittedAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>File:</strong>{" "}
                <a
                  href={`http://localhost:8080/uploads/${selectedSubmission.filePath.split("\\").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {selectedSubmission.filePath.split("\\").pop()}
                </a>
              </p>
              <button className="btn-secondary" onClick={() => setSelectedSubmission(null)}>Close</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
