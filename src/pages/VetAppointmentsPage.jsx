import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/VetAppointmentPage.css';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  FaCalendarAlt,
  FaClock,
  FaPaw,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaStickyNote,
} from 'react-icons/fa';

import {
  getVetAppointments,
  addVetAppointment,
  updateVetAppointment,
  deleteVetAppointment,
} from '../api/appointmentApi';

Modal.setAppElement('#root');

const VetAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const [form, setForm] = useState({
    date: null,
    time: '',
    petName: '',
    location: '',
    status: 'Scheduled',
    reason: '',
    notes: '',
  });

  const fetchAppointments = async () => {
    try {
      const { data } = await getVetAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
    setDateModalOpen(false);
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({ ...prev, time }));
    setTimeModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.time || !form.petName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...form,
      date: form.date.toISOString().split('T')[0],
    };

    try {
      if (editingId) {
        await updateVetAppointment(editingId, payload);
        toast.success("Appointment updated!");
      } else {
        await addVetAppointment(payload);
        toast.success("Appointment added!");
      }

      setForm({
        date: null,
        time: '',
        petName: '',
        location: '',
        status: 'Scheduled',
        reason: '',
        notes: '',
      });
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error("Error submitting appointment:", err);
      toast.error("Failed to save appointment.");
    }
  };

  const handleEdit = (appt) => {
    setForm({
      date: appt.date ? new Date(appt.date) : null,
      time: appt.time || '',
      petName: appt.petName || '',
      location: appt.location || '',
      status: appt.status || 'Scheduled',
      reason: appt.reason || '',
      notes: appt.notes || '',
    });
    setEditingId(appt._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this appointment permanently?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteVetAppointment(id);
        toast.success("Appointment deleted!");
        fetchAppointments();
      } catch (err) {
        console.error("Error deleting appointment:", err);
        toast.error("Failed to delete appointment.");
      }
    }
  };

  return (
    <div className="vet-appointment-page">
      <Toaster />
      <h2 className="appointment-section-heading">Vet Appointments</h2>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <label>Date</label>
        <div className="date-picker-row">
          <span className="date-display">
            {form.date
              ? form.date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "No date selected"}
          </span>
          <button
            type="button"
            onClick={() => setDateModalOpen(true)}
            className="date-picker-button"
          >
            Pick Date
          </button>
        </div>

        <label>Time:</label>
        <input
          readOnly
          value={form.time || ""}
          placeholder="Select time"
          onClick={() => setTimeModalOpen(true)}
          className="custom-timepicker"
        />

        <label>Pet Name:</label>
        <input
          name="petName"
          value={form.petName}
          onChange={handleChange}
          placeholder="Pet's name"
          required
        />

        <label>Location:</label>
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
        >
          <option hidden value="">Select location</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Bhaktapur">Bhaktapur</option>
          <option value="Lalitpur">Lalitpur</option>
        </select>

        <label>Reason:</label>
        <input
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason for visit"
        />

        <label>Notes:</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional notes"
        />

        <button type="submit">
          {editingId ? 'Update' : 'Add'} Appointment
        </button>
      </form>

      {/* DATE PICKER MODAL */}
      <Modal
        isOpen={dateModalOpen}
        onRequestClose={() => setDateModalOpen(false)}
        className={{
          base: "modal-content",
          afterOpen: "modal-content--after-open",
          beforeClose: "modal-content--before-close",
        }}
        overlayClassName={{
          base: "modal-overlay",
          afterOpen: "modal-overlay--after-open",
          beforeClose: "modal-overlay--before-close",
        }}
        closeTimeoutMS={300}
      >
        <div className="datepicker-wrapper">
          <DatePicker
            selected={form.date}
            onChange={handleDateChange}
            inline
          />
        </div>
      </Modal>

      {/* TIME PICKER MODAL */}
      <Modal
        isOpen={timeModalOpen}
        onRequestClose={() => setTimeModalOpen(false)}
        className={{
          base: "modal-content",
          afterOpen: "modal-content--after-open",
          beforeClose: "modal-content--before-close",
        }}
        overlayClassName={{
          base: "modal-overlay",
          afterOpen: "modal-overlay--after-open",
          beforeClose: "modal-overlay--before-close",
        }}
        closeTimeoutMS={300}
      >
        <input
          type="time"
          value={form.time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="custom-timepicker"
        />
      </Modal>

      <div className="appointment-list">
        {appointments.map((appt) => (
          <div className="appointment-card" key={appt._id}>
            <div className="card-header">
              <h3>
                <FaPaw /> {appt.petName || "—"}
              </h3>
              <span className={`status ${(appt.status || 'Scheduled').toLowerCase()}`}>
                {appt.status || 'Scheduled'}
              </span>
            </div>
            <p><FaCalendarAlt /> {appt.date || "—"}</p>
            <p><FaClock /> {appt.time || "—"}</p>
            <p><FaMapMarkerAlt /> {appt.location || "—"}</p>
            <p><FaStickyNote /> {appt.reason || "—"}</p>
            <p><strong>Notes:</strong> {appt.notes || "—"}</p>
            <div className="card-actions">
              <button onClick={() => handleEdit(appt)}>
                <FaEdit /> Edit
              </button>
              <button onClick={() => handleDelete(appt._id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetAppointmentsPage;
