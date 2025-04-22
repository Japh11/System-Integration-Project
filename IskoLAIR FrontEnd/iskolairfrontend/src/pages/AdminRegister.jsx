import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApi from "../services/AdminApi";
import "../pages/css/AdminRegister.css";
import logo from "../assets/IskoLAIR_Logo.png";
import { Eye, EyeOff } from "lucide-react";

const AdminRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AdminApi.registerAdmin({ email, password });
            localStorage.setItem("token", response["jwt-token"]);
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Registration failed");
        }
    };

    return (
        <div className="admin-register-page">
            <img src={logo} alt="Logo" className="admin-logo" />

            <div className="container">
                <div className="toggle-box">
                    <div className="toggle-panel toggle-right">
                        <h1>Welcome back, Admin!</h1>
                        <p>Already have an account?</p>
                        <button
                            className="btn-register"
                            onClick={() => navigate("/admin/login")}
                        >
                            Login
                        </button>
                    </div>
                </div>

                <div className="form register">
                    <h1>Create an Account</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
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

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
