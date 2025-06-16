import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import "../css/VetAppointmentPage.css";
import { getVetAppointments, addVetAppointment } from '../api/vetAppointments';

const VetAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ date: null, time: '', notes: '', file: null });

  useEffect(() => {
    getVetAppointments().then(res => setAppointments(res.data)).catch(err => {
      console.error("Error loading appointments:", err);
    });
  }, []);

  const handleDateChange = (date) => setForm(prev => ({ ...prev, date }));
  const handleTimeChange = (time) => setForm(prev => ({ ...prev, time }));
  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      alert("Please select both date and time.");
      return;
    }

    const newAppointment = {
      date: form.date.toISOString().split('T')[0],
      time: form.time,
      notes: form.notes,
    };

    try {
      const response = await addVetAppointment(newAppointment);
      setAppointments(prev => [...prev, response.data]);
      setForm({ date: null, time: '', notes: '', file: null });
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
      alert("Failed to submit appointment.");
    }
  };

  const now = useMemo(() => new Date(), []);
  const upcoming = useMemo(() =>
    [...appointments]
      .filter(app => new Date(`${app.date}T${app.time}`) >= now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)),
  [appointments, now]);

  const past = useMemo(() =>
    [...appointments]
      .filter(app => new Date(`${app.date}T${app.time}`) < now)
      .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)),
  [appointments, now]);

  return (
    <div className="vet-appointment-page">
      <h1>Vet Appointments</h1>

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Date</label>
          <DatePicker
            selected={form.date}
            onChange={handleDateChange}
            className="custom-datepicker"
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <TimePicker
            onChange={handleTimeChange}
            value={form.time}
            className="custom-timepicker"
            disableClock={true}
            clearIcon={null}
            required
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Describe diagnosis, treatment, etc."
          />
        </div>

        <div className="form-group">
          <label>Upload File</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Schedule Appointment</button>
      </form>

      <section>
        <h2 className="appointment-section-heading">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <div className="appointment-list">
            {upcoming.map(app => (
              <div key={app._id || app.id} className="appointment-card">
                <h3>{app.date} at {app.time}</h3>
                {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">No upcoming appointments.</div>
        )}
      </section>

      <section>
        <h2 className="appointment-section-heading">Past Appointments</h2>
        {past.length > 0 ? (
          <div className="appointment-list">
            {past.map(app => (
              <div key={app._id || app.id} className="appointment-card past">
                <h3>{app.date} at {app.time}</h3>
                {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">No past appointments.</div>
        )}
      </section>
    </div>
  );
};

export default VetAppointmentsPage;