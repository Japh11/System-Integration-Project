import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ScholarChangePasswordApi from "../services/ScholarChangePasswordApi";

const ScholarChangePassword = () => {
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
            setTimeout(() => navigate("/scholar/login"), 1000); // Redirect after success
        } catch (err) {
            setError("Failed to reset password. Token may be invalid or expired.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ScholarChangePassword;