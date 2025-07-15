import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import "../css/VetAppointmentPage.css";


import {
  getVetAppointments,
  addVetAppointment,
  updateVetAppointment,
  deleteVetAppointment,
} from '../api/appointmentApi';

const VetAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: null, time: '', notes: '' });

  const fetchAppointments = async () => {
    try {
      const { data } = await getVetAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({ ...prev, time }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      alert("Please select both date and time.");
      return;
    }

    const payload = {
      date: form.date.toISOString().split('T')[0],
      time: form.time,
      notes: form.notes,
    };

    try {
      if (editingId) {
        await updateVetAppointment(editingId, payload);
      } else {
        await addVetAppointment(payload);
      }
      setForm({ date: null, time: '', notes: '' });
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error("Error submitting appointment:", err);
    }
  };

  const handleEdit = (appt) => {
    setForm({
      date: new Date(appt.date),
      time: appt.time,
      notes: appt.notes,
    });
    setEditingId(appt._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVetAppointment(id);
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  return (
    <div className="vet-appointment-page">
      <h2>Vet Appointments</h2>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <label>Date:</label>
        <DatePicker selected={form.date} onChange={handleDateChange} />

        <label>Time:</label>
        <TimePicker value={form.time} onChange={handleTimeChange} />

        <label>Notes:</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        <button type="submit">{editingId ? 'Update' : 'Add'} Appointment</button>
      </form>

      <div className="appointment-list">
        {appointments.map((appt) => (
          <div className="appointment-card" key={appt._id}>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Time:</strong> {appt.time}</p>
            <p><strong>Notes:</strong> {appt.notes}</p>
            <button onClick={() => handleEdit(appt)}>Edit</button>
            <button onClick={() => handleDelete(appt._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetAppointmentsPage;