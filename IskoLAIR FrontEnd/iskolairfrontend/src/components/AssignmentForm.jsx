import React, { useState, useEffect } from "react";
import AssignmentApi from "../services/AssignmentApi";
import { useNavigate, useParams } from "react-router-dom";

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
        <div>
            <h3>{id ? "Edit Assignment" : "Create Assignment"}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={assignment.title}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={assignment.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="dueDate"
                    value={assignment.dueDate}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">{id ? "Update Assignment" : "Create Assignment"}</button>
            </form>

            {/* Error and Success Messages */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    );
};

export default AssignmentForm;