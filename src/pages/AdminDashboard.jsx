import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';
import { FaUser, FaPaw, FaSyringe, FaSkull, FaSearchLocation, FaSignOutAlt, FaChartPie } from 'react-icons/fa';
import api from '../api/axiosInstance';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, appointments: 0, vaccinations: 0, lost: 0, memorials: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <FaPaw className="admin-logo" />
          <h2>PetAlert Admin</h2>
        </div>
        <nav className="admin-nav">
          <span><FaUser /> Users</span>
          <span><FaPaw /> Appointments</span>
          <span><FaSyringe /> Vaccinations</span>
          <span><FaSearchLocation /> Lost & Found</span>
          <span><FaSkull /> Memorials</span>
        </nav>
        <button onClick={handleLogout} className="admin-logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
          <p>Your central hub for pet care operations.</p>
        </header>

        <section className="admin-stats">
          <div className="admin-card users"><FaUser /> Users: {stats.users}</div>
          <div className="admin-card appointments"><FaPaw /> Appointments: {stats.appointments}</div>
          <div className="admin-card vaccinations"><FaSyringe /> Vaccinations: {stats.vaccinations}</div>
          <div className="admin-card lost"><FaSearchLocation /> Lost & Found: {stats.lost}</div>
          <div className="admin-card memorials"><FaSkull /> Memorials: {stats.memorials}</div>
        </section>

        <footer className="admin-footer">
          <FaChartPie />
          <p>PetAlert Admin • Making tails wag since 2025 🐾</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
