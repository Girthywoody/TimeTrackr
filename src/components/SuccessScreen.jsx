// src/components/SuccessScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import '../styles/SuccessScreen.css';

const SuccessScreen = () => {
  const navigate = useNavigate();
  const { action } = useParams();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(5);
  
  // Get employee data from location state if available
  const employeeName = location.state?.employeeName || '';
  const department = location.state?.department || '';
  
  // Current time and date
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  const formattedDate = currentTime.toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Automatically return to home screen after 5 seconds
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, navigate]);
  
  // Action text and icon
  const getActionDetails = () => {
    if (action === 'check-in') {
      return {
        title: 'Checked In',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"></path>
          </svg>
        )
      };
    } else {
      return {
        title: 'Checked Out',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"></path>
          </svg>
        )
      };
    }
  };
  
  const { title, icon } = getActionDetails();
  
  return (
    <Layout centerContent className="success-screen-page">
      <div className="success-container slide-up">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <div className="success-message">
          <h1>Successfully {title}</h1>
          {employeeName && <h2>{employeeName}</h2>}
          {department && <span className="department-badge">{department}</span>}
        </div>
        
        <div className="success-details">
          <div className="detail-item">
            <div className="detail-icon">
              {icon}
            </div>
            <div className="detail-text">
              <span>Action</span>
              <strong>{title}</strong>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="detail-text">
              <span>Time</span>
              <strong>{formattedTime}</strong>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="detail-text">
              <span>Date</span>
              <strong>{formattedDate}</strong>
            </div>
          </div>
        </div>
        
        <div className="timeout-message">
          <div className="timeout-progress">
            <div 
              className="timeout-bar" 
              style={{ width: `${(timeLeft / 5) * 100}%` }}
            ></div>
          </div>
          <p>Returning to home screen in {timeLeft} seconds...</p>
        </div>
        
        <button 
          className="btn btn-primary home-btn" 
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </Layout>
  );
};

export default SuccessScreen;