import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Certificate.css';

const Certificate = ({ email }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-details', {
          params: { email }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [email]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="certificate-container">
      <div className="certificate">
        <h1>Certificate of Achievement</h1>
        <p>This is to certify that</p>
        <h2>{user.fullName}</h2>
        <p>has successfully completed the</p>
        <h3>React Development Course</h3>
        <p>course on</p>
        <h4>{new Date().toLocaleDateString()}</h4>
        <div className="signatures">
          <div className="signature">
            <p>______________________</p>
            <p>Instructor</p>
          </div>
          <div className="signature">
            <p>______________________</p>
            <p>Director</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;