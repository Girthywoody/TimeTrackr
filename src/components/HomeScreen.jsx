// src/components/HomeScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

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
        <h1>COMPANY NAME</h1>
      </div>
      
      <div className="action-buttons">
        <button className="check-in-btn" onClick={handleCheckIn}>
          Check In
        </button>
        <button className="check-out-btn" onClick={handleCheckOut}>
          Check Out
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;