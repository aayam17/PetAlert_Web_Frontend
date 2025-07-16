import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "../css/register.css";
import coverImage from "../assets/cover.jpg";
import api from "../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.username.trim()) {
        errors.username = "Username is required";
      }
      if (!values.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post("/auth/register", {
          username: values.username,
          email: values.email,
          password: values.password,
        });

        console.log("Registration success:", response.data);
        alert("Registered successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        alert(
          error.response?.data?.message || "Registration failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="container">
        <div className="form-container">
          <form onSubmit={formik.handleSubmit} noValidate>
            <h2>Create Account</h2>

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              {...formik.getFieldProps("username")}
              className={
                formik.errors.username && formik.touched.username
                  ? "error-input"
                  : ""
              }
              placeholder="Your username"
              autoComplete="username"
            />
            {formik.errors.username && formik.touched.username && (
              <div className="error-text">{formik.errors.username}</div>
            )}

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
              placeholder="you@example.com"
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
              placeholder="Create password"
              autoComplete="new-password"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="error-text">{formik.errors.password}</div>
            )}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...formik.getFieldProps("confirmPassword")}
              className={
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? "error-input"
                  : ""
              }
              placeholder="Confirm password"
              autoComplete="new-password"
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <div className="error-text">{formik.errors.confirmPassword}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Registering..." : "Register"}
            </button>

            <div className="toggle-text">
              Already have an account?
              <a href="/login"> Login</a>
            </div>
          </form>
        </div>
        <div className="image-container">
          <img src={coverImage} alt="Pet care" />
        </div>
      </div>
    </div>
  );
};

export default Register;
