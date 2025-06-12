import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.175.52:5000/courses/${courseId}`)
      .then((res) => {
        setCourse(res.data);
        setComments(res.data.comments);
        
        // Trigger a toast notification when the course is accessed
        toast.success(`You have enrolled in ${res.data.courseName}!`, {
          position: 'top-right',
          autoClose: 3000,
        });
      })
      .catch((err) => {
        console.error('Error fetching course data:', err);
        setError('An error occurred while fetching the course data.');
      });
  }, [courseId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://192.168.175.52:5000/courses/${courseId}/comments`, { user: 'student', text: comment });
      setComments([...comments, { user: 'student', text: comment, date: new Date() }]);
      setComment('');
      
      // Show success toast notification when a comment is added
      toast.success('Comment added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('An error occurred while adding the comment.');
      
      // Show error toast notification
      toast.error('Failed to add comment!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-player-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <h2>{course.courseName}</h2>
      <p>{course.courseDescription}</p>
      {course.videoPaths && course.videoPaths.length > 0 ? (
        <video controls>
          <source src={`http://192.168.175.52:5000/videos/${course.videoPaths[0]}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No videos available for this course.</p>
      )}

      {/* PDF Download Section */}
      <div className="pdf-download-section">
        <h3>Course Materials</h3>
        {course.pdfPaths && course.pdfPaths.length > 0 ? (
          course.pdfPaths.map((pdfPath, index) => (
            <div key={index}>
              <a href={`http://192.168.175.52:5000/pdfs/${pdfPath}`} download>
                Download PDF {index + 1}
              </a>
            </div>
          ))
        ) : (
          <p>No PDF materials available for this course.</p>
        )}
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit</button>
        </form>
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p><strong>{comment.user}</strong>: {comment.text}</p>
              <p className="comment-date">{new Date(comment.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
