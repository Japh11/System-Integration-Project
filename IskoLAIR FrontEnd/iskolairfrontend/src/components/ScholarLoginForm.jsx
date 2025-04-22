import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";

const ScholarLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ScholarApi.loginScholar({ email, password });
            localStorage.setItem("token", response["jwt-token"]);
            navigate("/scholar/dashboard");
        } catch (err) {
            setError("Login failed");
        }
    };

    return (
        <div>
            <h2>Scholar Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default ScholarLoginForm;
