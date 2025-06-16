import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/VetAppointmentPage.css";
import { getMemorials, addMemorial } from "../api/memorials";

const MemorialPage = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    petName: "",
    message: "",
    dateOfPassing: null,
    photo: null,
    photoDataUrl: null,
  });

  useEffect(() => {
    getMemorials().then((res) => setEntries(res.data)).catch(err => {
      console.error("Error loading memorials:", err);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          photo: file,
          photoDataUrl: reader.result,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { petName, message, dateOfPassing } = form;

    if (!petName.trim() || !dateOfPassing) {
      alert("Please fill in name and date of passing.");
      return;
    }

    const formattedDate = dateOfPassing.toISOString().split("T")[0];

    try {
      const newEntry = {
        petName,
        message,
        dateOfPassing: formattedDate,
        imageUrl: "", // could be extended later
      };

      const response = await addMemorial(newEntry);
      setEntries((prev) => [response.data, ...prev]);

      setForm({
        petName: "",
        message: "",
        dateOfPassing: null,
        photo: null,
        photoDataUrl: null,
      });
    } catch (err) {
      console.error("Failed to add memorial:", err);
      alert("Failed to add memorial entry.");
    }
  };

  return (
    <div className="vet-appointment-page">
      <h2>Memorial Entries</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Pet Name</label>
        <input
          type="text"
          name="petName"
          value={form.petName}
          onChange={handleChange}
          placeholder="Name of the pet"
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
              <div key={entry._id || entry.id} className="appointment-card memorial">
                {form.photoDataUrl && (
                  <img
                    src={form.photoDataUrl}
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
                <p><strong>Date of Passing:</strong> {entry.dateOfPassing}</p>
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