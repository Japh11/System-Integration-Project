import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";

const ScholarProfile = () => {
    const navigate = useNavigate();
    const [scholar, setScholar] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        batchYear: "",
        accountNo: "",
        spasNo: "",
        sex: "",
        levelYear: "",
        school: "",
        course: "",
        status: "",
        typeOfScholarship:"",
        birthday: "",
        contactNumber: "",
        email: "",
        brgy: "",
        municipality: "",
        province: "",
        district: "",
        region: "",
        password: "",
    }); // Default values for all fields
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScholarDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token found. Please log in.");
                return;
            }

            try {
                const scholarData = await ScholarApi.getScholarDetails(); // Fetch the logged-in scholar's details
                setScholar(scholarData);
            } catch (error) {
                console.error("Error fetching scholar details:", error.message);
                setError("Failed to fetch scholar details. Please log in again.");
            }
        };
    
        fetchScholarDetails();
    }, [navigate]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setScholar((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateScholar = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await ScholarApi.updateScholar(scholar.id, scholar); // Update the scholar's details
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating scholar profile:", error.message);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/scholar/dashboard"); // Navigate to scholar dashboard
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.clear();
        navigate("/scholar/dashboard"); // Redirect to the login page
    };

    if (!scholar) {
        return <p>Loading profile...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Scholar Profile Settings</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleUpdateScholar}>
                <input
                    type="text"
                    name="lastName"
                    value={scholar.lastName || ""}
                    onChange={handleEditChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="text"
                    name="firstName"
                    value={scholar.firstName || ""}
                    onChange={handleEditChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="middleName"
                    value={scholar.middleName || ""}
                    onChange={handleEditChange}
                    placeholder="Middle Name"
                />
                <input
                    type="number"
                    name="batchYear"
                    value={scholar.batchYear || ""}
                    onChange={handleEditChange}
                    placeholder="Batch Year"
                    required
                />
                <input
                    type="text"
                    name="accountNo"
                    value={scholar.accountNo || ""}
                    onChange={handleEditChange}
                    placeholder="Account No"
                    required
                />
                <input
                    type="text"
                    name="spasNo"
                    value={scholar.spasNo || ""}
                    onChange={handleEditChange}
                    placeholder="SPAS No"
                    required
                />
                <input
                    type="text"
                    name="sex"
                    value={scholar.sex || ""}
                    onChange={handleEditChange}
                    placeholder="Sex"
                    required
                />
                <input
                    type="text"
                    name="levelYear"
                    value={scholar.levelYear || ""}
                    onChange={handleEditChange}
                    placeholder="Level/Year"
                    required
                />
                <input
                    type="text"
                    name="school"
                    value={scholar.school || ""}
                    onChange={handleEditChange}
                    placeholder="School"
                    required
                />
                <input
                    type="text"
                    name="course"
                    value={scholar.course || ""}
                    onChange={handleEditChange}
                    placeholder="Course"
                    required
                />
                <input
                    type="text"
                    name="status"
                    value={scholar.status || ""}
                    onChange={handleEditChange}
                    placeholder="Status"
                    required
                />
                <input
                    type="text"
                    name="typeOfScholarship"
                    value={scholar.typeOfScholarship || ""}
                    onChange={handleEditChange}
                    placeholder="Type Of Scholarship"
                    required
                />
                <input
                    type="date"
                    name="birthday"
                    value={scholar.birthday || ""}
                    onChange={handleEditChange}
                    placeholder="Birthday"
                    required
                />
                <input
                    type="text"
                    name="contactNumber"
                    value={scholar.contactNumber || ""}
                    onChange={handleEditChange}
                    placeholder="Contact Number"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={scholar.email || ""}
                    onChange={handleEditChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="brgy"
                    value={scholar.brgy || ""}
                    onChange={handleEditChange}
                    placeholder="Barangay"
                    required
                />
                <input
                    type="text"
                    name="municipality"
                    value={scholar.municipality || ""}
                    onChange={handleEditChange}
                    placeholder="Municipality"
                    required
                />
                <input
                    type="text"
                    name="province"
                    value={scholar.province || ""}
                    onChange={handleEditChange}
                    placeholder="Province"
                    required
                />
                <input
                    type="text"
                    name="district"
                    value={scholar.district || ""}
                    onChange={handleEditChange}
                    placeholder="District"
                    required
                />
                <input
                    type="text"
                    name="region"
                    value={scholar.region || ""}
                    onChange={handleEditChange}
                    placeholder="Region"
                    required
                />
                <button type="submit">Update Profile</button>
                <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>
                    Cancel
                </button>
            </form>
            <button onClick={handleLogout} style={{ marginTop: "20px" }}>
                Logout
            </button>
        </div>
    );
};

export default ScholarProfile;