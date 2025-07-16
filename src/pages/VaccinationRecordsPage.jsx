import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../css/VaccinationRecordsPage.css";

import {
  getVaccinationRecords,
  addVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,
} from '../api/vaccinationApi';

Modal.setAppElement("#root");

const VaccinationRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const [form, setForm] = useState({
    date: null,
    vaccine: '',
    notes: ''
  });

  const fetchRecords = async () => {
    try {
      const { data } = await getVaccinationRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load vaccination records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDateChange = (date) => {
    setForm((prev) => ({
      ...prev,
      date
    }));
    setDateModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.vaccine.trim()) {
      alert("Please enter the vaccine name and date.");
      return;
    }

    const payload = {
      ...form,
      date: form.date.toISOString().split('T')[0],
    };

    try {
      if (editingId) {
        await updateVaccinationRecord(editingId, payload);
      } else {
        await addVaccinationRecord(payload);
      }
      setForm({ date: null, vaccine: '', notes: '' });
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      console.error("Failed to save vaccination record:", err);
    }
  };

  const handleEdit = (record) => {
    setForm({
      date: new Date(record.date),
      vaccine: record.vaccine,
      notes: record.notes,
    });
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVaccinationRecord(id);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  return (
    <div className="vaccination-records-page">
      <h2>Vaccination Records</h2>

      <form onSubmit={handleSubmit} className="vaccination-form">
        <label>Date</label>
        <div className="date-picker-row">
          <span className="date-display">
            {form.date
              ? form.date.toLocaleDateString("en-US", {
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

        <label>Vaccine Name</label>
        <input
          type="text"
          name="vaccine"
          value={form.vaccine}
          onChange={handleChange}
          placeholder="Enter vaccine name"
          required
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Optional notes (e.g., side effects, booster needed)"
        />

        <button type="submit">{editingId ? 'Update' : 'Add'} Record</button>
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
            selected={form.date}
            onChange={handleDateChange}
            inline
          />
        </div>
      </Modal>

      <section>
        <h2 className="record-list-heading">Vaccination History</h2>
        {records.length > 0 ? (
          <div className="record-list">
            {records.map(record => (
              <div key={record._id} className="record-card">
                <h3>{record.date} - {record.vaccine}</h3>
                {record.notes && (
                  <p>
                    <strong>Notes:</strong> {record.notes}
                  </p>
                )}
                <div className="card-actions">
                  <button onClick={() => handleEdit(record)}>Edit</button>
                  <button onClick={() => handleDelete(record._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No vaccination records added.</p>
        )}
      </section>
    </div>
  );
};

export default VaccinationRecordsPage;
