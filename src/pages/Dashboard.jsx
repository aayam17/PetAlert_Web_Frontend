import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaBars, FaBell } from "react-icons/fa";
import "../css/dashboard.css";

import userImg from "../assets/user.png";
import logoPet from '../assets/logo_pet.png';

const services = [
  {
    title: "Vet Appointments",
    description: "Schedule expert check-ups and consultations for your pet’s health and wellness.",
    icon: "🐾",
    route: "/vet-appointments",
  },
  {
    title: "Vaccination Records",
    description: "Track and manage your pet’s vaccination history with ease and accuracy.",
    icon: "💉",
    route: "/vaccination-records",
  },
  {
    title: "Lost and Found Board",
    description: "Help reconnect lost pets with their owners through our community-driven board.",
    icon: "🔍",
    route: "/lost-and-found",
  },
  {
    title: "End-of-Life & Memorial",
    description: "Honor your pet’s memory with compassion and care during difficult times.",
    icon: "🕊️",
    route: "/memorial",
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand-name">PetAlert</span>
        </div>
        {isSidebarOpen && (
          <nav className="sidebar-nav">
            <Link to="/about">About Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <FaBars size={24} />
            </button>
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="topbar-right">
            <FaBell className="notification-icon" size={35} color="black" />
            <img src={userImg} alt="User" className="user-avatar" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <h2 className="hero-title">
            A four-legged word <span className="highlight">LOVE</span> and <span className="highlight">CARING</span> is how we show it.
          </h2>
          <p className="hero-subtitle">Providing expert pet care services online.</p>
        <Link to="/community-board" className="cta-button">
           <FaPaw style={{ marginRight: '8px' }} />
        Community Board
        </Link>

        </section>

        {/* Services Section */}
        <section id="services" className="services">
          <h3 className="section-title">Our Services</h3>
          <div className="services-grid">
            {services.map((service, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h4 className="service-title">{service.title}</h4>
                <p className="service-description">{service.description}</p>
                <Link to={service.route} className="learn-more">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-left">
            <img src={logoPet} alt="PetAlert Logo" className="logo" />
            <p className="brand-name">PetAlert</p>
          </div>
          <div className="footer-info">
            <p><FaClock /> Working Hours</p>
            <p>Available 24/7 on our website</p>
          </div>
          <div className="footer-info">
            <p><FaMapMarkerAlt /> Location</p>
            <p>Kathmandu, Nepal</p>
          </div>
          <div className="footer-info">
            <p><FaPhoneAlt /> Contact</p>
            <p>Got questions? <br /><strong>+977 9849610810</strong></p>
          </div>
          <div className="footer-follow">
            <p>Follow</p>
            <div className="social-icons">
              <div className="social-icon"></div>
              <div className="social-icon"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;