import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import AssignmentApi from "../services/AssignmentApi";
import AnnouncementApi from "../services/AnnouncementApi";
import { getSubmissionsByScholar } from "../services/SubmissionApi";
import profilePlaceholder from "../assets/profiletemp.jpg";
import "../pages/css/ScholarDashboard.css";

import ScholarHeader from "../components/ScholarHeader";
import ScholarNavbar from "../components/ScholarNavbar";

const ScholarDashboard = () => {
  const [scholar, setScholar] = useState(null);
  const [profilePicture, setProfilePicture] = useState(profilePlaceholder);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarData = async () => {
      try {
        const scholarData = await ScholarApi.getScholarDetails();
        setScholar(scholarData);
        setProfilePicture(scholarData.profilePicture || profilePlaceholder);

        const assignmentData = await AssignmentApi.getAllAssignments();
        setAssignments(assignmentData);

        const submissionData = await getSubmissionsByScholar(scholarData.id);
        setSubmissions(submissionData);
      } catch (err) {
        setError("Failed to fetch data. Please log in again.");
        console.error(err);
      }
    };

    fetchScholarData();
  }, []);

  const hasSubmitted = (assignmentId) => {
    const submission = submissions.find(s => s.assignment?.id === assignmentId);
    return submission && (submission.status === "verified" || submission.status === "unverified");
  };

  const submissionProgress = assignments.length > 0
    ? Math.round((assignments.filter(a => hasSubmitted(a.id)).length / assignments.length) * 100)
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "Good Standing":
        return "#4caf50";
      case "Continued under Probation":
        return "#ff9800";
      case "Continued under Partial Allowance":
        return "#ffeb3b";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <div>
      <ScholarHeader />
      <div className="chat-body">
        <ScholarNavbar />

        <div className="scholar-dashboard-content">
          <div className="scholar-first-half">
            <div className="scholar-profile-section">
              <img src={profilePicture} alt="Profile" className="scholar-profile-pic" />
              <div className="scholar-info">
                <h3>{scholar?.firstName} {scholar?.lastName}</h3>
                <p>{scholar?.typeOfScholarship}</p>
              </div>
            </div>
            <div className="status-box">
              <p>Status</p>
              <div className="status-indicator" style={{ backgroundColor: getStatusColor(scholar?.status) }}>
                {scholar?.status || "Unknown"}
              </div>
            </div>
          </div>

          <div className="dashboard-lower-half">
            <div className="assignments-section">
              <h3>Assignments</h3>
              <div className="progress-circle">
                <svg viewBox="0 0 36 36">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="3.8"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${submissionProgress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#86c26f"
                    strokeWidth="3.8"
                  />
                </svg>
                <div className="progress-text">{submissionProgress}% Progress</div>
              </div>
              <div className="scrollable-content">
                {assignments.length > 0 ? (
                  assignments.map((a) => {
                    const isDueToday = new Date(a.dueDate).toDateString() === new Date().toDateString();
                    const submitted = hasSubmitted(a.id);
                    return (
                      <div className="assignment-card" key={a.id}>
                        <div className="assignment-header">
                          <span className="assignment-icon">{submitted ? "✅" : "❗"}</span>
                          <strong>{a.title}</strong>
                          <span className="due-date">
                            {isDueToday ? "due today" : `due ${new Date(a.dueDate).toLocaleDateString()}`}
                          </span>
                        </div>
                        <ul>
                          {a.requirements?.split(",").map((r, i) => (
                            <li key={i} className={submitted ? "req-complete" : "req-pending"}>
                              {r.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                ) : (
                  <p>No assignments available.</p>
                )}
              </div>
            </div>

            <div className="scholar-announcement">
              <h3>Announcements</h3>
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

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ScholarDashboard;
