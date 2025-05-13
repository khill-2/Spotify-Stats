
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Tailwind or global CSS
import Login from './pages/Login';
import Callback from './pages/Callback';
import Profile from './pages/Profile';
import { injectSpeedInsights } from '@vercel/speed-insights';
injectSpeedInsights();

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
