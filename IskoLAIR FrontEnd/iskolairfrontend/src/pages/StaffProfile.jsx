import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffApi from "../services/StaffApi";

const StaffProfile = () => {
    const navigate = useNavigate();
    const [currentStaff, setCurrentStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const fetchCurrentStaff = async () => {
            try {
                const staffId = localStorage.getItem("staffId");
                if (!staffId) throw new Error("No staff ID found");

                const staffData = await StaffApi.getAllStaff();
                const staff = staffData.find((s) => s.id === parseInt(staffId));
                if (staff) setCurrentStaff(staff);
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
            await StaffApi.updateStaff(currentStaff.id, currentStaff);
            alert("✅ Profile updated successfully!");
            navigate("/staff/dashboard");
        } catch (error) {
            alert(`❌ Error updating profile: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("staffId");
        localStorage.removeItem("name"); // just in case you saved it
        localStorage.clear();
        navigate("/staff/login"); // redirect to login
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3>Profile Settings</h3>
            <form onSubmit={handleUpdateProfile}>
                <input
                    type="text"
                    name="firstName"
                    value={currentStaff.firstName}
                    onChange={handleProfileChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={currentStaff.lastName}
                    onChange={handleProfileChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={currentStaff.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={currentStaff.password}
                    onChange={handleProfileChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Update Profile</button>
                <button type="button" onClick={() => navigate("/staff/dashboard")} style={{ marginLeft: "10px" }}>
                    Cancel
                </button>
            </form>

            {/* 🚪 Logout Button */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleLogout} style={{ backgroundColor: "#f44336", color: "#fff" }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default StaffProfile;
