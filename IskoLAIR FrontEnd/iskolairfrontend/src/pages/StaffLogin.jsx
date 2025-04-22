import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/IskoLAIR_Logo.png";
import background from "../assets/background-image.png";
import "./css/ScholarLogin.css"; // For consistent styling
import "./css/StaffDashboard.css";

const StaffLoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login-staff", {
                email,
                password,
            });

            const data = response.data;
            console.log("✅ Staff Login Response:", data);

            if (data["jwt-token"]) {
                localStorage.setItem("token", data["jwt-token"]);
                localStorage.setItem("role", "STAFF");

                if (data["staffId"]) {
                    localStorage.setItem("staffId", data["staffId"]);
                }

                if (data["name"]) {
                    localStorage.setItem("name", data["name"]);
                }

                alert("✅ Login successful");
                navigate("/staff/dashboard");
            } else {
                setError("Login failed. Invalid credentials.");
            }
        } catch (err) {
            console.error("❌ Login Error:", err);
            setError(err.response?.data?.error || "Login failed. Please try again.");
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
                    <h2 className="login-title">Staff Log In</h2>

                    {error && <p className="error-message">{error}</p>}
                    {message ? (
                        <p className="message-text">{message}</p>
                    ) : (
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
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

                            {/*<a href="/forgot-password" className="forgot-password">Forgot Password?</a>*/}

                            <button type="submit" className="signin-button">Sign In</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default StaffLoginForm;
