// src/components/CodeEntry.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import '../styles/code-entry.css';

const CodeEntry = () => {
  const navigate = useNavigate();
  const { employeeId, action } = useParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  
  // Mock function to get employee data - replace with Firebase fetching later
  useEffect(() => {
    // Simulate loading from a database
    const loadEmployee = setTimeout(() => {
      // In a real app, you would fetch this from Firebase
      const employeeData = {
        1: { id: 1, name: 'John Smith', department: 'Engineering', code: '1234' },
        2: { id: 2, name: 'Sarah Johnson', department: 'Marketing', code: '2345' },
        3: { id: 3, name: 'Michael Brown', department: 'Finance', code: '3456' },
        4: { id: 4, name: 'Emily Davis', department: 'Human Resources', code: '4567' },
        5: { id: 5, name: 'David Wilson', department: 'Operations', code: '5678' },
        6: { id: 6, name: 'Jessica Martinez', department: 'Customer Support', code: '6789' },
        7: { id: 7, name: 'Robert Taylor', department: 'Product', code: '7890' },
        8: { id: 8, name: 'Jennifer Anderson', department: 'Sales', code: '8901' },
        9: { id: 9, name: 'Christopher Thomas', department: 'IT', code: '9012' },
        10: { id: 10, name: 'Amanda White', department: 'Legal', code: '0123' },
        11: { id: 11, name: 'Matthew Garcia', department: 'Engineering', code: '1122' },
        12: { id: 12, name: 'Lisa Rodriguez', department: 'Marketing', code: '2233' },
      };
      
      setEmployee(employeeData[employeeId]);
      setLoading(false);
    }, 600); // Simulated load time
    
    return () => clearTimeout(loadEmployee);
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
  
  const handleSubmit = () => {
    if (code.length < 4) {
      setError('Please enter a 4-digit code');
      setShowError(true);
      return;
    }
    
    // In a real app, you would validate this against your Firebase database
    if (employee && code === employee.code) {
      // Record the check-in/check-out in your system
      const timestamp = new Date().toISOString();
      console.log(`Employee ${employee.name} ${action} at ${timestamp}`);
      
      // In a real app with Firebase, you would do something like:
      // db.collection('timeRecords').add({
      //   employeeId: Number(employeeId),
      //   employeeName: employee.name,
      //   action: action,
      //   timestamp: firebase.firestore.FieldValue.serverTimestamp()
      // });
      
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
    return colors[id % colors.length];
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
          >
            Clear
          </button>
          <button 
            className="btn btn-primary submit-btn" 
            onClick={handleSubmit}
            disabled={code.length !== 4}
          >
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CodeEntry;