import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Your global styles
import App from './App'; // Home page (login page)
import Profile from './pages/Profile'; // Profile page
import Login from './pages/Login'; // Login page
import Callback from './pages/Callback'; // Callback page after login

// Main entry point where routing is set up
const Main = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route (could be your landing page, or directly show login if you want) */}
        <Route path="/" element={<App />} /> 

        {/* Login Route (login button page) */}
        <Route path="/login" element={<Login />} /> 

        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} /> 

        {/* Callback Route (Spotify redirects here after login) */}
        <Route path="/callback" element={<Callback />} />
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
