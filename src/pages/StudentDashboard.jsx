import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './StudentDashboard.css';
import SideBar from '../components/SideBar';

import videoFile from '../assets/15714-266043580_medium.mp4';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    coursesInProgress: 0,
    coursesCompleted: 0,
    hoursLearning: '0h 0m',
    activeTimeData: []
  });

  useEffect(() => {
    const email = 'student@example.com'; // Example email, replace with actual user email
    axios
      .get(`http://192.168.175.52:5000/student-dashboard?email=${email}`)
      .then((res) => {
        setDashboardData(prevState => ({
          ...prevState,
          ...res.data
        }));
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
      });

    axios
      .get(`http://192.168.175.52:5000/student/active-time?email=${email}`)
      .then((res) => {
        setDashboardData(prevState => ({
          ...prevState,
          activeTimeData: res.data
        }));
      })
      .catch((err) => {
        console.error('Error fetching active time data:', err);
      });
  }, []);

  const handleGoToCatalog = () => {
    navigate('/courses-catalog');
  };

  const handleGoToCodeRunnerList = () => {
    navigate('/code-runner-list');
  };

  return (
    <div className="student-dashboard-container">
    

      <SideBar />
      
      <div className="header">
        <h2>Student Dashboard</h2>
      </div>

      {/* Overview Cards Section */}
      <div className="overview">
        <div className="overview-card">
          <h3>Available courses</h3>
          <p>2</p>
        </div>
        <div className="overview-card">
          <h3>Courses Completed</h3>
          <p>{dashboardData.coursesCompleted}</p>
        </div>
      </div>
          <video className="background-video" autoPlay loop muted playsInline >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
      {/* Buttons Section */}
      <div className="buttons-section">
        <button onClick={handleGoToCatalog}>Go to Courses Catalog</button>
        <button onClick={handleGoToCodeRunnerList}>Go to Code Runner List</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
