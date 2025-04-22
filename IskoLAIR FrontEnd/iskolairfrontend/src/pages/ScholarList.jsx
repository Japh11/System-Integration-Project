import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import "../pages/css/ScholarList.css"; // Import your CSS file
import logo from "../assets/IskoLAIR_Logo.png"; 

const ScholarList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scholars, setScholars] = useState([]);
    const [typeOfScholarship, setTypeOfScholarship] = useState("");
    const [selectedScholar, setSelectedScholar] = useState(null); // State for the selected scholar
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Get the status from the location state
        const state = location.state || {};
        setTypeOfScholarship(state.typeOfScholarship || "All"); // Default to "All" if no typeOfScholarship is provided

        // Fetch scholars
        const fetchScholars = async () => {
            try {
                const scholarsData = await ScholarApi.getAllScholars();
                setScholars(scholarsData);
            } catch (error) {
                console.error("Error fetching scholars:", error);
            }
        };

        fetchScholars();
    }, [location.state]);

    // Count scholars by status
    const ra7687Count = scholars.filter(scholar => scholar.typeOfScholarship === 'RA7687').length;
    const meritCount = scholars.filter(scholar => scholar.typeOfScholarship === 'Merit').length;
    const jlssCount = scholars.filter(scholar => scholar.typeOfScholarship === 'JLSS').length;
    const allCount = scholars.length; // Count all scholars

    const handleScholarClick = (scholar) => {
        setSelectedScholar({ ...scholar }); // Set the selected scholar for editing
    };

    const handleDeleteScholar = async (id) => {
        try {
            await ScholarApi.deleteScholar(id); // Call the API to delete the scholar
            setMessage("Scholar deleted successfully");
    
            // Refresh the list of scholars
            const updatedScholars = await ScholarApi.getAllScholars();
            setScholars(updatedScholars);
        } catch (error) {
            console.error("Error deleting scholar:", error);
            setError("Error deleting scholar");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedScholar((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateScholar = async (e) => {
        e.preventDefault();
        try {
            await ScholarApi.updateScholar(selectedScholar.id, selectedScholar); // Update scholar details
            setMessage("Scholar updated successfully");

            // Fetch the updated list of scholars
            const updatedScholars = await ScholarApi.getAllScholars();
            setScholars(updatedScholars);

            // Clear the selected scholar
            setSelectedScholar(null);
        } catch (error) {
            console.error("Error updating scholar:", error);
            setError("Error updating scholar");
        }
    };

    return (
        <div>
            <div className="staff-header">
                            <img src={logo} alt="IskoLAIR Logo" className="logo" />
                             {/* Dummy Icon */}
                             <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                                onClick={() => navigate("/staff/profile")} // Navigate to StaffProfile page
                            />
                        </div>
            <div style={{ padding: "20px" }}>
                <div className="Types-Scholars">
                    {/* All Scholars */}
                    <div
                        className="All"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/scholars", { state: { typeOfScholarship: "All" } })} // Pass "All" status
                    >
                        <h3>All</h3>
                        <p>{allCount}</p>
                    </div>

                    {/* RA7687 Scholars */}
                    <div
                        className="RA7687-Scholars"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/scholars", { state: { typeOfScholarship: "RA7687" } })} // Pass RA7687 status
                    >
                        <h3>RA7687</h3>
                        <p>{ra7687Count}</p>
                    </div>

                    {/* Merit Scholars */}
                    <div
                        className="Merit-Scholars"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/scholars", { state: { typeOfScholarship: "Merit" } })} // Pass Merit status
                    >
                        <h3>Merit</h3>
                        <p>{meritCount}</p>
                    </div>

                    {/* JLSS Scholars */}
                    <div
                        className="JLSS-Scholars"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/scholars", { state: { typeOfScholarship: "JLSS" } })} // Pass JLSS status
                    >
                        <h3>JLSS</h3>
                        <p>{jlssCount}</p>
                    </div>
                </div>

                <button onClick={() => navigate("/staff/dashboard")} style={{ marginBottom: "20px" }} className="dashboard-button">
                    Back to Dashboard
                </button>
                <button onClick={() => navigate("/scholar-creation")} style={{ marginBottom: "20px" }} className="create-scholar-button">
                    Create Scholar
                </button>
                {message && <p style={{ color: "green" }}>{message}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="scholar-list-container">
                    <h2>Scholar List</h2>
                    <ul>
                        <div className="divider">
                            {scholars
                                .filter((scholar) => typeOfScholarship === "All" || scholar.typeOfScholarship === typeOfScholarship) // Show all scholars when status is "All"
                                .map((scholar, index) => (
                                    <li
                                        key={scholar.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: index % 2 === 0 ? "white" : "#83A6DE", // Alternate colors
                                        }}
                                    >
                                        <span
                                            style={{ flex: 1, cursor: "pointer", color: "blue" }}
                                            onClick={() => handleScholarClick(scholar)}
                                        >
                                            {scholar.firstName} {scholar.lastName} - {scholar.email}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteScholar(scholar.id)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                        </div>
                    </ul>
                </div>

                {selectedScholar && (
                    <div>
                        <h3>Edit Scholar Details</h3>
                        <form onSubmit={handleUpdateScholar}>
                        <input
                            type="text"
                            name="lastName"
                            value={selectedScholar.lastName}
                            onChange={handleEditChange}
                            placeholder="Last Name"
                            required
                        />
                        <input
                            type="text"
                            name="firstName"
                            value={selectedScholar.firstName}
                            onChange={handleEditChange}
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="middleName"
                            value={selectedScholar.middleName}
                            onChange={handleEditChange}
                            placeholder="Middle Name"
                        />
                        <input
                            type="number"
                            name="batchYear"
                            value={selectedScholar.batchYear}
                            onChange={handleEditChange}
                            placeholder="Batch Year"
                            required
                        />
                        <input
                            type="text"
                            name="accountNo"
                            value={selectedScholar.accountNo}
                            onChange={handleEditChange}
                            placeholder="Account No"
                            required
                        />
                        <input
                            type="text"
                            name="spasNo"
                            value={selectedScholar.spasNo}
                            onChange={handleEditChange}
                            placeholder="SPAS No"
                            required
                        />
                        <input
                            type="text"
                            name="sex"
                            value={selectedScholar.sex}
                            onChange={handleEditChange}
                            placeholder="Sex"
                            required
                        />
                        <input
                            type="text"
                            name="levelYear"
                            value={selectedScholar.levelYear}
                            onChange={handleEditChange}
                            placeholder="Level/Year"
                            required
                        />
                        <input
                            type="text"
                            name="school"
                            value={selectedScholar.school}
                            onChange={handleEditChange}
                            placeholder="School"
                            required
                        />
                        <input
                            type="text"
                            name="course"
                            value={selectedScholar.course}
                            onChange={handleEditChange}
                            placeholder="Course"
                            required
                        />
                        <input
                            type="text"
                            name="status"
                            value={selectedScholar.status}
                            onChange={handleEditChange}
                            placeholder="Status"
                            required
                        />
                        <input
                            type="text"
                            name="typeOfScholarship"
                            value={selectedScholar.typeOfScholarship}
                            onChange={handleEditChange}
                            placeholder="Status"
                            required
                        />
                        <input
                            type="date"
                            name="birthday"
                            value={selectedScholar.birthday}
                            onChange={handleEditChange}
                            placeholder="Birthday"
                            required
                        />
                        <input
                            type="text"
                            name="contactNumber"
                            value={selectedScholar.contactNumber}
                            onChange={handleEditChange}
                            placeholder="Contact Number"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={selectedScholar.email}
                            onChange={handleEditChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="brgy"
                            value={selectedScholar.brgy}
                            onChange={handleEditChange}
                            placeholder="Barangay"
                            required
                        />
                        <input
                            type="text"
                            name="municipality"
                            value={selectedScholar.municipality}
                            onChange={handleEditChange}
                            placeholder="Municipality"
                            required
                        />
                        <input
                            type="text"
                            name="province"
                            value={selectedScholar.province}
                            onChange={handleEditChange}
                            placeholder="Province"
                            required
                        />
                        <input
                            type="text"
                            name="district"
                            value={selectedScholar.district}
                            onChange={handleEditChange}
                            placeholder="District"
                            required
                        />
                        <input
                            type="text"
                            name="region"
                            value={selectedScholar.region}
                            onChange={handleEditChange}
                            placeholder="Region"
                            required
                        />
                            <button type="submit">Update Scholar</button>
                            <button type="button" onClick={() => setSelectedScholar(null)} style={{ marginLeft: "10px" }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScholarList;
