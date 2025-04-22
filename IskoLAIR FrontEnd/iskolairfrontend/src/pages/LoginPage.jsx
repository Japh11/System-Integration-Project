import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { "jwt-token": token, role, message } = response.data;
            if (message) {
                // First time login, show message and disable form
                setMessage(message);
            } else {
                localStorage.setItem("token", token);
                localStorage.setItem("role", role.toUpperCase());
                navigate(`/${role.toLowerCase()}/dashboard`);
            }
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message ? (
                <p>{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            )}
            <button onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
        </div>
    );
};

export default LoginPage;