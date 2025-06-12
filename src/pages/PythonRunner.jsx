import React from 'react';

const PythonRunner = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="http://127.0.0.1:5500/src/online-python-compiler-main/index.html"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Python Compiler"
      />
    </div>
  );
};

export default PythonRunner;
