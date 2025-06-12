import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CoursesCatalog.css';

const CoursesCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://192.168.175.52:5000/courses')
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
      });
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}/video`);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-catalog-container">
      <h2>Courses Catalog</h2>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/student-dashboard')}>
        ← Back to Dashboard
      </button>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="courses-list">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="course-item"
            onClick={() => handleCourseClick(course._id)}
          >
            {course.courseName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesCatalog;
