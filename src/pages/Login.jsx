import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPet from '../assets/logo_pet.png';
import api from '../api/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token); 
        navigate("/dashboard"); 
      } else {
        alert("No token received. Login failed.");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid credentials. Please try again.");
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
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          text-align: center;
        }
        .logo-wrapper {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.2);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
          max-width: 250px;
          width: 100%;
        }
        .logo-wrapper::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          opacity: 0.1;
          border-radius: 20px;
          pointer-events: none;
        }
        .logo-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.45);
        }
        .logo-wrapper img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }
        .left-panel h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }
        .left-panel p {
          font-size: 1rem;
          line-height: 1.6;
        }
        .right-panel {
          flex: 1;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-title {
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
        .register-text {
          margin-top: 28px;
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
        }
        .register-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
          margin-left: 5px;
        }
        .register-link:hover, .register-link:focus-visible {
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
          .logo-wrapper {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="container" role="main">
        <div className="left-panel" aria-hidden="true">
          <div className="logo-wrapper">
            <img src={logoPet} alt="Pet Illustration" />
          </div>
          <h2>Welcome Back!</h2>
          <p>Access your account, track pets, and stay connected with the PETALERT community.</p>
        </div>

        <div className="right-panel">
          <h1 className="login-title">Sign In</h1>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username"
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
              autoComplete="current-password"
            />
            {errors.password && <p id="password-error" className="error-text">{errors.password}</p>}

            <button type="submit" aria-label="Login to your account">Login</button>
          </form>

          <p className="register-text">
            Don't have an account?
            <a href="/register" className="register-link">Register</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
