import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffApi from "../services/StaffApi";
import profilePlaceholder from "../assets/profiletemp.jpg";
import "./css/Profile.css"

const StaffProfile = () => {
    const navigate = useNavigate();
    const [currentStaff, setCurrentStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profilePicture: profilePlaceholder,
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchCurrentStaff = async () => {
            try {
                const staffId = localStorage.getItem("staffId");
                if (!staffId) throw new Error("No staff ID found");

                const staffData = await StaffApi.getAllStaff();
                const staff = staffData.find((s) => s.id === parseInt(staffId));
                if (staff) {
                    setCurrentStaff({
                        ...staff,
                        password: "",
                        profilePicture: staff.profilePicture || profilePlaceholder,
                    });
                }
            } catch (error) {
                console.error("Error fetching current staff details:", error);
            }
        };

        fetchCurrentStaff();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setCurrentStaff({ ...currentStaff, [name]: value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedStaff = { ...currentStaff };
     
            if (!updatedStaff.password) {
                delete updatedStaff.password; // Remove password if not updated
            }
            await StaffApi.updateStaff(currentStaff.id, currentStaff);
            alert("✅ Profile updated successfully!");
            navigate("/staff/dashboard");
        } catch (error) {
            alert(`❌ Error updating profile: ${error.message}`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setCurrentStaff({ ...currentStaff, profilePicture: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleUploadProfilePicture = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const response = await StaffApi.uploadProfilePicture(currentStaff.id, selectedFile);
            alert("✅ Profile picture uploaded successfully!");
            setCurrentStaff({ ...currentStaff, profilePicture: response.url });
        } catch (error) {
            alert(`❌ Error uploading profile picture: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/staff/login");
    };

    return (
        <div className="staff-profile-container">
            <h2 className="profile-title">Staff Profile</h2>

            {/* Profile Picture */}
            <div className="profile-image-section">
                <div className="profile-image-wrapper">
                    <img
                        src={currentStaff.profilePicture}
                        alt="Profile"
                        className="profile-image"
                    />
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUploadProfilePicture} className="upload-button">
                    Upload Picture
                </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="input-group">
                <label htmlFor="firstName" className="input-label">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={currentStaff.firstName}
                    onChange={handleProfileChange}
                    placeholder="Enter First Name"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                <label htmlFor="lastName" className="input-label">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={currentStaff.lastName}
                    onChange={handleProfileChange}
                    placeholder="Enter Last Name"
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
                    value={currentStaff.email}
                    onChange={handleProfileChange}
                    placeholder="Enter Email"
                    required
                    className="input-field"
                />
            </div>
            <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={currentStaff.password}
                        onChange={handleProfileChange}
                        placeholder="Enter New Password (leave blank to keep current password)"
                        className="input-field"
                    />
                </div>
            <div className="form-buttons">
                <button type="submit" className="primary-button">Update Profile</button>
                <button type="button" onClick={() => navigate("/staff/dashboard")} className="secondary-button">
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

export default StaffProfile;
