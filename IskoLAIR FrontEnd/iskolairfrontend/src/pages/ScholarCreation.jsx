import React, { useState } from "react";
import ScholarApi from "../services/ScholarApi";
import { useNavigate } from "react-router-dom";
import StaffApi from "../services/StaffApi";
import logo from "../assets/IskoLAIR_Logo.png";
import "../pages/css/ScholarCreation.css";

const ScholarCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    try {
      await StaffApi.createScholar(scholar);
      setMessage("Scholar created successfully!");
      navigate("/scholars");
    } catch (error) {
      console.error("Error creating scholar:", error.message);
      setError(error.message || "Failed to create scholar");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <img src={logo} alt="IskoLAIR Logo" className="logo" />
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
          onClick={() => navigate("/staff/profile")}
        />
      </div>

      <div className="admin-dashboard-content">
        <button className="back-bttn" onClick={() => navigate("/scholars")}>←</button>
        <div className="modal-content">
          <h2>Create Scholar</h2>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="step-indicator">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`circle ${currentStep === step ? "active" : ""}`}>{step}</div>
                {step < 4 && <div className={`line ${currentStep > step ? "active" : ""}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleCreateScholar} className="create-form">
            {currentStep === 1 && (
              <>
                <h3 className="step-title">Personal Details</h3>
                <div className="form-row">
                  <div className="form-group"><label>Last Name</label><input name="lastName" value={scholar.lastName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>First Name</label><input name="firstName" value={scholar.firstName} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Middle Name</label><input name="middleName" value={scholar.middleName} onChange={handleChange} /></div>
                  <div className="form-group"><label>Sex</label><input name="sex" value={scholar.sex} onChange={handleChange} required /></div>
                  <div className="form-group short"><label>Birthday</label><input type="date" name="birthday" value={scholar.birthday} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Contact Number</label><input name="contactNumber" value={scholar.contactNumber} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Email</label><input type="email" name="email" value={scholar.email} onChange={handleChange} required /></div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3 className="step-title">Address</h3>
                <div className="form-row">
                  <div className="form-group"><label>Barangay</label><input name="brgy" value={scholar.brgy} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Municipality</label><input name="municipality" value={scholar.municipality} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Province</label><input name="province" value={scholar.province} onChange={handleChange} required /></div>
                  <div className="form-group"><label>District</label><input name="district" value={scholar.district} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Region</label><input name="region" value={scholar.region} onChange={handleChange} required /></div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h3 className="step-title">Academic Info</h3>
                <div className="form-row">
                  <div className="form-group"><label>Batch Year</label><input type="number" name="batchYear" value={scholar.batchYear} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Account No</label><input name="accountNo" value={scholar.accountNo} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Spas No</label><input name="spasNo" value={scholar.spasNo} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Level Year</label><input name="levelYear" value={scholar.levelYear} onChange={handleChange} required /></div>
                  <div className="form-group"><label>School</label><input name="school" value={scholar.school} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Course</label><input name="course" value={scholar.course} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Status</label><input name="status" value={scholar.status} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Type of Scholarship</label><input name="typeOfScholarship" value={scholar.typeOfScholarship} onChange={handleChange} required /></div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h3 className="step-title">Security Info</h3>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={scholar.password} onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="step-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </button>
              ) : (
                <button type="submit" className="submit-button">
                  Create Scholar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScholarCreation;