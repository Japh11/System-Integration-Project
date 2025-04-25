import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentApi from "../services/AssignmentApi";
import { getSubmissionsByAssignment, verifySubmission } from "../services/SubmissionApi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import "../pages/css/Announcement.css";
import "../pages/css/Assignment.css";

import StaffHeader from '../components/StaffHeader';
import StaffNavbar from '../components/StaffNavbar';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
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

  const handleDownloadExcel = () => {
    if (!selectedAssignment) {
      setError("Please select an assignment first.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Submissions");

    // Add headers
    worksheet.columns = [
      { header: "Scholar", key: "scholar", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Submitted At", key: "submittedAt", width: 25 },
    ];

    // Add data rows
    submissions.forEach((s) => {
      worksheet.addRow({
        scholar: s.scholar ? `${s.scholar.firstName} ${s.scholar.lastName}` : "N/A",
        status: s.status,
        submittedAt: s.submittedAt
          ? new Date(s.submittedAt).toLocaleString()
          : "N/A",
      });
    });

    // Write the workbook to a Blob and trigger download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `${selectedAssignment.title.replace(/ /g, "_")}_Submissions.xlsx`);
    }).catch((err) => {
      console.error("Error generating Excel file:", err);
      setError("Failed to generate Excel file.");
    });
  };

  return (
    <div className="assignment-page">
      <StaffHeader />
      <div className="staff-dashboard">
        <StaffNavbar />

        <div className="assignment-wrapper">
          <div className='assignment-container'>
            <div className='assignment-header'>
              <h1>Assignments</h1>
              <button onClick={() => navigate("/assignments/create")}>+ Create Assignment</button>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {assignments.map(a => (
              <div key={a.id} className="assignment-card">
                <div>
                  <h2>{a.title}</h2>
                  <p><strong>Due:</strong> {a.dueDate}</p>
                </div>
                <div className="assignment-actions">
                  <button className="view" onClick={() => {
                    setSelectedAssignment(a);
                    handleViewSubmissions(a.id);
                  }}>View</button>
                  <button className="delete" onClick={() => handleDeleteAssignment(a.id)}>Delete</button>
                </div>
              </div>
            ))}
            {assignments.length === 0 && <p>No assignments found.</p>}

            {submissions.length > 0 && (
              <section className="panel submissions-panel">
                <h2>Submissions</h2>
                <div className="filter-buttons">
                  {["all", "verified", "unverified", "unsubmitted"].map(s => (
                    <button key={s} onClick={() => handleFilterChange(s)} className={filter === s ? "active" : ""}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                  <button className="download-excel" onClick={handleDownloadExcel}>
                    📥 Download Excel
                  </button>
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
                  <strong>Files:</strong>
                  <ul>
                    {selectedSubmission.filePath.split(",").map((file, idx) => (
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
                <button className="btn-secondary" onClick={() => setSelectedSubmission(null)}>Close</button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;