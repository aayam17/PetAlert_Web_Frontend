import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';  // For clock popup styling
import "../css/VetAppointmentPage.css";

const VetAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ date: null, time: '', notes: '', file: null });

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setForm(prev => ({ ...prev, time }));
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select both date and time.");
      return;
    }

    const formattedDate = form.date.toISOString().split('T')[0]; // YYYY-MM-DD

    const newAppointment = {
      ...form,
      id: Date.now(),
      date: formattedDate,
      uploadedFileName: form.file?.name || null,
    };

    setAppointments(prev => [...prev, newAppointment]);
    setForm({ date: null, time: '', notes: '', file: null });
  };

  const now = useMemo(() => new Date(), []);
  const upcoming = useMemo(() =>
    appointments.filter(app => new Date(`${app.date}T${app.time}`) >= now),
  [appointments, now]);
  const past = useMemo(() =>
    appointments.filter(app => new Date(`${app.date}T${app.time}`) < now),
  [appointments, now]);

  return (
    <div className="vet-appointment-page">
      <h2>Vet Appointments</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Date</label>
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          className="custom-datepicker"
          placeholderText="Select date"
          dateFormat="yyyy-MM-dd"
          required
        />

        <label>Time</label>
        <TimePicker
          onChange={handleTimeChange}
          value={form.time}
          className="custom-timepicker"
          disableClock={true}
          clearIcon={null}
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Describe diagnosis, treatment, etc."
        />

        <label>Upload File</label>
        <input
          type="file"
          name="file"
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
        />

        <button type="submit">Schedule Appointment</button>
      </form>

      <section>
        <h2 className="appointment-section-heading">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <div className="appointment-list">
            {upcoming.map(app => (
              <div key={app.id} className="appointment-card">
                <h3>{app.date} at {app.time}</h3>
                {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
                {app.uploadedFileName && <p><strong>File:</strong> {app.uploadedFileName}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2 className="appointment-section-heading">Past Appointments</h2>
        {past.length > 0 ? (
          <div className="appointment-list">
            {past.map(app => (
              <div key={app.id} className="appointment-card">
                <h3>{app.date} at {app.time}</h3>
                {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
                {app.uploadedFileName && <p><strong>File:</strong> {app.uploadedFileName}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>No past appointments.</p>
        )}
      </section>
    </div>
  );
};

export default VetAppointmentsPage;
