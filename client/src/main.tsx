import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Your global styles
import App from './App';
import Profile from './pages/Profile'; // Make sure Profile component is imported

// Main entry point where routing is set up
const Main = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<App />} />

        {/* Profile Route */}
        <Route path="\" element={<h1>Welcome to WrappedNow</h1>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

// Render the Main component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
