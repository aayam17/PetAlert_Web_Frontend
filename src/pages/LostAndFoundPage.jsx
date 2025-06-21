import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "../css/VetAppointmentPage.css";

import {
  getLostAndFound,
  addLostAndFound,
  updateLostAndFound,
  deleteLostAndFound,
} from "../api/LostAndFoundApi";

const LostAndFoundPage = () => {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: "Lost",
    description: "",
    location: "",
    date: null,
    time: "",
  });

  const fetchEntries = async () => {
    try {
      const { data } = await getLostAndFound();
      setEntries(data);
    } catch (err) {
      console.error("Error fetching lost and found entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({
      ...prev,
      time,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.description.trim() ||
      !form.location.trim() ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...form,
      date: form.date.toISOString().split("T")[0],
    };

    try {
      if (editingId) {
        await updateLostAndFound(editingId, payload);
      } else {
        await addLostAndFound(payload);
      }
      setForm({
        type: "Lost",
        description: "",
        location: "",
        date: null,
        time: "",
      });
      setEditingId(null);
      fetchEntries();
    } catch (err) {
      console.error("Error submitting lost and found entry:", err);
    }
  };

  const handleEdit = (entry) => {
    setForm({
      type: entry.type,
      description: entry.description,
      location: entry.location,
      date: new Date(entry.date),
      time: entry.time,
    });
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteLostAndFound(id);
      fetchEntries();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <div className="vet-appointment-page">
      <h2>Lost and Found</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the item"
          rows="3"
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Where was it lost/found?"
          required
        />

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

        <button type="submit">{editingId ? "Update" : "Add"} Entry</button>
      </form>

      <section>
        <h2 className="upcoming-appointments">Entries</h2>
        {entries.length > 0 ? (
          <div className="appointment-list">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className={`appointment-card ${entry.type.toLowerCase()}`}
              >
                <h3>
                  [{entry.type}] {entry.description}
                </h3>
                <p>
                  <strong>Location:</strong> {entry.location}
                </p>
                <p>
                  <strong>Date & Time:</strong> {entry.date} at {entry.time}
                </p>
                <p>
                  <strong>Contact:</strong> {entry.contactInfo || "N/A"}
                </p>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries added yet.</p>
        )}
      </section>
    </div>
  );
};

export default LostAndFoundPage;
