import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrollCourse.css';

const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState('student@example.com'); // Replace with actual student email
  const [enrollMessage, setEnrollMessage] = useState('');

  useEffect(() => {
    axios.get('http://192.168.175.52:5000/courses')
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
      });
  }, []);

  const handleEnroll = (courseId) => {
    axios.post('http://192.168.175.52:5000/enroll-course', { email, courseId })
      .then((res) => {
        setEnrollMessage(res.data.message);
      })
      .catch((err) => {
        console.error('Error enrolling in course:', err);
        setEnrollMessage('An error occurred while enrolling in the course.');
      });
  };

  return (
    <div className="enroll-course-container">
      <div className="header">
        <h2>Enroll in Courses</h2>
      </div>

      {enrollMessage && <p className="enroll-message">{enrollMessage}</p>}

      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course._id}>
              <h3>{course.courseName}</h3>
              <p>{course.courseDescription}</p>
              <p>Price: ${course.coursePrice}</p>
              <button onClick={() => handleEnroll(course._id)}>Enroll</button>
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default EnrollCourse;