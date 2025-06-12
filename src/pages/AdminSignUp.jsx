import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideForSignUp from "../components/SideForSignUp";
import "./AdminSignUp.css";
import logo from "../assets/image.png";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://192.168.175.52:5000/admin-signup", formData);
      console.log(response.data);
      alert("Signup successful!");
      navigate("/admin-dashboard"); // Redirect to admin dashboard after successful signup
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during signup.");
    }
  };

  return (
    <div className="signup-container">
      <SideForSignUp />
      <div className="signup-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Admin Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="signin-link">
          Already have an account? <a href="/signin-admin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default AdminSignUp;