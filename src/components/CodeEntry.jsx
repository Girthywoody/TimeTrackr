// src/components/CodeEntry.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getEmployeeById, verifyEmployeeCode, recordTimeAction } from '../services/firebase';
import Layout from './Layout';
import '../styles/CodeEntry.css';

const CodeEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, action } = useParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Fetch employee data from Firebase
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const employeeData = await getEmployeeById(employeeId);
        setEmployee(employeeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to load employee data. Please try again.');
        setShowError(true);
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [employeeId]);
  
  // Clear error message after 3 seconds
  useEffect(() => {
    let errorTimer;
    if (showError) {
      errorTimer = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    
    return () => clearTimeout(errorTimer);
  }, [showError]);
  
  const handleDigitPress = (digit) => {
    if (code.length < 4) {
      setCode(prevCode => prevCode + digit);
      setError('');
      setShowError(false);
    }
  };
  
  const handleBackspace = () => {
    setCode(prevCode => prevCode.slice(0, -1));
    setError('');
    setShowError(false);
  };
  
  const handleClear = () => {
    setCode('');
    setError('');
    setShowError(false);
  };
  
  const handleSubmit = async () => {
    if (processing) return;
    
    if (code.length < 4) {
      setError('Please enter a 4-digit code');
      setShowError(true);
      return;
    }
    
    try {
      setProcessing(true);
      
      // Verify the code using Firebase
      const isValid = await verifyEmployeeCode(employeeId, code);
      
      if (isValid) {
        // Record the check-in/check-out in Firebase
        await recordTimeAction(employeeId, action);
        
        navigate(`/success/${action}`, { 
          state: { 
            employeeName: employee.name,
            department: employee.department 
          } 
        });
      } else {
        setError('Invalid code. Please try again.');
        setShowError(true);
        setCode('');
      }
    } catch (error) {
      console.error('Error processing action:', error);
      setError('An error occurred. Please try again.');
      setShowError(true);
    } finally {
      setProcessing(false);
    }
  };
  
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Generate a consistent color for an employee
  const getAvatarColor = (id) => {
    const colors = [
      'var(--primary)',
      '#4f46e5',
      '#0891b2',
      '#4d7c0f',
      '#9333ea',
      '#be185d',
      '#0284c7',
      '#7c2d12',
    ];
    return colors[parseInt(id, 10) % colors.length];
  };
  
  if (loading) {
    return (
      <Layout centerContent className="code-entry-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading employee data...</p>
        </div>
      </Layout>
    );
  }
  
  if (!employee) {
    return (
      <Layout showBackButton backButtonPath="/" centerContent className="code-entry-page">
        <div className="error-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Employee Not Found</h2>
          <p>Sorry, we couldn't find this employee in our system.</p>
          <button className="btn btn-primary" onClick={() => navigate('/select-employee', { state: { action } })}>
            Back to Employee Selection
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout
      title={action === 'check-in' ? 'Check In' : 'Check Out'}
      showBackButton
      backButtonPath="/select-employee"
      centerContent
      className="code-entry-page"
    >
      <div className="code-entry-container slide-up">
        <div className="employee-profile">
          <div 
            className="employee-avatar-large"
            style={{ backgroundColor: getAvatarColor(employee.id) }}
          >
            {employee.imageUrl ? (
              <img src={employee.imageUrl} alt={employee.name} />
            ) : (
              <span>{getInitials(employee.name)}</span>
            )}
          </div>
          <h2>{employee.name}</h2>
          <span className="department-badge">{employee.department}</span>
        </div>
        
        <div className="code-display">
          <p className="code-instruction">Enter your 4-digit PIN</p>
          <div className="code-dots">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`code-dot ${i < code.length ? 'filled' : ''}`}
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
          <div className={`error-message ${showError ? 'show' : ''}`}>
            {error}
          </div>
        </div>
        
        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'backspace'].map((item, index) => {
            if (item === '') {
              return <div key={index} className="keypad-spacer"></div>;
            }
            
            if (item === 'backspace') {
              return (
                <button
                  key={index}
                  className="keypad-btn function-btn"
                  onClick={handleBackspace}
                  aria-label="Backspace"
                  disabled={processing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                    <line x1="18" y1="9" x2="12" y2="15"></line>
                    <line x1="12" y1="9" x2="18" y2="15"></line>
                  </svg>
                </button>
              );
            }
            
            return (
              <button
                key={index}
                className="keypad-btn digit-btn"
                onClick={() => handleDigitPress(item)}
                disabled={processing}
              >
                {item}
              </button>
            );
          })}
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-neutral clear-btn" 
            onClick={handleClear}
            disabled={processing}
          >
            Clear
          </button>
          <button 
            className="btn btn-primary submit-btn" 
            onClick={handleSubmit}
            disabled={code.length !== 4 || processing}
          >
            {processing ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CodeEntry;