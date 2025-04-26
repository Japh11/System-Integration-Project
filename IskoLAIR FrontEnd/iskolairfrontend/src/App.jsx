import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import LandingPage from "./pages/LandingPage";
import ScholarLogin from "./pages/ScholarLogin";
import ScholarDashboard from "./pages/ScholarDashboard";
import StaffLogin from "./pages/StaffLogin";  
import StaffDashboard from "./pages/StaffDashboard"; 
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ScholarChangePassword from "./pages/ScholarChangePassword";
import AnnouncementForm from "./components/AnnouncementForm";
import StaffProfile from "./pages/StaffProfile";
import ScholarList from "./pages/ScholarList";
import ScholarCreation from "./pages/ScholarCreation";
import ScholarProfile from "./pages/ScholarProfile";
import Announcement from "./pages/Announcement"; 
import Assignment from "./pages/Assignment";
import AssignmentForm from "./components/AssignmentForm";
import ChatApi from "./services/ChatApi";  
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import ScholarResources from "./pages/ScholarResources";
import ScholarAnnouncement from "./pages/ScholarAnnouncement";
import ScholarAssignment from "./pages/ScholarAssignment";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/Faq";


const App = () => {
    return (
        <Routes>
            <Route path="/register" element={<AdminRegister />} />
            <Route path="/scholar/change-password" element={<ScholarChangePassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/scholar/login" element={<ScholarLogin />} />
            <Route path="/staff/login" element={<StaffLogin />} />  
            
            {/* Home route is still the LandingPage */}
            <Route path="/" element={<LandingPage />} />  {/* This keeps the LandingPage accessible */}

            {/* Add other routes */}
            <Route path="/announcement-form" element={<AnnouncementForm />} />
            <Route path="/announcement-form/:id" element={<AnnouncementForm />} />
            <Route path="/staff/profile" element={<StaffProfile />} />
            <Route path="/scholars" element={<ScholarList />} />
            <Route path="/scholar-creation" element={<ScholarCreation />} />
            <Route path="/scholar/profile" element={<ScholarProfile />} />
            <Route path="/scholar/resources" element={<ScholarResources />} />
            <Route path="/scholar/announcements" element={<ScholarAnnouncement />} />
            <Route path="/scholar/assignments" element={<ScholarAssignment />} />
            <Route path="scholar/aboutus" element={<AboutUs />} />
            <Route path="/FAQ" element={<FAQ />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/announcements" element={<Announcement />} /> 
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/assignments/create" element={<AssignmentForm />} />
            <Route path="/Smessages" element={<Chat />} />
            <Route path="/messages" element={<Chat />} />
            <Route path="/resources" element={<Resources />} />



            {/* Protect routes */}
            <Route element={<ProtectedRoute role="ADMIN" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute role="SCHOLAR" />}>
                <Route path="/scholar/dashboard" element={<ScholarDashboard />} />
            </Route>

            <Route element={<ProtectedRoute role="STAFF" />}> 
                <Route path="/staff/dashboard" element={<StaffDashboard />} />  
            </Route>
        </Routes>
    );
};

export default App;