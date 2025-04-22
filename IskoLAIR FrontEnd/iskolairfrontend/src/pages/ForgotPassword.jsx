import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScholarChangePasswordApi from "../services/ScholarChangePasswordApi";
import logo from "../assets/IskoLAIR_Logo.png"; 
import background from "../assets/background-image.png";
import "./css/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await ScholarChangePasswordApi.requestPasswordReset(email);
            setMessage(response);
        } catch (err) {
            setError(err.response?.data || "Error sending password reset email.");
        }
    };

    return (
        <>
        {/* Header */}
        <div className="forgot-header">
            <img src={logo} alt="IskoLAIR Logo" className="forgot-header-logo" />
            <div className="forgot-header-right">
                <h5>official DOST</h5>
            </div>
        </div>                
        
        {/* Hero Section */}
        <div className="forgot-hero" style={{ backgroundImage: `url(${background})` }}>
            <div className="forgot-container">
                <img src={logo} alt="DOST Logo" className="forgot-logo" />
                <h2 className="forgot-title">Forgot Password</h2>
                
                {message && <p className="forgot-success">{message}</p>}
                {error && <p className="forgot-error">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="forgot-input"
                    />
                    <button type="submit" className="forgot-btn">Send Reset Link</button>
                </form>

                {/* Back to Login as a Text Link */}
                <p className="forgot-back" onClick={() => navigate("/scholar/login")}>
                    Back to Login
                </p>
            </div>
        </div>            
        </>
    );
};

export default ForgotPassword;
