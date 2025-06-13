import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import coverImage from "../assets/cover.jpg";
import api from '../api/axios';  // named import

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    try {
      const response = await api.post('/register', { username, email, password });
      console.log("Registration success:", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Failed to register. Please try again.");
      }
    }
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Inter', sans-serif;
          background: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          min-height: 100vh;
          min-width: 100vw;
        }
        .container {
          display: flex;
          width: 100vw;
          height: 100vh;
          max-width: 900px;
          max-height: 600px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .left-panel {
          flex: 1;
          background: url(${coverImage}) no-repeat center center/cover;
          border-radius: 16px 0 0 16px;
        }
        .right-panel {
          flex: 1;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fff;
        }
        .register-title {
          font-size: 2rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 32px;
          text-align: center;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: #555;
        }
        input {
          padding: 14px 16px;
          font-size: 1rem;
          border: 1.8px solid #ccc;
          border-radius: 12px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          margin-bottom: 18px;
        }
        input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 6px #4f46e5aa;
        }
        input.input-error {
          border-color: #ef4444;
          box-shadow: 0 0 6px #ef4444aa;
        }
        .error-text {
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: -14px;
          margin-bottom: 18px;
        }
        .api-error-text {
          color: #b91c1c;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 18px;
          text-align: center;
        }
        button {
          padding: 16px 0;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          background: linear-gradient(90deg, #4f46e5, #3b82f6);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        button:hover, button:focus-visible {
          background: linear-gradient(90deg, #4338ca, #2563eb);
          box-shadow: 0 8px 20px rgba(59,130,246,0.5);
        }
        .login-text {
          margin-top: 28px;
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
        }
        .login-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
          margin-left: 5px;
        }
        .login-link:hover, .login-link:focus-visible {
          color: #4338ca;
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            height: auto;
            width: 100%;
            max-width: none;
            max-height: none;
          }
          .left-panel, .right-panel {
            width: 100%;
            padding: 30px;
          }
        }
      `}</style>

      <div className="container" role="main">
        <div className="left-panel" aria-hidden="true" />

        <div className="right-panel">
          <h1 className="register-title">Create Account</h1>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={errors.username ? "input-error" : ""}
              aria-describedby="username-error"
              required
              autoComplete="username"
            />
            {errors.username && <p id="username-error" className="error-text">{errors.username}</p>}

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? "input-error" : ""}
              aria-describedby="email-error"
              required
              autoComplete="email"
            />
            {errors.email && <p id="email-error" className="error-text">{errors.email}</p>}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
              aria-describedby="password-error"
              required
              autoComplete="new-password"
            />
            {errors.password && <p id="password-error" className="error-text">{errors.password}</p>}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "input-error" : ""}
              aria-describedby="confirmPassword-error"
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p id="confirmPassword-error" className="error-text">{errors.confirmPassword}</p>}

            {apiError && <p className="api-error-text" role="alert">{apiError}</p>}

            <button type="submit" aria-label="Create your account">Register</button>
          </form>

          <p className="login-text">
            Already have an account?
            <a href="/login" className="login-link">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
