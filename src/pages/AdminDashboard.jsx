import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";
import {
  FaUser,
  FaPaw,
  FaSyringe,
  FaSkull,
  FaSearchLocation,
  FaSignOutAlt,
  FaChartPie,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  getVetAppointments,
  deleteVetAppointment,
  updateVetAppointment,
} from "../api/appointmentApi";

import {
  getVaccinationRecords,
  deleteVaccinationRecord,
  updateVaccinationRecord,
} from "../api/vaccinationApi";

import {
  getLostAndFound,
  deleteLostAndFound,
  updateLostAndFound,
} from "../api/LostAndFoundApi";

import {
  getMemorials,
  deleteMemorial,
  updateMemorial,
} from "../api/memorialApi";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // -----------------------
  // Vet Appointments
  // -----------------------
  const [appointments, setAppointments] = useState([]);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editAppointment, setEditAppointment] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const fetchAppointments = async () => {
    const res = await getVetAppointments();
    setAppointments(res.data);
  };

  const handleEditAppointment = (item) => {
    setEditAppointmentId(item._id);
    setEditAppointment({
      date: item.date,
      time: item.time,
      notes: item.notes,
    });
  };

  const saveAppointment = async () => {
    await updateVetAppointment(editAppointmentId, editAppointment);
    setEditAppointmentId(null);
    fetchAppointments();
  };

  const handleDeleteAppointment = async (id) => {
    await deleteVetAppointment(id);
    fetchAppointments();
  };

  // -----------------------
  // Vaccination Records
  // -----------------------
  const [vaccinations, setVaccinations] = useState([]);
  const [editVaccinationId, setEditVaccinationId] = useState(null);
  const [editVaccination, setEditVaccination] = useState({
    vaccine: "",
    notes: "",
    date: "",
  });

  const fetchVaccinations = async () => {
    const res = await getVaccinationRecords();
    setVaccinations(res.data);
  };

  const handleEditVaccination = (item) => {
    setEditVaccinationId(item._id);
    setEditVaccination({
      vaccine: item.vaccine,
      notes: item.notes,
      date: item.date,
    });
  };

  const saveVaccination = async () => {
    await updateVaccinationRecord(editVaccinationId, editVaccination);
    setEditVaccinationId(null);
    fetchVaccinations();
  };

  const handleDeleteVaccination = async (id) => {
    await deleteVaccinationRecord(id);
    fetchVaccinations();
  };

  // -----------------------
  // Lost and Found
  // -----------------------
  const [lostItems, setLostItems] = useState([]);
  const [editLostId, setEditLostId] = useState(null);
  const [editLost, setEditLost] = useState({
    type: "",
    description: "",
    location: "",
    date: "",
    time: "",
    contactInfo: "",
  });

  const fetchLostAndFound = async () => {
    const res = await getLostAndFound();
    setLostItems(res.data);
  };

  const handleEditLost = (item) => {
    setEditLostId(item._id);
    setEditLost({
      type: item.type,
      description: item.description,
      location: item.location,
      date: item.date,
      time: item.time,
      contactInfo: item.contactInfo,
    });
  };

  const saveLost = async () => {
    await updateLostAndFound(editLostId, editLost);
    setEditLostId(null);
    fetchLostAndFound();
  };

  const handleDeleteLost = async (id) => {
    await deleteLostAndFound(id);
    fetchLostAndFound();
  };

  // -----------------------
  // Memorials
  // -----------------------
  const [memorials, setMemorials] = useState([]);
  const [editMemorialId, setEditMemorialId] = useState(null);
  const [editMemorial, setEditMemorial] = useState({
    petName: "",
    message: "",
    dateOfPassing: "",
    imageUrl: "",
  });

  const fetchMemorials = async () => {
    const res = await getMemorials();
    setMemorials(res.data);
  };

  const handleEditMemorial = (item) => {
    setEditMemorialId(item._id);
    setEditMemorial({
      petName: item.petName,
      message: item.message,
      dateOfPassing: item.dateOfPassing,
      imageUrl: item.imageUrl,
    });
  };

  const saveMemorial = async () => {
    await updateMemorial(editMemorialId, editMemorial);
    setEditMemorialId(null);
    fetchMemorials();
  };

  const handleDeleteMemorial = async (id) => {
    await deleteMemorial(id);
    fetchMemorials();
  };

  // -----------------------
  // Fetch all on mount
  // -----------------------
  useEffect(() => {
    fetchAppointments();
    fetchVaccinations();
    fetchLostAndFound();
    fetchMemorials();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <FaPaw className="admin-logo" />
          <h2>PetAlert Admin</h2>
        </div>
        <nav className="admin-nav">
          <span><FaPaw /> Appointments</span>
          <span><FaSyringe /> Vaccinations</span>
          <span><FaSearchLocation /> Lost & Found</span>
          <span><FaSkull /> Memorials</span>
        </nav>
        <button onClick={handleLogout} className="admin-logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage pet care operations below.</p>
        </header>

        <Section
          title="Vet Appointments"
          items={appointments}
          fields={["date", "time", "notes"]}
          createdByField="createdBy"
          editId={editAppointmentId}
          editForm={editAppointment}
          setEditForm={setEditAppointment}
          onEdit={handleEditAppointment}
          onSave={saveAppointment}
          onDelete={handleDeleteAppointment}
        />

        <Section
          title="Vaccination Records"
          items={vaccinations}
          fields={["vaccine", "notes", "date"]}
          createdByField="createdBy"
          editId={editVaccinationId}
          editForm={editVaccination}
          setEditForm={setEditVaccination}
          onEdit={handleEditVaccination}
          onSave={saveVaccination}
          onDelete={handleDeleteVaccination}
        />

        <Section
          title="Lost and Found"
          items={lostItems}
          fields={["type", "description", "location", "date", "time", "contactInfo"]}
          createdByField="createdBy"
          editId={editLostId}
          editForm={editLost}
          setEditForm={setEditLost}
          onEdit={handleEditLost}
          onSave={saveLost}
          onDelete={handleDeleteLost}
        />

        <Section
          title="Memorials"
          items={memorials}
          fields={["petName", "message", "dateOfPassing", "imageUrl"]}
          createdByField="createdBy"
          editId={editMemorialId}
          editForm={editMemorial}
          setEditForm={setEditMemorial}
          onEdit={handleEditMemorial}
          onSave={saveMemorial}
          onDelete={handleDeleteMemorial}
        />

        <footer className="admin-footer">
          <FaChartPie />
          <p>PetAlert Admin • Making tails wag since 2025 🐾</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;

// Reusable Section Component
const Section = ({
  title,
  items,
  fields,
  createdByField,
  editId,
  editForm,
  setEditForm,
  onEdit,
  onSave,
  onDelete,
}) => {
  return (
    <section className="admin-list-section">
      <h2>{title}</h2>
      <table className="admin-table">
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f}>{f}</th>
            ))}
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {fields.map((field) => (
                <td key={field}>
                  {editId === item._id ? (
                    <input
                      value={editForm[field] || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item[field]
                  )}
                </td>
              ))}
              <td>
                {item[createdByField]?.username}
                <br />
                <small>{item[createdByField]?.email}</small>
              </td>
              <td>
                {editId === item._id ? (
                  <button onClick={onSave}>Save</button>
                ) : (
                  <>
                    <FaEdit
                      onClick={() => onEdit(item)}
                      style={{
                        color: "var(--accent-color)",
                        marginRight: "10px"
                      }}
                    />
                    <FaTrash
                      onClick={() => onDelete(item._id)}
                      style={{
                        color: "var(--danger-color)"
                      }}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
