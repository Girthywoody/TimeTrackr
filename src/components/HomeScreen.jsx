// src/components/HomeScreen.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleCheckIn = () => {
    navigate('/select-employee', { state: { action: 'check-in' } });
  };

  const handleCheckOut = () => {
    navigate('/select-employee', { state: { action: 'check-out' } });
  };
  
  return (
    <div className="home-screen">
      <div className="time-display">
        <h1>{currentTime}</h1>
        <h2>{currentDate}</h2>
      </div>
      
      <div className="company-logo">
        <h1>TimeTrackr</h1>
      </div>
      
      <div className="action-buttons">
        <button className="check-in-btn" onClick={handleCheckIn}>
          Check In
        </button>
        <button className="check-out-btn" onClick={handleCheckOut}>
          Check Out
        </button>
      </div>
      
      <div className="admin-section">
        <Link to="/admin" className="admin-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="admin-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Admin Dashboard
        </Link>
        
        <Link to="/diagnostics" className="diagnostic-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="diagnostic-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          System Diagnostics
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;