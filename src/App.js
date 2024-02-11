import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ImageApp from './Image_app'; // Import your GPTVisionApp component
import './App.css';

function IntroPage() {

  const openLink = () => {
    // Replace "YOUR_GRADIO_LINK" with the actual Gradio link
    window.open('http://127.0.0.1:7860', '_blank');
  }

  return (
    <div className="App">
      <header>
        <h1>Washing machine Fault Detection</h1>
      </header>

      <section>
        <h2>Welcome to our fault detection system.</h2><h3> Detect and analyze faults in washing machines with ease.</h3>
        <Link to="/image-app">
          <button id="detectFaultBtn">Let's get started</button>
        </Link>  
      </section>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/image-app" element={<ImageApp />} />
      </Routes>
    </Router>
  );
}

export default App;
