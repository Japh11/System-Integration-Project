import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import profilePlaceholder from "../assets/profiletemp.jpg";
import "./css/Profile.css"; 

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
        typeOfScholarship: "",
        birthday: "",
        contactNumber: "",
        email: "",
        brgy: "",
        municipality: "",
        province: "",
        district: "",
        region: "",
        password: "",
        profilePicture: profilePlaceholder, // Default to placeholder
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScholarDetails = async () => {
            try {
                const scholarId = localStorage.getItem("scholarId");
                if (!scholarId) throw new Error("No scholar ID found");

                const scholarData = await ScholarApi.getScholarDetails();
                setScholar({
                    ...scholarData,
                    profilePicture: scholarData.profilePicture || profilePlaceholder,
                });
            } catch (error) {
                console.error("Error fetching scholar details:", error.message);
                setError("Failed to fetch scholar details. Please log in again.");
            }
        };

        fetchScholarDetails();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setScholar((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateScholar = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await ScholarApi.updateScholar(scholar.id, scholar);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating scholar profile:", error.message);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setScholar({ ...scholar, profilePicture: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleUploadProfilePicture = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const response = await ScholarApi.uploadProfilePicture(scholar.id, selectedFile);
            alert("✅ Profile picture uploaded successfully!");
            setScholar({ ...scholar, profilePicture: response.url });
        } catch (error) {
            alert(`❌ Error uploading profile picture: ${error.message}`);
        }
    };

    const handleCancel = () => {
        navigate("/scholar/dashboard");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/scholar/login");
    };

    return (
        <div className="scholar-profile-container">
            <h2 className="profile-title">Scholar Profile</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Profile Picture Section */}
            <div className="profile-image-section">
                <div className="profile-image-wrapper">
                    <img
                        src={scholar.profilePicture}
                        alt="Profile"
                        className="profile-image"
                    />
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUploadProfilePicture} className="upload-button">
                    Upload Picture
                </button>
            </div>

            <form onSubmit={handleUpdateScholar} className="profile-form">
            <div className="scholar-input-group">
                <label htmlFor="lastName" className="input-label">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={scholar.lastName || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Last Name"
                    required
                    className="input-field"
                />
            </div>
            <div className="scholar-input-group">
                <label htmlFor="firstName" className="input-label">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={scholar.firstName || ""}
                    onChange={handleEditChange}
                    placeholder="Enter First Name"
                    required
                    className="input-field"
                />
            </div>
            <div className="scholar-input-group">
                <label htmlFor="middleName" className="input-label">Middle Name</label>
                <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={scholar.middleName || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Middle Name"
                    className="input-field"
                />
            </div>
            <div className="scholar-input-group">
                <label htmlFor="batchYear" className="input-label">Batch Year</label>
                <input
                    type="number"
                    id="batchYear"
                    name="batchYear"
                    value={scholar.batchYear || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Batch Year"
                    required
                    className="input-field"
                />
            </div>
            <div className="scholar-input-group">
                <label htmlFor="accountNo" className="input-label">Account No</label>
                <input
                    type="text"
                    id="accountNo"
                    name="accountNo"
                    value={scholar.accountNo || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Account No"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="spasNo" className="input-label">SPAS No</label>
                <input
                    type="text"
                    id="spasNo"
                    name="spasNo"
                    value={scholar.spasNo || ""}
                    onChange={handleEditChange}
                    placeholder="Enter SPAS No"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="sex" className="input-label">Sex</label>
                <input
                    type="text"
                    id="sex"
                    name="sex"
                    value={scholar.sex || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Sex"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="levelYear" className="input-label">Level/Year</label>
                <input
                    type="text"
                    id="levelYear"
                    name="levelYear"
                    value={scholar.levelYear || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Level/Year"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="school" className="input-label">School</label>
                <input
                    type="text"
                    id="school"
                    name="school"
                    value={scholar.school || ""}
                    onChange={handleEditChange}
                    placeholder="Enter School"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="course" className="input-label">Course</label>
                <input
                    type="text"
                    id="course"
                    name="course"
                    value={scholar.course || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Course"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="status" className="input-label">Status</label>
                <input
                    type="text"
                    id="status"
                    name="status"
                    value={scholar.status || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Status"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="typeOfScholarship" className="input-label">Type Of Scholarship</label>
                <input
                    type="text"
                    id="typeOfScholarship"
                    name="typeOfScholarship"
                    value={scholar.typeOfScholarship || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Type Of Scholarship"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="birthday" className="input-label">Birthday</label>
                <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={scholar.birthday || ""}
                    onChange={handleEditChange}
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="contactNumber" className="input-label">Contact Number</label>
                <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={scholar.contactNumber || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Contact Number"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="email" className="input-label">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={scholar.email || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Email"
                    required
                    className="input-field"
                />
            </div>
            <div className="form-buttons">
                <button type="submit" className="primary-button">Update Profile</button>
                <button type="button" onClick={handleCancel} className="secondary-button">
                    Cancel
                </button>
            </div>
        </form>

            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default ScholarProfile;