import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "../css/VetAppointmentPage.css";
import { getLostAndFound, addLostAndFound } from "../api/lostAndFound";

const LostAndFoundPage = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    type: "Lost",
    description: "",
    location: "",
    date: null,
    time: "",
    file: null,
    fileDataUrl: null,
  });

  useEffect(() => {
    getLostAndFound().then((res) => setEntries(res.data)).catch(err => {
      console.error("Error fetching entries:", err);
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
          file: file,
          fileDataUrl: reader.result,
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
    setForm((prev) => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setForm((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, location, date, time, type } = form;

    if (!description.trim() || !location.trim() || !date || !time) {
      alert("Please fill in all required fields including date and time.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    try {
      const newEntry = {
        description,
        location,
        date: formattedDate,
        time,
        type,
        contactInfo: "test@example.com", // You can update this based on auth
      };

      const response = await addLostAndFound(newEntry);
      setEntries((prev) => [response.data, ...prev]);

      setForm({
        type: "Lost",
        description: "",
        location: "",
        date: null,
        time: "",
        file: null,
        fileDataUrl: null,
      });
    } catch (error) {
      console.error("Failed to submit entry:", error);
      alert("Submission failed.");
    }
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeB - dateTimeA;
    });
  }, [entries]);

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

        <label>Upload File (optional)</label>
        <input
          type="file"
          name="file"
          accept=".jpg,.png,.pdf"
          onChange={handleChange}
        />

        <button type="submit">Add Entry</button>
      </form>

      <section>
        <h2 className="upcoming-appointments">Entries</h2>
        {sortedEntries.length > 0 ? (
          <div className="appointment-list">
            {sortedEntries.map((entry) => (
              <div
                key={entry._id || entry.id}
                className={`appointment-card ${entry.type.toLowerCase()}`}
              >
                <h3>
                  [{entry.type}] {entry.description}
                </h3>
                <p><strong>Location:</strong> {entry.location}</p>
                <p><strong>Date & Time:</strong> {entry.date} at {entry.time}</p>
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