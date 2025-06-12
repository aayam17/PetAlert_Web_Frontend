import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/VetAppointmentPage.css";

const MemorialPage = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    name: "",
    relation: "",
    message: "",
    dateOfPassing: null,
    photo: null,
    photoDataUrl: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          photo: file,
          photoDataUrl: reader.result, // base64 data URL for preview
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({
      ...prev,
      dateOfPassing: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.relation.trim() || !form.dateOfPassing) {
      alert("Please fill in name, relation, and date of passing.");
      return;
    }
    const formattedDate = form.dateOfPassing.toISOString().split("T")[0];

    const newEntry = {
      id: Date.now(),
      name: form.name,
      relation: form.relation,
      message: form.message,
      dateOfPassing: formattedDate,
      photoDataUrl: form.photoDataUrl, // Save base64 string for rendering
    };

    setEntries((prev) => [newEntry, ...prev]);

    setForm({
      name: "",
      relation: "",
      message: "",
      dateOfPassing: null,
      photo: null,
      photoDataUrl: null,
    });
  };

  return (
    <div className="vet-appointment-page">
      <h2>Memorial Entries</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name of the person/pet"
          required
        />

        <label>Relation</label>
        <input
          type="text"
          name="relation"
          value={form.relation}
          onChange={handleChange}
          placeholder="Your relation to them"
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

        <label>Upload Photo (optional)</label>
        <input
          type="file"
          name="photo"
          accept=".jpg,.png"
          onChange={handleChange}
        />

        <button type="submit">Add Memorial</button>
      </form>

      <section>
        <h2 className="upcoming-appointments">Memorial List</h2>
        {entries.length > 0 ? (
          <div className="appointment-list">
            {entries.map((entry) => (
              <div key={entry.id} className="appointment-card memorial">
                {entry.photoDataUrl && (
                  <img
                    src={entry.photoDataUrl}
                    alt={`${entry.name} photo`}
                    style={{
                      width: "200px",
                      height: "auto",
                      marginBottom: "1rem",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <h3>{entry.name}</h3>
                <p>
                  <strong>Relation:</strong> {entry.relation}
                </p>
                {entry.message && <p><em>"{entry.message}"</em></p>}
                <p>
                  <strong>Date of Passing:</strong> {entry.dateOfPassing}
                </p>
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
