import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ScholarChangePasswordApi from "../services/ScholarChangePasswordApi";
import logo from "../assets/IskoLAIR_Logo.png";
import background from "../assets/background-image.png";
import "../pages/css/ScholarLogin.css"; // Reusing scholar styles for consistency


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (!token) {
            setError("Missing reset token!");
            return;
        }

        try {
            const response = await ScholarChangePasswordApi.resetPassword(token, newPassword);
            setMessage(response);
            setTimeout(() => navigate("/scholar/login"), 1000); // ✅ Redirect after success
        } catch (err) {
            setError("Failed to reset password. Token may be invalid or expired.");
        }
    };

    return (
        <>
            {/* Header */}
            <div className="scholar-header">
                <img src={logo} alt="IskoLAIR Logo" className="scholar-logo" />
                <div className="header-right">
                    <h5>official DOST</h5>
                </div>
            </div>

            {/* Hero Section */}
            <div className="scholar-hero" style={{ backgroundImage: `url(${background})` }}>
                <div className="scholar-login-section">
                    <img src={logo} alt="DOST Logo" className="login-logo" />
                    <h2 className="login-title">Reset Password</h2>

                    {message && <p className="message-text">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="signin-button">Reset Password</button>
                    </form>
                </div>
            </div>
        </>
    );
    
};

export default ResetPassword;