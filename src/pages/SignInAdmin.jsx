import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideForSignUp from "../components/SideForSignUp";
import "./SignInAdmin.css";
import logo from "../assets/image.png";

const SignInAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.175.52:5000/admin-login", { email, password });
      console.log("Response:", response.data);
      alert("Login successful!");

      // Navigate to admin dashboard after login
      navigate("/admin-dashboard"); 
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="login-container">
      <SideForSignUp />
      <div className="login-box">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="signup-link">
          Don't have an account? <a href="/admin-signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInAdmin;