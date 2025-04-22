import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) return <Navigate to="/" />;
    if (role && userRole !== role) return <Navigate to="/" />; // Role-based protection

    return <Outlet />;
};

export default ProtectedRoute;
