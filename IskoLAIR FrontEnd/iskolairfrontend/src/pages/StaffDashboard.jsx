import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffApi from "../services/StaffApi";
import ScholarApi from "../services/ScholarApi";
import AssignmentApi from "../services/AssignmentApi";
import AnnouncementApi from "../services/AnnouncementApi";
import logo from "../assets/IskoLAIR_Logo.png"; 
import "../pages/css/StaffDashboard.css"; // Import the CSS file for styling

import Calendar from 'react-calendar';  // Import the Calendar component
import 'react-calendar/dist/Calendar.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(null); // State to track the active status
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [scholars, setScholars] = useState([]);  // List of all scholars
    const [assignments, setAssignments] = useState([]); // State for assignments
    const [announcements, setAnnouncements] = useState([]); // State for announcements
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    const [date, setDate] = useState(new Date());  // For Calendar date state

    // Count the different types of scholarships
    const ra7687Count = scholars.filter((scholar) => scholar.typeOfScholarship === "RA7687").length;
    const meritCount = scholars.filter((scholar) => scholar.typeOfScholarship === "Merit").length;
    const jlssCount = scholars.filter((scholar) => scholar.typeOfScholarship === "JLSS").length;

    // Fetch assignments when component mounts
    useEffect(() => {
        const scholarId = localStorage.getItem("scholarId");
        const staffId = localStorage.getItem("staffId"); // Retrieve staffId from localStorage
        if (!staffId) {
            console.error("❌ No staff ID found in localStorage");
            setError("Staff ID not found. Please log in again.");
            return;
        }
    
        // Fetch assignments or other staff-related data
        const fetchAssignments = async () => {
            try {
                const response = await StaffApi.getAssignments(staffId); // Hypothetical API call
                setAssignments(response.data);
            } catch (err) {
                setError("Error fetching assignments");
            }
        };
    
        // Fetch assignments
        fetchAssignments();
    }, []);

    // Handle date changes in the calendar
    const handleDateChange = (newDate) => {
        setDate(newDate);  // Update the selected date when the user interacts with the calendar
    };

    // Fetch data including scholars, assignments, and announcements
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
            <div className="staff-header">
                <img src={logo} alt="IskoLAIR Logo" className="logo" />
                {/* Dummy Profile Icon */}
                <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    style={{ width: "40px", height: "40px", cursor: "pointer" }}
                    onClick={() => navigate("/staff/profile")} // Navigate to StaffProfile page
                />
            </div>
            <div className="staff-dashboard">
            <div className="Navigationbar">
                <button
                className={location.pathname === "/staff/dashboard" ? "active" : ""}
                onClick={() => navigate("/staff/dashboard")}
                >
                    Home
                </button>
                <button
                    className={location.pathname === "/announcements" ? "active" : ""}
                    onClick={() => navigate("/announcements")}
                    >
                    Announcements
                </button>
                <button
                    className={location.pathname === "/assignments" ? "active" : ""}
                    onClick={() => navigate("/assignments")}
                    >
                    Assigments
                </button>
                <button
                    className={location.pathname === "/messages" ? "active" : ""}
                    onClick={() => navigate("/messages")}
                    >
                    Messages
                </button>
                <button
                    className={location.pathname === "/resources" ? "active" : ""}
                    onClick={() => navigate("/resources")}
                >
                    Resources
                </button>
                {/*<button
                    className={location.pathname === "/faq" ? "active" : ""}
                    onClick={() => navigate("/faq")}
                    >
                    FAQ
                </button> */}
            </div>

                <div className="staff-content">
                    <div className="first-half">
                        <div className="ScholarsSection">
                            <h2>Scholars</h2>
                            <div className="Types">
                                {/* RA7687 Scholars */}
                                <div
                                    className="RA7687"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "RA7687" } })} // Pass status to the new page
                                >
                                    <h3>RA7687</h3>
                                    <p>{ra7687Count}</p>
                                </div>

                                {/* Merit Scholars */}
                                <div
                                    className="Merit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "Merit" } })} // Pass status to the new page
                                >
                                    <h3>Merit</h3>
                                    <p>{meritCount}</p>
                                </div>

                                {/* JLSS Scholars */}
                                <div
                                    className="JLSS"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/scholars", { state: { status: "JLSS" } })} // Pass status to the new page
                                >
                                    <h3>JLSS</h3>
                                    <p>{jlssCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="calendar-container">
                            <Calendar
                                onChange={handleDateChange} // Function to handle date changes
                                value={date} // Controlled value for the calendar
                                tileContent={({ date, view }) => {
                                    // Normalize the date to UTC (remove time zone influence)
                                    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

                                    // Format the date to match your event date format (ISO string without time)
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
                                                    {announcement.photos.map((url, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <img
                                                                    src={url} // Use the URL directly
                                                                    alt={`Photo ${index + 1}`}
                                                                    style={{ width: "100px", height: "auto", marginRight: "10px" }}
                                                                    onError={(e) => {
                                                                        console.error(`Image failed to load: ${url}`);
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
                            <button onClick={() => navigate("/announcements")} >Create Announcement</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
