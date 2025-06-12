import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInCommon from './pages/SignInCommon';
import SignInStudent from './pages/SignInStudent';
import SignInAdmin from './pages/SignInAdmin';
import AdminSignUp from './pages/AdminSignUp';
import StudentSignUp from './pages/StudentSignUp';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashBoard';
import AdminUpload from './pages/AdminUpload';
import VideoPlayer from './pages/VideoPlayer';
import CoursesCatalog from './pages/CoursesCatalog';
import CodeRunnerList from './pages/CodeRunnerList';
import HtmlCssJsRunner from './pages/HtmlCssJsRunner';
import PythonRunner from './pages/PythonRunner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Default Route */}
        <Route path="/common" element={<SignInCommon />} />
        
        {/* Sign Up Routes */}
        <Route path="/student-signup" element={<StudentSignUp />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />

        {/* Sign In Routes */}
        <Route path="/signin-student" element={<SignInStudent />} />
        <Route path="/signin-admin" element={<SignInAdmin />} />
        
        {/* Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Admin Upload Route */}
        <Route path="/admin-upload" element={<AdminUpload />} />

        {/* Video Player Route */}
        <Route path="/courses/:courseId/video" element={<VideoPlayer />} />
        
        {/* Courses Catalog Route */}
        <Route path="/courses-catalog" element={<CoursesCatalog />} />

        {/* Code Runner List Route */}
        <Route path="/code-runner-list" element={<CodeRunnerList />} />

        {/* Code Runners */}
        <Route path="/html-css-js-runner" element={<HtmlCssJsRunner />} />
        <Route path="/python-runner" element={<PythonRunner />} />
      </Routes>
    </>
  );
}

export default App;
