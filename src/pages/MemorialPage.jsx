import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/VetAppointmentPage.css";

import {
  getMemorials,
  addMemorial,
  updateMemorial,
  deleteMemorial,
} from "../api/memorialApi";

const MemorialPage = () => {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    petName: "",
    message: "",
    dateOfPassing: null,
    imageUrl: "",
  });

  const fetchMemorials = async () => {
    try {
      const { data } = await getMemorials();
      setEntries(data);
    } catch (err) {
      console.error("Error fetching memorials:", err);
    }
  };

  useEffect(() => {
    fetchMemorials();
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
      dateOfPassing: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.petName.trim() || !form.dateOfPassing) {
      alert("Please fill in required fields.");
      return;
    }

    const payload = {
      ...form,
      dateOfPassing: form.dateOfPassing.toISOString().split("T")[0],
    };

    try {
      if (editingId) {
        await updateMemorial(editingId, payload);
      } else {
        await addMemorial(payload);
      }
      setForm({
        petName: "",
        message: "",
        dateOfPassing: null,
        imageUrl: "",
      });
      setEditingId(null);
      fetchMemorials();
    } catch (err) {
      console.error("Error saving memorial:", err);
    }
  };

  const handleEdit = (entry) => {
    setForm({
      petName: entry.petName,
      message: entry.message,
      dateOfPassing: new Date(entry.dateOfPassing),
      imageUrl: entry.imageUrl || "",
    });
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMemorial(id);
      fetchMemorials();
    } catch (err) {
      console.error("Error deleting memorial:", err);
    }
  };

  return (
    <div className="vet-appointment-page">
      <h2>Memorial Entries</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Name</label>
        <input
          type="text"
          name="petName"
          value={form.petName}
          onChange={handleChange}
          placeholder="Pet's Name"
          required
        />

        <label>Message (optional)</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write a message or memory"
          rows="3"
        />

        <label>Date of Passing</label>
        <DatePicker
          selected={form.dateOfPassing}
          onChange={handleDateChange}
          className="custom-datepicker"
          placeholderText="Select date"
          dateFormat="yyyy-MM-dd"
          required
        />

        <label>Image URL (optional)</label>
        <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />

        <button type="submit">{editingId ? "Update" : "Add"} Memorial</button>
      </form>

      <section>
        <h2 className="upcoming-appointments">Memorial List</h2>
        {entries.length > 0 ? (
          <div className="appointment-list">
            {entries.map((entry) => (
              <div key={entry._id} className="appointment-card memorial">
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt={`${entry.petName} photo`}
                    style={{
                      width: "200px",
                      height: "auto",
                      marginBottom: "1rem",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <h3>{entry.petName}</h3>
                {entry.message && <p><em>"{entry.message}"</em></p>}
                <p>
                  <strong>Date of Passing:</strong> {entry.dateOfPassing}
                </p>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No memorials added yet.</p>
        )}
      </section>
    </div>
  );
};

export default MemorialPage;
