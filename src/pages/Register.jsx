import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import coverImage from "../assets/cover.jpg"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Registering user:", { username, email, password });
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        * {
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Inter', sans-serif;
          background: #f0f2f5;
        }

        #root {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          height: 100vh;
        }

        .register-container {
          display: flex;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          max-width: 900px;
          width: 100%;
          overflow: hidden; /* prevent overflow from image */
        }

        .register-wrapper {
          flex: 1;
          padding: 48px 36px;
          max-width: 420px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 32px;
          letter-spacing: 0.04em;
          user-select: none;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        label {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: #555;
          user-select: none;
        }

        input {
          padding: 14px 16px;
          font-size: 1rem;
          border: 1.8px solid #ccc;
          border-radius: 12px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          outline-offset: 2px;
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
          user-select: none;
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
          user-select: none;
        }

        button:hover, button:focus-visible {
          background: linear-gradient(90deg, #4338ca, #2563eb);
          box-shadow: 0 8px 20px rgba(59,130,246,0.5);
          outline: none;
        }

        .login-text {
          margin-top: auto;
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
          user-select: none;
        }

        .login-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
          margin-left: 5px;
          transition: color 0.25s ease;
        }

        .login-link:hover, .login-link:focus-visible {
          color: #4338ca;
          text-decoration: underline;
          outline: none;
        }

        .register-image {
          flex: 1;
          background-size: cover;
          background-position: center;
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
        }

        @media (max-width: 768px) {
          .register-container {
            flex-direction: column;
            max-width: 420px;
            border-radius: 16px;
          }

          .register-image {
            height: 200px;
            border-radius: 0 0 16px 16px;
          }
        }
      `}</style>

      <main className="register-container" role="main" aria-labelledby="register-title" tabIndex={-1}>
        <section className="register-wrapper">
          <h1 id="register-title" className="register-title">Create Account</h1>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className={errors.username ? "input-error" : ""}
              aria-describedby={errors.username ? "username-error" : undefined}
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
              placeholder="you@example.com"
              className={errors.email ? "input-error" : ""}
              aria-describedby={errors.email ? "email-error" : undefined}
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
              placeholder="Create password"
              className={errors.password ? "input-error" : ""}
              aria-describedby={errors.password ? "password-error" : undefined}
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
              placeholder="Confirm password"
              className={errors.confirmPassword ? "input-error" : ""}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p id="confirmPassword-error" className="error-text">{errors.confirmPassword}</p>}

            <button type="submit" aria-label="Register your account">Register</button>
          </form>

          <p className="login-text">
            Already have an account?
            <a href="/login" className="login-link" aria-label="Login to your account">Login</a>
          </p>
        </section>

        <aside className="register-image" aria-hidden="true" style={{ backgroundImage: `url(${coverImage})` }} />
      </main>
    </>
  );
};

export default Register;