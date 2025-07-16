import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/MemorialPage.css";

import {
  getMemorials,
  addMemorial,
  updateMemorial,
  deleteMemorial,
} from "../api/memorialApi";

import axios from "../api/axiosInstance";

Modal.setAppElement("#root");

const MemorialPage = () => {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);

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
    setDateModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.fileUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.petName.trim() || !form.dateOfPassing) {
      alert("Please fill in required fields.");
      return;
    }

    let imageUrl = form.imageUrl;

    if (selectedFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(selectedFile);
      } catch (err) {
        console.error("File upload failed:", err);
        alert("File upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      ...form,
      dateOfPassing: form.dateOfPassing.toISOString().split("T")[0],
      imageUrl,
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
      setSelectedFile(null);
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
    setSelectedFile(null);
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
    <div className="memorial-page">
      <h2>Memorial Entries</h2>

      <form onSubmit={handleSubmit} className="memorial-form">
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
        <div className="date-picker-row">
          <span className="date-display">
            {form.dateOfPassing
              ? form.dateOfPassing.toLocaleDateString("en-US", {
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

        <label>Upload Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="image-preview"
          />
        )}

        <button type="submit" disabled={uploading}>
          {editingId ? "Update" : "Add"} Memorial
        </button>
      </form>

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
            selected={form.dateOfPassing}
            onChange={handleDateChange}
            inline
          />
        </div>
      </Modal>

      <section className="memorial-list">
        <h2 className="upcoming-appointments">Memorial List</h2>
        {entries.length > 0 ? (
          <div className="memorial-list">
            {entries.map((entry) => (
              <div key={entry._id} className="memorial-card">
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt={`${entry.petName} memorial`}
                  />
                )}
                <h3>{entry.petName}</h3>
                {entry.message && (
                  <p>
                    <em>"{entry.message}"</em>
                  </p>
                )}
                <p>
                  <strong>Date of Passing:</strong>{" "}
                  {entry.dateOfPassing || "—"}
                </p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleDelete(entry._id)}>
                    Delete
                  </button>
                </div>
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
