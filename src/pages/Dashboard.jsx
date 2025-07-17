import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaBars, FaBell, FaTimes } from "react-icons/fa";
import io from "socket.io-client";
import "../css/dashboard.css"; 

import userImg from "../assets/user.png"; 
import logoPet from "../assets/logo_pet.png"; 

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
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const socketRef = useRef(null); // useRef to hold the socket instance

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    console.log('Dashboard useEffect is running to establish socket connection');
    const socket = io("http://localhost:3000"); // Connect to your backend Socket.IO server
    socketRef.current = socket; // Store socket instance in ref

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket");
    });

    socket.on("newLostAndFound", (data) => {
      console.log("🔔 New Lost & Found data:", data);
      setNotifications((prev) => [
        {
          id: Date.now(), 
          message: `New ${data.type} post: ${data.description} in ${data.location}`,
        },
        ...prev, 
      ]);
    });

    socket.on("newMemorial", (data) => {
      console.log("🔔 New Memorial data:", data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New Memorial Tribute for ${data.petName}`,
        },
        ...prev, 
      ]);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.IO Connect Error:", err);
    });

    // Cleanup function: This runs when the component unmounts
    return () => {
      console.log('Dashboard useEffect cleanup running (disconnecting socket)');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Clear the ref
      }
    };
  }, []); 

  // Optional: Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".notification-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="brand-name">PetAlert</span>
        </div>
        {/* Only render nav links if sidebar is open */}
        {isSidebarOpen && (
          <nav className="sidebar-nav">
            <Link to="/about">About Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        )}
      </aside>


      <div className="main-content" onClick={closeDropdown}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <FaBars size={24} />
            </button>
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="topbar-right">
            <div className="notification-container" style={{ position: "relative" }}>
              <FaBell
                className="notification-icon"
                size={35}
                color="black"
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleDropdown();
                }}
              />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}

              {showDropdown && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <FaTimes onClick={closeDropdown} style={{ cursor: "pointer" }} />
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div key={note.id} className="notification-item">
                        {note.message}
                      </div>
                    ))
                  ) : (
                    <div className="notification-item empty">No new notifications</div>
                  )}
                </div>
              )}
            </div>
            <img src={userImg} alt="User" className="user-avatar" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <h2 className="hero-title">
            A four-legged word <span className="highlight">LOVE</span> and{" "}
            <span className="highlight">CARING</span> is how we show it.
          </h2>
          <p className="hero-subtitle">Providing expert pet care services online.</p>
          <Link to="/community-board" className="cta-button">
            <FaPaw style={{ marginRight: "8px" }} />
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
            <p>
              <FaClock /> Working Hours
            </p>
            <p>Available 24/7 on our website</p>
          </div>
          <div className="footer-info">
            <p>
              <FaMapMarkerAlt /> Location
            </p>
            <p>Kathmandu, Nepal</p>
          </div>
          <div className="footer-info">
            <p>
              <FaPhoneAlt /> Contact
            </p>
            <p>
              Got questions? <br />
              <strong>+977 9849610810</strong>
            </p>
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