// src/components/HomeScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const goToAdmin = () => {
    navigate('/admin');
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
      
      <div className="admin-link">
        <button className="admin-btn" onClick={goToAdmin}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="admin-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;