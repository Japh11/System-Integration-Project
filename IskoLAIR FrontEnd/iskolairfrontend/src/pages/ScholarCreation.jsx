import React, { useState } from "react";
import ScholarApi from "../services/ScholarApi";
import { useNavigate } from "react-router-dom";
import "../pages/css/ScholarCreation.css"; // Import your CSS file
import StaffApi from "../services/StaffApi";

const ScholarCreation = () => {
    const navigate = useNavigate();
    const [scholar, setScholar] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        batchYear: "",
        accountNo: "",
        spasNo: "",
        sex: "",
        levelYear: "",
        school: "",
        course: "",
        status: "",
        typeOfScholarship: "",
        birthday: "",
        contactNumber: "",
        email: "",
        brgy: "",
        municipality: "",
        province: "",
        district: "",
        region: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScholar({ ...scholar, [name]: value });
    };

    const handleCreateScholar = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await StaffApi.createScholar(scholar); // Call the API to register the scholar
            setMessage("Scholar created successfully!");
            navigate("/scholars"); // Redirect to the staff dashboard 
            setScholar({
                lastName: "",   
                firstName: "",
                middleName: "",
                batchYear: "",
                accountNo: "",
                spasNo: "",
                sex: "",
                levelYear: "",
                school: "",
                course: "",
                status: "",
                typeOfScholarship: "",
                birthday: "",
                contactNumber: "",
                email: "",
                brgy: "",
                municipality: "",
                province: "",
                district: "",
                region: "",
                password: "",
            });
        } catch (error) {
            console.error("Error creating scholar:", error.message);
            setError(error.message || "Failed to create scholar");
        }
    };

    return (
        <div className="scholar-form-container">
            <h3>Create Scholar</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleCreateScholar}>
                <div className="input-group">
                    <input type="text" name="lastName" placeholder="Last Name" value={scholar.lastName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="firstName" placeholder="First Name" value={scholar.firstName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="middleName" placeholder="Middle Name" value={scholar.middleName} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <input type="number" name="batchYear" placeholder="Batch Year" value={scholar.batchYear} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="accountNo" placeholder="Account No" value={scholar.accountNo} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="spasNo" placeholder="Spas No" value={scholar.spasNo} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="sex" placeholder="Sex" value={scholar.sex} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="levelYear" placeholder="Level/Year" value={scholar.levelYear} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="school" placeholder="School" value={scholar.school} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="course" placeholder="Course" value={scholar.course} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="status" placeholder="Status" value={scholar.status} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="typeOfScholarship" placeholder="Type of Scholarship" value={scholar.typeOfScholarship} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="date" name="birthday" placeholder="Birthday" value={scholar.birthday} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="contactNumber" placeholder="Contact Number" value={scholar.contactNumber} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Scholar Email" value={scholar.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="password" name="password" placeholder="Scholar Password" value={scholar.password} onChange={handleChange} required />
                </div>
    
                <h4>Address</h4>
                <div className="input-group">
                    <input type="text" name="brgy" placeholder="Barangay" value={scholar.brgy} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="municipality" placeholder="Municipality" value={scholar.municipality} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="province" placeholder="Province" value={scholar.province} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="district" placeholder="District" value={scholar.district} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="region" placeholder="Region" value={scholar.region} onChange={handleChange} required />
                </div>
    
                <button className="submit-button" type="submit">Create Scholar</button>
            </form>
        </div>
    );
    
};

export default ScholarCreation;