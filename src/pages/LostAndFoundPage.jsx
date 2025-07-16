import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import "../css/LostAndFoundPage.css";

import {
  getLostAndFound,
  addLostAndFound,
  updateLostAndFound,
  deleteLostAndFound,
} from "../api/LostAndFoundApi";

// Required for accessibility
Modal.setAppElement("#root");

const LostAndFoundPage = () => {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

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
    setDateModalOpen(false);
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({
      ...prev,
      time,
    }));
    setTimeModalOpen(false);
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
    setEditingId(entry._id);
    setForm({
      type: entry.type,
      description: entry.description,
      location: entry.location,
      date: new Date(entry.date),
      time: entry.time,
    });
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
    <div className="lost-and-found-page">
      <h2 className="lost-and-found-section-heading">Lost and Found</h2>

      <form onSubmit={handleSubmit} className="lost-and-found-form">
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
        <input
          readOnly
          value={form.date ? form.date.toLocaleDateString() : ""}
          placeholder="Select date"
          className="custom-datepicker"
          onClick={() => setDateModalOpen(true)}
        />

        <label>Time</label>
        <input
          readOnly
          value={form.time || ""}
          placeholder="Select time"
          className="custom-timepicker"
          onClick={() => setTimeModalOpen(true)}
        />

        <button type="submit">{editingId ? "Update" : "Add"} Entry</button>
      </form>

      {/* Date Modal */}
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
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          inline
        />
      </Modal>

      {/* Time Modal */}
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

      <section>
        <h2 className="lost-and-found-section-heading">Entries</h2>
        {entries.length > 0 ? (
          <div className="entry-list">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className={`entry-card ${entry.type.toLowerCase()}`}
              >
                <div className="card-header">
                  <h3>
                    [{entry.type}] {entry.description}
                  </h3>
                </div>
                <p>
                  <strong>Location:</strong> {entry.location}
                </p>
                <p>
                  <strong>Date & Time:</strong> {entry.date} at {entry.time}
                </p>
                <p>
                  <strong>Contact:</strong> {entry.contactInfo || "N/A"}
                </p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(entry)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(entry._id)}>
                    Delete
                  </button>
                </div>
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
