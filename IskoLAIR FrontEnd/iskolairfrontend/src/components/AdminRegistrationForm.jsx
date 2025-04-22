import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApi from "../services/AdminApi";

const AdminRegistrationForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
        <div>
            <h2>Admin Registration</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default AdminRegistrationForm;
