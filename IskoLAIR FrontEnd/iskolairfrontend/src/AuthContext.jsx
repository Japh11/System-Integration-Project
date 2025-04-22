import { createContext, useState, useEffect } from "react";
import { login } from "../api/ScholarApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = async (username, password) => {
        try {
            const response = await login(username, password);
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
