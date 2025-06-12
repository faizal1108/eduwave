import React, { useState } from 'react';
import './HtmlCssJsRunner.css';

const HtmlCssJsRunner = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  const runCode = () => {
    const outputFrame = document.getElementById('output-frame');
    const output = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Output</title>
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        </script>
      </body>
      </html>
    `;
    outputFrame.srcdoc = output;
  };

  return (
    <div className="code-runner-container">
      <h2>HTML, CSS, JS Runner</h2>
      <div className="editor-container">
        <div className="editor">
          <h3>HTML</h3>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="Write HTML here"
          ></textarea>
        </div>
        <div className="editor">
          <h3>CSS</h3>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            placeholder="Write CSS here"
          ></textarea>
        </div>
        <div className="editor">
          <h3>JavaScript</h3>
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            placeholder="Write JavaScript here"
          ></textarea>
        </div>
      </div>
      <button onClick={runCode}>Run Code</button>
      <h3>Output</h3>
      <iframe id="output-frame"></iframe>
    </div>
  );
};

export default HtmlCssJsRunner;