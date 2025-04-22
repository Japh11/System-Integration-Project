import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScholarApi from "../services/ScholarApi";
import EditIcon from "@mui/icons-material/Edit";
import "../pages/css/AdminDashboard.css";
import "../pages/css/ScholarList.css";
import logo from "../assets/IskoLAIR_Logo.png";

const ScholarList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scholars, setScholars] = useState([]);
  const [typeOfScholarship, setTypeOfScholarship] = useState("All");
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const state = location.state || {};
    setTypeOfScholarship(state.typeOfScholarship || "All");
    fetchScholars();
  }, [location.state]);

  const fetchScholars = async () => {
    try {
      const data = await ScholarApi.getAllScholars();
      setScholars(data);
    } catch (err) {
      console.error("Error fetching scholars:", err);
    }
  };

  const filteredScholars =
    typeOfScholarship === "All"
      ? scholars
      : scholars.filter((s) => s.typeOfScholarship === typeOfScholarship);

  const handleScholarClick = (scholar) => {
    setSelectedScholar({ ...scholar });
    setMessage("");
    setCurrentStep(1);
  };

  const handleChange = (e) => {
    setSelectedScholar({ ...selectedScholar, [e.target.name]: e.target.value });
  };

  const handleUpdateScholar = async (e) => {
    e.preventDefault();
    try {
      await ScholarApi.updateScholar(selectedScholar.id, selectedScholar);
      setMessage("Scholar updated successfully!");
      setSelectedScholar(null);
      fetchScholars();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleArchiveScholar = async (id) => {
    await ScholarApi.archiveScholar(id);
    fetchScholars();
  };

  const handleReactivateScholar = async (id) => {
    await ScholarApi.reactivateScholar(id);
    fetchScholars();
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <img src={logo} alt="Logo" className="landingpage-logo" />
        <span style={{ color: "red", cursor: "pointer" }} onClick={() => navigate("/staff/profile")}>
          Profile
        </span>
      </div>

      <div className="admin-dashboard-content">
        <div className="Types-Scholars">
          {["All", "RA7687", "Merit", "JLSS"].map((type) => (
            <div key={type} className="filter-card" onClick={() => setTypeOfScholarship(type)}>
              <h3>{type}</h3>
              <p>{scholars.filter((s) => type === "All" || s.typeOfScholarship === type).length}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/staff/dashboard")} className="dashboard-button">Back to Dashboard</button>

        <div className="table-section-header">
          <h2>Scholar List</h2>
          <button className="create-button" onClick={() => navigate("/scholar-creation")}>+ Add Scholar</button>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScholars.map((s) => (
              <tr key={s.id}>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.archived ? "Archived" : "Active"}</td>
                <td style={{ textAlign: "right" }}>
                  <EditIcon fontSize="small" style={{ cursor: "pointer" }} onClick={() => handleScholarClick(s)} />
                  {s.archived ? (
                    <button className="reactivate-button" onClick={() => handleReactivateScholar(s.id)}>Reactivate</button>
                  ) : (
                    <button className="archive-button" onClick={() => handleArchiveScholar(s.id)}>Archive</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedScholar && (
  <div className="modal-overlay">
    <div className="modal-content">
      <span className="close" onClick={() => setSelectedScholar(null)}>&times;</span>
      <h2>Edit Scholar</h2>

      {/* Step Indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`circle ${currentStep === step ? "active" : ""}`}>{step}</div>
            {step < 3 && <div className={`line ${currentStep > step ? "active" : ""}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleUpdateScholar} className="create-form">
        {currentStep === 1 && (
          <>
            <h3 className="step-title">Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={selectedScholar.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={selectedScholar.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Middle Name</label>
                <input name="middleName" value={selectedScholar.middleName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <input name="sex" value={selectedScholar.sex} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Birthday</label>
                <input type="date" name="birthday" value={selectedScholar.birthday} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input name="contactNumber" value={selectedScholar.contactNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={selectedScholar.email} onChange={handleChange} required />
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="step-title">Address</h3>
            <div className="form-row">
              <div className="form-group"><label>Barangay</label><input name="brgy" value={selectedScholar.brgy} onChange={handleChange} required /></div>
              <div className="form-group"><label>Municipality</label><input name="municipality" value={selectedScholar.municipality} onChange={handleChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Province</label><input name="province" value={selectedScholar.province} onChange={handleChange} required /></div>
              <div className="form-group"><label>District</label><input name="district" value={selectedScholar.district} onChange={handleChange} required /></div>
              <div className="form-group"><label>Region</label><input name="region" value={selectedScholar.region} onChange={handleChange} required /></div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h3 className="step-title">Academic Info</h3>
            <div className="form-row">
              <div className="form-group"><label>Batch Year</label><input name="batchYear" value={selectedScholar.batchYear} onChange={handleChange} required /></div>
              <div className="form-group"><label>Account No</label><input name="accountNo" value={selectedScholar.accountNo} onChange={handleChange} required /></div>
              <div className="form-group"><label>Spas No</label><input name="spasNo" value={selectedScholar.spasNo} onChange={handleChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Level Year</label><input name="levelYear" value={selectedScholar.levelYear} onChange={handleChange} required /></div>
              <div className="form-group"><label>School</label><input name="school" value={selectedScholar.school} onChange={handleChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Course</label><input name="course" value={selectedScholar.course} onChange={handleChange} required /></div>
              <div className="form-group"><label>Status</label><input name="status" value={selectedScholar.status} onChange={handleChange} required /></div>
              <div className="form-group"><label>Type of Scholarship</label><input name="typeOfScholarship" value={selectedScholar.typeOfScholarship} onChange={handleChange} required /></div>
            </div>
          </>
        )}

        <div className="step-navigation">
          {currentStep > 1 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
          {currentStep < 3 ? (
            <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>
          ) : (
            <button type="submit" className="submit-button">Save</button>
          )}
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ScholarList;
