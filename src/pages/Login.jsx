import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import logoPet from "../assets/logo_pet.png";
import api from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post("/auth/login", {
          email: values.email,
          password: values.password,
        });

        const token = response.data.token;
        const user = response.data.user;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert("Invalid credentials. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="container">
        <div className="left-panel">
          <div className="logo-wrapper">
            <img src={logoPet} alt="PetAlert Logo" />
          </div>
          <h2>Welcome Back!</h2>
          <p>
            Access your account, track pets, and stay connected with the
            PETALERT community.
          </p>
        </div>

        <div className="right-panel">
          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            <h2>Sign In</h2>

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              className={
                formik.errors.email && formik.touched.email
                  ? "error-input"
                  : ""
              }
              placeholder="Enter your email"
              autoComplete="email"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="error-text">{formik.errors.email}</div>
            )}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              className={
                formik.errors.password && formik.touched.password
                  ? "error-input"
                  : ""
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="error-text">{formik.errors.password}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="toggle-text">
              Don't have an account?
              <a href="/register"> Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
