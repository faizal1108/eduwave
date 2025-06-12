import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CodeRunnerList.css';

const CodeRunnerList = () => {
  const navigate = useNavigate();

  return (
    <div className="code-runner-list-container">
      <h1>Code Runner List</h1>
      <ul>
        <li onClick={() => navigate('/html-css-js-runner')}>HTML, CSS, JS Runner</li>
        <li onClick={() => navigate('/python-runner')}>Python Runner</li>
      </ul>
    </div>
  );
};

export default CodeRunnerList;