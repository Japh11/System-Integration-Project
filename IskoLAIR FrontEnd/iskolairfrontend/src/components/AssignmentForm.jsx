import React, { useState, useEffect } from "react";
import AssignmentApi from "../services/AssignmentApi";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/css/AssignmentForm.css";
import logo from "../assets/IskoLAIR_Logo.png"; 

const AssignmentForm = () => {
    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        dueDate: "",
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { id } = useParams(); // For editing an existing assignment

    useEffect(() => {
        if (id) {
            fetchAssignment();
        }
    }, [id]);

    const fetchAssignment = async () => {
        try {
            const fetchedAssignment = await AssignmentApi.getAssignmentById(id);
            setAssignment(fetchedAssignment);
        } catch (error) {
            console.error("Error fetching assignment:", error);
            setError("Error fetching assignment details");
        }
    };

    const handleInputChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            if (id) {
                // Update existing assignment
                await AssignmentApi.updateAssignment(id, assignment);
                setMessage("Assignment updated successfully");
            } else {
                // Create new assignment
                await AssignmentApi.createAssignment(assignment);
                setMessage("Assignment created successfully");
                setAssignment({ title: "", description: "", dueDate: "" });
            }
            navigate("/assignments"); // Redirect back to the assignments list
        } catch (error) {
            console.error("Error saving assignment:", error);
            setError("Error saving assignment");
        }
    };

    return (
        <div className="assignment-creation-page">
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
            <div className="assignment-form-wrapper">
                <button className="back-bttn" onClick={() => navigate("/assignments")}>←</button>
                <div className="assignment-form-container">
                    <h1>{id ? "Edit Assignment" : "Create Assignment"}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            Title
                            <input
                            type="text"
                            name="title"
                            value={assignment.title}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                        <div className="input-group">
                            <p>Description</p>
                            <textarea
                                name="description"
                                value={assignment.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            Deadline
                            <input
                                type="date"
                                name="dueDate"
                                value={assignment.dueDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button className="submit-button" type="submit">{id ? "Update Assignment" : "Create Assignment"}</button>
                    </form>

                    {/* Error and Success Messages */}
                    {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                    {message && <p className="success-message" style={{ color: "green" }}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AssignmentForm;