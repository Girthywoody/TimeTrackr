// src/components/SuccessScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SuccessScreen.css';

const SuccessScreen = () => {
  const navigate = useNavigate();
  const { action } = useParams();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  useEffect(() => {
    // Automatically return to home screen after 5 seconds
    const timeout = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);
  
  return (
    <div className="success-screen">
      <div className="success-icon">✓</div>
      <h1>Successfully {action === 'check-in' ? 'Checked In' : 'Checked Out'}</h1>
      <h2>at {currentTime}</h2>
      <p>Returning to home screen...</p>
    </div>
  );
};

export default SuccessScreen;
