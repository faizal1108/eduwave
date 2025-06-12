import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminUpload.css';
import logo from '../assets/image.png';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [videoFiles, setVideoFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false); // Initially hidden
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVideoChange = (e) => setVideoFiles([...e.target.files]);
  const handlePdfChange = (e) => setPdfFiles([...e.target.files]);

  const handleQuizChange = (index, field, value) => {
    const newQuiz = [...quiz];
    if (field === 'question' || field === 'correctAnswer') {
      newQuiz[index][field] = value;
    } else {
      newQuiz[index].options[field] = value;
    }
    setQuiz(newQuiz);
  };

  const handleAddQuestion = () => {
    if (!showQuiz) setShowQuiz(true); // Show quiz form when adding the first question
    setQuiz([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuiz = quiz.filter((_, i) => i !== index);
    setQuiz(newQuiz);
    if (newQuiz.length === 0) setShowQuiz(false); // Hide if no questions remain
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoFiles.length === 0 || pdfFiles.length === 0 || !courseName || !courseDescription || !coursePrice) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    videoFiles.forEach((file) => formData.append("videos", file));
    pdfFiles.forEach((file) => formData.append("pdfs", file));
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("coursePrice", coursePrice);
    formData.append("quiz", JSON.stringify(quiz));

    try {
      await axios.post("http://192.168.175.52:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Files uploaded successfully!");
      setError("");
      setCourseName("");
      setCourseDescription("");
      setCoursePrice("");
      setVideoFiles([]);
      setPdfFiles([]);
      setQuiz([]);
      setShowQuiz(false);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during file upload.");
      setSuccess("");
    }
  };

  return (
    <div className="upload-container">
      <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
        ← Back to Admin Dashboard
      </button>

      <div className="upload-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Upload Course Materials</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Course Name</label>
            <input type="text" placeholder="Enter course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Course Description</label>
            <textarea placeholder="Enter course description" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Course Price</label>
            <input type="number" placeholder="Enter course price" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Video Files</label>
            <input type="file" accept="video/*" multiple onChange={handleVideoChange} required />
          </div>
          <div className="input-group">
            <label>PDF Files</label>
            <input type="file" accept="application/pdf" multiple onChange={handlePdfChange} required />
          </div>

          {/* Show Add Quiz Button if no quiz questions exist */}
          {!showQuiz && <button type="button" className="add-question-btn" onClick={handleAddQuestion}>Add Quiz</button>}

          {showQuiz && (
            <div>
              <h3>Quiz</h3>
              {quiz.map((q, index) => (
                <div key={index} className="quiz-question">
                  <input type="text" placeholder="Question" value={q.question} onChange={(e) => handleQuizChange(index, 'question', e.target.value)} required />
                  {q.options.map((option, optIndex) => (
                    <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={option} onChange={(e) => handleQuizChange(index, optIndex, e.target.value)} required />
                  ))}
                  <input type="text" placeholder="Correct Answer" value={q.correctAnswer} onChange={(e) => handleQuizChange(index, 'correctAnswer', e.target.value)} required />
                  <button type="button" className="delete-question-btn" onClick={() => handleDeleteQuestion(index)}>Delete Question</button>
                </div>
              ))}
              <button type="button" className="add-question-btn" onClick={handleAddQuestion}>Add Another Question</button>
            </div>
          )}

          <button type="submit" className="upload-btn">Upload</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default AdminUpload;
