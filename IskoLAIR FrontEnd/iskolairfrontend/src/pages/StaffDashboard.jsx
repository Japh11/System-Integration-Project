import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffApi from "../services/StaffApi";
import ScholarApi from "../services/ScholarApi";
import AssignmentApi from "../services/AssignmentApi";
import AnnouncementApi from "../services/AnnouncementApi";
import "../pages/css/StaffDashboard.css"; 

import StaffHeader from '../components/StaffHeader';
import StaffNavbar from '../components/StaffNavbar';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [scholars, setScholars] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    const [date, setDate] = useState(new Date());

    const API_URL = import.meta.env.VITE_ISKOLAIR_API_URL;
    const FILE_URL = API_URL.replace("/api", "");

    const ra7687Count = scholars.filter((scholar) => scholar.typeOfScholarship === "RA7687").length;
    const meritCount = scholars.filter((scholar) => scholar.typeOfScholarship === "Merit").length;
    const jlssCount = scholars.filter((scholar) => scholar.typeOfScholarship === "JLSS").length;

    useEffect(() => {
        const staffId = localStorage.getItem("staffId");
        if (!staffId) {
            console.error("❌ No staff ID found in localStorage");
            setError("Staff ID not found. Please log in again.");
            return;
        }

        const fetchAssignments = async () => {
            try {
                const response = await StaffApi.getAssignments(staffId);
                setAssignments(response.data);
            } catch (err) {
                setError("Error fetching assignments");
            }
        };

        fetchAssignments();
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const scholarsData = await ScholarApi.getAllScholars();
                setScholars(scholarsData);

                const assignmentsData = await AssignmentApi.getAllAssignments();
                setAssignments(assignmentsData);
            } catch (error) {
                setError("Error fetching data");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await AnnouncementApi.getAllAnnouncements();
                console.log("Fetched announcements:", data);
                setAnnouncements(data);
            } catch (err) {
                setError("Failed to load announcements");
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div>
            <StaffHeader />
            <div className="staff-dashboard">
                <StaffNavbar />

                <div className="staff-content">
                    <div className="first-half">
                        <div className="ScholarsSection">
                            <h2>Scholars</h2>
                            <div className="Types">
                                <div className="RA7687" style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "RA7687" } })}>
                                    <h3>RA7687</h3>
                                    <p>{ra7687Count}</p>
                                </div>

                                <div className="Merit" style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "Merit" } })}>
                                    <h3>Merit</h3>
                                    <p>{meritCount}</p>
                                </div>

                                <div className="JLSS" style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "JLSS" } })}>
                                    <h3>JLSS</h3>
                                    <p>{jlssCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="calendar-container">
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                tileContent={({ date, view }) => {
                                    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                    const formattedDate = normalizedDate.toISOString().split('T')[0];

                                    const eventsForDate = assignments.filter((assignment) =>
                                        assignment.dueDate === formattedDate
                                    );

                                    return (
                                        <div>
                                            {eventsForDate.map((event) => (
                                                <div key={event.id} style={{ backgroundColor: 'lightblue', padding: '2px' }}>
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <div className="AnnouncementArea">
                        <h2>Announcements</h2>
                        <div className="Announcements" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <ul>
                                {announcements.map((announcement) => (
                                    <li key={announcement.id} className="announcement-box">
                                        <h4>{announcement.title}</h4> 
                                        <p><strong>Created Date:</strong> {new Date(announcement.createdDate).toLocaleString()}</p>
                                        <p>{announcement.description}</p>

                                        {/* Display photos */}
                                        {announcement.photos && announcement.photos.length > 0 && (
                                            <div>
                                                <h5>Photos:</h5>
                                                <ul>
                                                    {announcement.photos.map((photo, index) => {
                                                        const filename = photo.trim().split("\\").pop();
                                                        const photoUrl = `${FILE_URL}/uploads/${filename}`;

                                                        return (
                                                            <li key={index}>
                                                                <img
                                                                    src={photoUrl}
                                                                    alt={`Photo ${index + 1}`}
                                                                    style={{ width: "100px", height: "auto", marginRight: "10px" }}
                                                                    onError={(e) => {
                                                                        console.error(`Image failed to load: ${photoUrl}`);
                                                                        if (e.target.src !== window.location.origin + "/path/to/placeholder.jpg") {
                                                                            e.target.src = "/path/to/placeholder.jpg";
                                                                        }
                                                                    }}
                                                                />
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="CreateAnnouncement">
                            <button onClick={() => navigate("/announcements")}>Create Announcement</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
