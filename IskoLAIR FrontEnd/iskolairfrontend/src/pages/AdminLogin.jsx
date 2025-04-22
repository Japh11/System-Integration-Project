import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApi from "../services/AdminApi";
import "../pages/css/AdminLogin.css";
import logo from "../assets/IskoLAIR_Logo.png";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AdminApi.loginAdmin({ email, password });
            console.log("Login Response:", response);

            if (!response["jwt-token"]) {
                throw new Error("Invalid response from server");
            }

            localStorage.setItem("token", response["jwt-token"]);
            localStorage.setItem("role", "ADMIN");
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="admin-login-page">
            <img src={logo} alt="Logo" className="admin-logo" />

            <div className="container">
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Admin!</h1>
                        <p>Don't have an account?</p>
                        <button
                            className="btn-register"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <div className="form-box login">
                    <h1>Login</h1>
                    {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <h3>Email</h3>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <h3>Password</h3>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
                            </span>
                        </div>

                        <h4>Forgot Password?</h4>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
