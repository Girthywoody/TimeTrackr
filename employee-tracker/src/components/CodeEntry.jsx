// src/components/CodeEntry.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CodeEntry.css';

const CodeEntry = () => {
  const navigate = useNavigate();
  const { employeeId, action } = useParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState(null);
  
  // Mock function to get employee data - replace with your actual implementation
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const employeeData = {
      1: { id: 1, name: 'John Smith', department: 'Engineering', code: '1234' },
      2: { id: 2, name: 'Sarah Johnson', department: 'Marketing', code: '2345' },
      3: { id: 3, name: 'Michael Brown', department: 'Finance', code: '3456' },
      // ... add codes for other employees
    };
    
    setEmployee(employeeData[employeeId]);
  }, [employeeId]);
  
  const handleDigitPress = (digit) => {
    if (code.length < 4) {
      setCode(prevCode => prevCode + digit);
      setError('');
    }
  };
  
  const handleBackspace = () => {
    setCode(prevCode => prevCode.slice(0, -1));
    setError('');
  };
  
  const handleClear = () => {
    setCode('');
    setError('');
  };
  
  const handleSubmit = () => {
    if (code.length < 4) {
      setError('Please enter a 4-digit code');
      return;
    }
    
    // In a real app, you would validate this against your backend
    if (employee && code === employee.code) {
      // Record the check-in/check-out in your system
      const timestamp = new Date().toISOString();
      console.log(`Employee ${employee.name} ${action} at ${timestamp}`);
      
      // In a real app, you would send this to your backend:
      // saveTimeRecord(employeeId, action, timestamp);
      
      navigate(`/success/${action}`);
    } else {
      setError('Invalid code. Please try again.');
      setCode('');
    }
  };
  
  const handleBack = () => {
    navigate('/select-employee', { state: { action } });
  };
  
  const renderKeypad = () => {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    
    return (
      <div className="keypad">
        {digits.map(digit => (
          <button 
            key={digit} 
            className="digit-btn" 
            onClick={() => handleDigitPress(digit)}
          >
            {digit}
          </button>
        ))}
        <button className="function-btn" onClick={handleClear}>Clear</button>
        <button className="function-btn" onClick={handleBackspace}>←</button>
      </div>
    );
  };
  
  if (!employee) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="code-entry">
      <h1>{action === 'check-in' ? 'Check In' : 'Check Out'}</h1>
      <h2>{employee.name}</h2>
      
      <div className="code-display">
        <div className="code-dots">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`code-dot ${i < code.length ? 'filled' : ''}`}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
      
      {renderKeypad()}
      
      <div className="action-buttons">
        <button className="back-btn" onClick={handleBack}>
          Back
        </button>
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={code.length !== 4}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEntry;