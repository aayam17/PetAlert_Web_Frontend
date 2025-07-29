import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaBars,
  FaBell,
  FaTimes,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserFlyout, setShowUserFlyout] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket");
    });

    socket.on("newLostAndFound", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New ${data.type} post: ${data.description} in ${data.location}`,
        },
        ...prev,
      ]);
    });

    socket.on("newMemorial", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New Memorial Tribute for ${data.petName}`,
        },
        ...prev,
      ]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-container")) {
        setShowNotifications(false);
      }
      if (
        !event.target.closest(".user-avatar") &&
        !event.target.closest(".user-flyout")
      ) {
        setShowUserFlyout(false);
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
            {/* Notification */}
            <div className="notification-container">
              <FaBell
                className="notification-icon"
                size={30}
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <FaTimes
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowNotifications(false)}
                    />
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

            {/* Avatar & Flyout */}
            <div style={{ position: "relative" }}>
              <img
                src={userImg}
                alt="User"
                className="user-avatar"
                onClick={() => setShowUserFlyout(!showUserFlyout)}
              />
              {showUserFlyout && (
                <div className="user-flyout">
                  <div className="user-flyout-option" onClick={() => setShowProfileModal(true)}>
                    <FaUser /> My Profile
                  </div>
                  <div className="user-flyout-option" onClick={() => setShowSettingsDropdown(true)}>
                    <FaCog /> Settings
                  </div>
                  <div className="user-flyout-option" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </div>
                </div>
              )}
              {showSettingsDropdown && (
                <div className="settings-dropdown">
                  <div className="settings-item">Theme <span>Light</span></div>
                  <div className="settings-item">Notifications <span>On</span></div>
                </div>
              )}
            </div>
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

        {/* Services */}
        <section id="services" className="services">
          <h3 className="section-title">Our Services</h3>
          <div className="services-grid">
            {services.map((service, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h4 className="service-title">{service.title}</h4>
                <p className="service-description">{service.description}</p>
                <Link to={service.route} className="learn-more">Learn more →</Link>
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="profile-modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3>My Profile</h3>
              <FaTimes className="close-icon" onClick={() => setShowProfileModal(false)} />
            </div>
            <img src={userImg} alt="User" className="modal-avatar" />
            {loggedInUser ? (
              <>
                <div className="modal-name">{loggedInUser.username}</div>
                <div className="modal-email">{loggedInUser.email}</div>
                <div className="profile-fields">
                  <div>Role: {loggedInUser.role}</div>
                  <div>Location: Kathmandu, Nepal</div>
                </div>
              </>
            ) : (
              <div className="modal-email">User info not available</div>
            )}
            <button className="save-btn" onClick={() => setShowProfileModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;