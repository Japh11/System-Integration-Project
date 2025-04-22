import React, { useState } from "react";
import axios from "axios";

const StaffLoginForm = () => {
    localStorage.setItem("name", response.data["name"]); // Add if name is returned

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Send login request to backend
            const response = await axios.post("http://localhost:8080/api/auth/login-staff", {
                email,
                password,
            });

            console.log("Login Response:", response.data); // 🔍 Debug API Response

            if (response.data["jwt-token"]) {
                // Store JWT token in localStorage
                localStorage.setItem("token", response.data["jwt-token"]);
                localStorage.setItem("role", "STAFF");

                // Check if staffId is available and store it
                if (response.data["staffId"]) {
                    localStorage.setItem("staffId", response.data["staffId"]); // ✅ Store staffId
                    console.log("✅ staffId stored:", response.data["staffId"]); // Debugging line
                } else {
                    console.error("❌ staffId is missing from API response");
                }

                alert("✅ Login successful");
                window.location.href = "/staff/dashboard"; // Redirect to staff dashboard
            } else {
                setError("Login failed. Invalid credentials.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Staff Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default StaffLoginForm;
