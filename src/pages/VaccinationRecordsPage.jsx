import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../css/VaccinationRecordsPage.css";

const VaccinationRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ date: null, vaccine: '', notes: '', file: null });

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, date }));
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

    if (!form.date || !form.vaccine.trim()) {
      alert("Please enter the vaccine name and date.");
      return;
    }

    const formattedDate = form.date.toISOString().split('T')[0]; // YYYY-MM-DD

    const newRecord = {
      ...form,
      id: Date.now(),
      date: formattedDate,
      uploadedFileName: form.file?.name || null,
    };

    setRecords(prev => [...prev, newRecord]);
    setForm({ date: null, vaccine: '', notes: '', file: null });
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records]);

  return (
    <div className="vaccination-records-page">
      <h2>Vaccination Records</h2>

      <form onSubmit={handleSubmit} className="vaccination-form">
        <label>Date</label>
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          className="custom-datepicker"
          placeholderText="Select vaccination date"
          dateFormat="yyyy-MM-dd"
          required
        />

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

        <label>Upload File</label>
        <input
          type="file"
          name="file"
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
        />

        <button type="submit">Add Record</button>
      </form>

      <section>
        <h2 className="record-list-heading">Vaccination History</h2>
        {sortedRecords.length > 0 ? (
          <div className="record-list">
            {sortedRecords.map(record => (
              <div key={record.id} className="record-card">
                <h3>{record.date} - {record.vaccine}</h3>
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                {record.uploadedFileName && <p><strong>File:</strong> {record.uploadedFileName}</p>}
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
