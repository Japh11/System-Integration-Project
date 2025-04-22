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
    setMessage("");
    setShowScholarForm(true);
  };

  const handleScholarChange = e => {
    setScholarForm({ ...scholarForm, [e.target.name]: e.target.value });
  };

  const handleSaveScholar = async e => {
    e.preventDefault();
    try {
      if (scholarForm.id) {
        await ScholarApi.updateScholar(scholarForm.id, scholarForm);
        setMessage("✅ Scholar updated!");
      } else {
        await ScholarApi.registerScholar(scholarForm);
        setMessage("✅ Scholar created!");
      }
      setShowScholarForm(false);
      fetchScholars();
    } catch (err) {
      console.error(err);
      setMessage("❌ Save failed");
    }
  };

  const handleDeleteScholar = async id => {
    if (!window.confirm("Delete this scholar?")) return;
    try {
      await ScholarApi.deleteScholar(id);
      fetchScholars();
    } catch (e) {
      console.error("Delete failed:", e);
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
      if (staffForm.id) {
        await StaffApi.updateStaff(staffForm.id, staffForm);
        alert("✅ Staff updated!");
      } else {
        await StaffApi.registerStaff(staffForm);
        alert("✅ Staff created!");
      }
      setShowStaffForm(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  const handleDeleteStaff = async id => {
    if (!window.confirm("Delete this staff?")) return;
    try {
      await StaffApi.deleteStaff(id);
      fetchStaff();
    } catch (e) {
      console.error("Delete failed:", e);
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
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholars.map(s => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td style={{ textAlign: "right" }}>
                    <EditIcon 
                      style={{ cursor: "pointer", marginRight: 8 }} 
                      fontSize="small" 
                      onClick={() => openScholarModal(s)} 
                    />
                    <DeleteIcon 
                      style={{ cursor: "pointer" }} 
                      fontSize="small" 
                      onClick={() => handleDeleteScholar(s.id)} 
                    />
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
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(st => (
                <tr key={st.id}>
                  <td>{st.firstName} {st.lastName}</td>
                  <td>{st.email}</td>
                  <td style={{ textAlign: "right" }}>
                    <EditIcon 
                      style={{ cursor: "pointer", marginRight: 8 }} 
                      fontSize="small" 
                      onClick={() => openStaffModal(st)} 
                    />
                    <DeleteIcon 
                      style={{ cursor: "pointer" }} 
                      fontSize="small" 
                      onClick={() => handleDeleteStaff(st.id)} 
                    />
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
            <span
                className="close"
                onClick={() => setShowScholarForm(false)}
            >&times;</span>

            <h2>{scholarForm.id ? "Edit Scholar" : "Create Scholar"}</h2>
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSaveScholar} className="create-form">
                <div className="form-group">
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={scholarForm.lastName}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={scholarForm.firstName}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Middle Name</label>
                <input
                    type="text"
                    name="middleName"
                    value={scholarForm.middleName}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>Batch Year</label>
                <input
                    type="number"
                    name="batchYear"
                    value={scholarForm.batchYear}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Account No.</label>
                <input
                    type="text"
                    name="accountNo"
                    value={scholarForm.accountNo}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>SPAS No.</label>
                <input
                    type="text"
                    name="spasNo"
                    value={scholarForm.spasNo}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Sex</label>
                <input
                    type="text"
                    name="gender"
                    value={scholarForm.sex}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Level/Year</label>
                <input
                    type="text"
                    name="levelYear"
                    value={scholarForm.levelYear}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>School</label>
                <input
                    type="text"
                    name="school"
                    value={scholarForm.school}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Course</label>
                <input
                    type="text"
                    name="course"
                    value={scholarForm.course}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Status</label>
                <input
                    type="text"
                    name="status"
                    value={scholarForm.status}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Type of Scholarship</label>
                <input
                    type="text"
                    name="typeOfScholarship"
                    value={scholarForm.typeOfScholarship}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>Birthday</label>
                <input
                    type="date"
                    name="birthday"
                    value={scholarForm.birthday}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Contact Number</label>
                <input
                    type="tel"
                    name="contactNumber"
                    value={scholarForm.contactNumber}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={scholarForm.email}
                    onChange={handleScholarChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Barangay</label>
                <input
                    type="text"
                    name="brgy"
                    value={scholarForm.brgy}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>Municipality</label>
                <input
                    type="text"
                    name="municipality"
                    value={scholarForm.municipality}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>Province</label>
                <input
                    type="text"
                    name="province"
                    value={scholarForm.province}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>District</label>
                <input
                    type="text"
                    name="district"
                    value={scholarForm.district}
                    onChange={handleScholarChange}
                />
                </div>

                <div className="form-group">
                <label>Region</label>
                <input
                    type="text"
                    name="region"
                    value={scholarForm.region}
                    onChange={handleScholarChange}
                />
                </div>

                {!scholarForm.id && (
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
                )}

                <div className="form-actions">
                <button type="submit" className="submit-button">
                    {scholarForm.id ? "Update Scholar" : "Create Scholar"}
                </button>
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
