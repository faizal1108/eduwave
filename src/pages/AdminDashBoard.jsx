import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './AdminDashboard.css'; // Import the CSS file
import SideBar from '../components/SideBar';

const AdminDashboard = () => {
  // State to store dashboard data
  const [dashboardData, setDashboardData] = useState({
    chartData: [],
    coursesUploaded: 0,
    studentsSignedUp: 0,
    hoursLearning: "0h 0m",
    profile: { name: "", email: "", mobile: "" },
    courses: [],
    videoUploadsByDay: []
  });

  const navigate = useNavigate();

  // Fetch data from backend
  const fetchDashboardData = () => {
    axios.get('http://localhost:5000/admin-dashboard')
      .then((res) => {
        setDashboardData(prevData => ({
          ...prevData,
          ...res.data
        }));
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));

    axios.get('http://localhost:5000/video-uploads-by-day')
      .then((res) => {
        console.log("Video Uploads API Response:", res.data); // Debugging log
        if (Array.isArray(res.data)) {
          setDashboardData(prevData => ({
            ...prevData,
            videoUploadsByDay: res.data
          }));
        }
      })
      .catch((err) => console.error("Error fetching video uploads by day:", err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUploadClick = () => {
    navigate('/admin-upload');
  };

  const handleDeleteCourse = (courseId) => {
    axios.delete(`http://192.168.175.52:5000/delete-course/${courseId}`)
      .then((res) => {
        console.log(res.data.message);
        fetchDashboardData(); // Refresh data after deletion
      })
      .catch((err) => console.error("Error deleting course:", err));
  };

  return (
    <div className="admin-dashboard-container">
      
      <div className="header">
        <h2>Admin Dashboard</h2>
      </div>

      {/* Overview Cards Section */}
      <div className="overview">
        <div className="overview-card">
          <h3>Courses Uploaded</h3>
          <p>{dashboardData.coursesUploaded}</p>
        </div>
        <div className="overview-card">
          <h3>Students Signed Up</h3>
          <p>{dashboardData.studentsSignedUp}</p>
        </div>
      </div>

      {/* Video Uploads by Day Chart Section */}
      <div className="video-uploads-section">
        <h3>Video Uploads by Day</h3>
        {dashboardData.videoUploadsByDay.length > 0 ? (
          <ResponsiveContainer width="90%" height={300}>
            <LineChart
              data={dashboardData.videoUploadsByDay}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No video upload data available.</p>
        )}
      </div>

      {/* List of Courses Section */}
      <div className="courses-section">
        <h3>Courses</h3>
        <ul>
          {dashboardData.courses.map(course => (
            <li key={course._id} className="course-item">
              <div className="course-name">{course.courseName}</div>
              <div className="course-details">
                <button className="delete-btn" onClick={() => handleDeleteCourse(course._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Admin Upload Section */}
      <div className="upload-section">
        <button className="upload-btn" onClick={handleUploadClick}>
          Upload Course Materials
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
