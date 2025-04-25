import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon   from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ScholarApi from "../services/ScholarApi";
import StaffApi   from "../services/StaffApi";
import "../pages/css/AdminDashboard.css";
import logo from "../assets/IskoLAIR_Logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // — initial empty objects for forms
  const emptyScholar = {
    id: null,
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
  };
  const emptyStaff = {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  // — state
  const [scholars, setScholars]         = useState([]);
  const [staffList, setStaffList]       = useState([]);
  const [showScholarForm, setShowScholarForm] = useState(false);
  const [showStaffForm, setShowStaffForm]     = useState(false);
  const [scholarForm, setScholarForm]   = useState(emptyScholar);
  const [staffForm, setStaffForm]       = useState(emptyStaff);
  const [message, setMessage]           = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // — load on mount
  useEffect(() => {
    fetchScholars();
    fetchStaff();
  }, []);

  async function fetchScholars() {
    try {
      const data = await ScholarApi.getAllScholars();
      setScholars(data);
    } catch (e) {
      console.error("Failed to load scholars:", e);
    }
  }

  async function fetchStaff() {
    try {
      const data = await StaffApi.getAllStaff();
      setStaffList(data);
    } catch (e) {
      console.error("Failed to load staff:", e);
    }
  }

  // — CRUD Handlers for Scholars
  const openScholarModal = sch => {
    setScholarForm(sch || emptyScholar);
    setCurrentStep(1);
    setMessage("");
    setShowScholarForm(true);
  };

  const handleScholarChange = e => {
    setScholarForm({ ...scholarForm, [e.target.name]: e.target.value });
  };

  const handleSaveScholar = async (e) => {
    e.preventDefault();
  
    const isEditing = !!scholarForm.id;
    const isAtFinalStep = (isEditing && currentStep === 3) || (!isEditing && currentStep === 4);
  
    if (!isAtFinalStep) return;
  
    try {
      const updatedScholar = { ...scholarForm };
  
      if (scholarForm.id) {
        delete updatedScholar.password;
      }
  
      if (scholarForm.id) {
        await ScholarApi.updateScholar(scholarForm.id, updatedScholar);
        setMessage("✅ Scholar updated!");
      } else {
        await ScholarApi.registerScholar(updatedScholar);
        setMessage("✅ Scholar created!");
      }
  
      setShowScholarForm(false);
      fetchScholars();
    } catch (err) {
      console.error(err);
      setMessage("❌ Save failed");
    }
  };
  

  const handleArchiveScholar = async id => {
    if (!window.confirm("Archive this scholar?")) return;
    try {
      await ScholarApi.archiveScholar(id);
      fetchScholars();
    } catch (e) {
      console.error("Archive failed:", e);
    }
  };
  
  const handleReactivateScholar = async id => {
    try {
      await ScholarApi.reactivateScholar(id);
      fetchScholars();
    } catch (e) {
      console.error("Reactivation failed:", e);
    }
  };

  // — CRUD Handlers for Staff
  const openStaffModal = st => {
    setStaffForm(st || emptyStaff);
    setShowStaffForm(true);
  };

  const handleStaffChange = e => {
    setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
  };

  const handleSaveStaff = async e => {
    e.preventDefault();
    try {
      const updatedStaff = { ...staffForm };

        // Exclude the password field if updating an existing staff
        if (staffForm.id) {
            delete updatedStaff.password;
        }
      if (staffForm.id) {
        await StaffApi.updateStaff(staffForm.id, updatedStaff);
        alert("✅ Staff updated!");
      } else {
        await StaffApi.registerStaff(updatedStaff);
        alert("✅ Staff created!");
      }
      setShowStaffForm(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  const handleArchiveStaff = async (id) => {
    if (!window.confirm("Archive this staff?")) return;
    try {
      await StaffApi.archiveStaff(id);
      fetchStaff();
    } catch (e) {
      console.error("Archive failed:", e);
    }
  };
  
  const handleReactivateStaff = async (id) => {
    try {
      await StaffApi.reactivateStaff(id);
      fetchStaff();
    } catch (e) {
      console.error("Reactivate failed:", e);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-dashboard-header">
        <img src={logo} alt="Logo" className="landingpage-logo" />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h1>Dashboard</h1>
      <div className="admin-dashboard-content">

        {/* Scholars Section */}
        <div className="table-section">
          <div className="table-section-header">
            <h2>Scholars List</h2>
            <button 
              className="create-button" 
              onClick={() => openScholarModal(null)}
            >
              + Add Scholar
            </button>
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
              {scholars.map(s => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.archived ? "Archived" : "Active"}</td>
                  <td style={{ textAlign: "right" }}>
                    <EditIcon
                      style={{ cursor: "pointer", marginRight: 8 }}
                      fontSize="small"
                      onClick={() => openScholarModal(s)}
                    />
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
        </div>

        {/* Staff Section */}
        <div className="table-section">
          <div className="table-section-header">
            <h2>Staff List</h2>
            <button 
              className="create-button" 
              onClick={() => openStaffModal(null)}
            >
              + Add Staff
            </button>
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
            {staffList.map(st => (
                <tr key={st.id}>
                  <td>{st.firstName} {st.lastName}</td>
                  <td>{st.email}</td>
                  <td>{st.archived ? "Archived" : "Active"}</td>
                  <td style={{ textAlign: "right" }}>
                    <EditIcon 
                      style={{ cursor: "pointer", marginRight: 8 }} 
                      fontSize="small" 
                      onClick={() => openStaffModal(st)} 
                    />
                    {st.archived ? (
                      <button className="reactivate-button" onClick={() => handleReactivateStaff(st.id)}>Reactivate</button>
                    ) : (
                      <button className="archive-button" onClick={() => handleArchiveStaff(st.id)}>Archive</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* --- Scholar Modal --- */}
      {showScholarForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => setShowScholarForm(false)}>&times;</span>
            <h2>{scholarForm.id ? "Edit Scholar" : "Create Scholar"}</h2>
            {message && <p className="success-message">{message}</p>}
            <div className="step-indicator">
              {[1, 2, 3, 4].map(num => (
                <React.Fragment key={num}>
                  <div className={`circle ${currentStep === num ? 'active' : ''}`}>{num}</div>
                  {num < 4 && <div className={`line ${currentStep >= num + 1 ? 'active' : ''}`}></div>}
                </React.Fragment>
              ))}
            </div>
            <form onSubmit={handleSaveScholar} className="create-form">
            {currentStep === 1 && (
                <>
                  <h3 className="step-title">Personal Details</h3>
                  <div className="form-row">
                    <div className="form-group"><label>Last Name</label><input name="lastName" value={scholarForm.lastName} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>First Name</label><input name="firstName" value={scholarForm.firstName} onChange={handleScholarChange} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Middle Name</label><input name="middleName" value={scholarForm.middleName} onChange={handleScholarChange} /></div>
                    <div className="form-group short"><label>Sex</label><input name="sex" value={scholarForm.sex} onChange={handleScholarChange} required /></div>
                    <div className="form-group short"><label>Birthday</label><input type="date" name="birthday" value={scholarForm.birthday} onChange={handleScholarChange} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Contact Number</label><input name="contactNumber" value={scholarForm.contactNumber} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={scholarForm.email} onChange={handleScholarChange} required /></div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h3 className="step-title">Address Info</h3>
                  <div className="form-row">
                    <div className="form-group"><label>Barangay</label><input name="brgy" value={scholarForm.brgy} onChange={handleScholarChange} /></div>
                    <div className="form-group"><label>Municipality</label><input name="municipality" value={scholarForm.municipality} onChange={handleScholarChange} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Province</label><input name="province" value={scholarForm.province} onChange={handleScholarChange} /></div>
                    <div className="form-group"><label>District</label><input name="district" value={scholarForm.district} onChange={handleScholarChange} /></div>
                    <div className="form-group"><label>Region</label><input name="region" value={scholarForm.region} onChange={handleScholarChange} /></div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h3 className="step-title">Academic Info</h3>
                  <div className="form-row">
                    <div className="form-group"><label>Batch Year</label><input type="number" name="batchYear" value={scholarForm.batchYear} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>Account No.</label><input name="accountNo" value={scholarForm.accountNo} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>SPAS No.</label><input name="spasNo" value={scholarForm.spasNo} onChange={handleScholarChange} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Level/Year</label><input name="levelYear" value={scholarForm.levelYear} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>School</label><input name="school" value={scholarForm.school} onChange={handleScholarChange} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Course</label><input name="course" value={scholarForm.course} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>Status</label><input name="status" value={scholarForm.status} onChange={handleScholarChange} required /></div>
                    <div className="form-group"><label>Type of Scholarship</label><input name="typeOfScholarship" value={scholarForm.typeOfScholarship} onChange={handleScholarChange} /></div>
                  </div>
                </>
              )}

              {currentStep === 4 && !scholarForm.id && (
                <>
                  <h3 className="step-title">Security Info</h3>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={scholarForm.password}
                      onChange={handleScholarChange}
                      required
                    />
                  </div>
                </>
              )}


            <div className="step-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </button>
              )}

              {!scholarForm.id && currentStep < 4 && (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </button>
              )}

              {scholarForm.id && currentStep < 3 && (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </button>
              )}

              {(currentStep === 4 && !scholarForm.id) || (currentStep === 3 && scholarForm.id) ? (
                <button type="submit" className="submit-button">
                  {scholarForm.id ? "Update Scholar" : "Create Scholar"}
                </button>
              ) : null}
            </div>


            </form>
          </div>
        </div>
      )}


      {/* --- Staff Modal --- */}
      {showStaffForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span 
              className="close" 
              onClick={() => setShowStaffForm(false)}
            >&times;</span>
            <h2>{staffForm.id ? "Edit Staff" : "Create Staff"}</h2>
            <form onSubmit={handleSaveStaff} className="create-form">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={staffForm.firstName} 
                  onChange={handleStaffChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={staffForm.lastName} 
                  onChange={handleStaffChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={staffForm.email} 
                  onChange={handleStaffChange} 
                  required 
                />
              </div>
              {!staffForm.id && (
                <div className="form-group">
                    <label>Password</label>
                    <input 
                    type="password" 
                    name="password" 
                    value={staffForm.password} 
                    onChange={handleStaffChange} 
                    required
                    />
                </div>
                )}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {staffForm.id ? "Update Staff" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
