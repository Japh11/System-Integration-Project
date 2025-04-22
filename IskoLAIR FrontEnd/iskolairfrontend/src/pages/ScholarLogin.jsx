import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import logo from "../assets/IskoLAIR_Logo.png"; 
import background from "../assets/background-image.png";
import "./css/ScholarLogin.css";

const ScholarLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
    
        try {
            const response = await ScholarApi.loginScholar({ email, password });
            console.log("Login Response:", response);
    
            const data = response.data || response;
    
            if (!data || (!data["jwt-token"] && !data.message)) {
                throw new Error("Invalid response from server.");
            }
    
            if (data.message) {
                setMessage(data.message);
            } else {
                if (!data.role) {
                    throw new Error("User role is missing in the response.");
                }
    
                // Save the necessary data to localStorage
                localStorage.setItem("token", data["jwt-token"]);
                localStorage.setItem("role", data.role.toUpperCase());
                localStorage.setItem("scholarId", data.scholarId); // Save scholarId
                localStorage.setItem("name", data.firstName + ' ' + data.lastName); // Store name
    
                // Navigate to the appropriate page based on the role
                navigate(`/${data.role.toLowerCase()}/dashboard`);
            }
        } catch (err) {
            console.error("Login error:", err.message || err);
            setError(err.message || "Login failed. Please check your credentials.");
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
                    <h2 className="login-title">Log In</h2>

                    {error && <p className="error-message">{error}</p>}
                    {message ? (
                        <p className="message-text">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <img
                                    src="https://icon-library.com/images/show-password-icon/show-password-icon-12.jpg"
                                    alt="Toggle Password"
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>

                            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>

                            <button type="submit" className="signin-button">Sign In</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default ScholarLogin;
