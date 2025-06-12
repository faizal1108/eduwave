import React from "react";
import { useNavigate } from "react-router-dom";
import SideForSignUp from '../components/SideForSignUp';
import logo from '../assets/image.png';
import './SignInCommon.css';

const SignInCommon = () => {
  

  return (
    <div className="login-container">
      <SideForSignUp />
      <div className="title">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="buttons">
        <button className="login-btn" onClick={handleStudentSignIn}>Student</button>
        <button className="login-btn" onClick={handleAdminSignIn}>Admin</button>
      </div>
    </div>
  );
};

export default SignInCommon;