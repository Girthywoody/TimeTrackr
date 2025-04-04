import React, { useState, useEffect } from 'react';
import './CheckInOut.css';

import { getEmployees, checkEmployeePin, recordCheckInOut } from './mockData';

function CheckInOut() {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState('select'); // 'select', 'pin', 'success'
  const [action, setAction] = useState(''); // 'in' or 'out'
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch employees from storage
  useEffect(() => {
    // Filter only active employees
    const employees = getEmployees();
    setActiveEmployees(employees.filter(emp => emp.active));
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    setMode('pin');
  };

  const handlePinDigit = (digit) => {
    if (pin.length < 4) {
      setPin(prevPin => prevPin + digit);
    }
  };

  const handleClearPin = () => {
    setPin('');
  };

  const handleSubmit = () => {
    // Validate the PIN against the employee record
    if (pin.length === 4) {
      const isValid = checkEmployeePin(selectedEmployee, pin);
      
      if (isValid) {
        // Record the check-in/out
        const timestamp = new Date();
        const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Record the time entry
        const result = recordCheckInOut(selectedEmployee, action === 'in');
        
        if (result) {
          if (action === 'in') {
            setMessage(`Successfully checked in at ${timeString}`);
          } else {
            setMessage(`Successfully checked out at ${timeString}`);
          }
          
          setMode('success');
          
          // Reset after 3 seconds
          setTimeout(() => {
            setMode('select');
            setSelectedEmployee('');
            setPin('');
            setMessage('');
          }, 3000);
        } else {
          if (action === 'out') {
            alert('You must check in before checking out.');
          } else {
            alert('There was an error recording your time.');
          }
        }
      } else {
        alert('Invalid PIN. Please try again.');
        setPin('');
      }
    } else {
      alert('Please enter a 4-digit PIN');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="check-in-out">
      <header>
        <h1>Employee Time Clock</h1>
        <div className="current-time">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>
      </header>

      <main>
        {mode === 'select' && (
          <div className="action-selection">
            <h2>What would you like to do?</h2>
            <div className="action-buttons">
              <button 
                className="check-in" 
                onClick={() => setAction('in')}
              >
                Check In
              </button>
              <button 
                className="check-out" 
                onClick={() => setAction('out')}
              >
                Check Out
              </button>
            </div>
          </div>
        )}

        {action && mode === 'select' && (
          <div className="employee-selection">
            <h2>{action === 'in' ? 'Check In' : 'Check Out'}</h2>
            <p>Select your name from the list below:</p>
            
            <div className="employee-list">
              {activeEmployees.map(employee => (
                <button 
                  key={employee.id} 
                  className="employee-button"
                  onClick={() => handleEmployeeSelect(employee.id.toString())}
                >
                  {employee.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'pin' && (
          <div className="pin-entry">
            <h2>Enter your PIN</h2>
            <div className="selected-employee">
              {employees.find(emp => emp.id.toString() === selectedEmployee)?.name}
            </div>
            
            <div className="pin-display">
              <div className="pin-dots">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`}></div>
                ))}
              </div>
            </div>
            
            <div className="pin-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button 
                  key={digit} 
                  className="pin-digit"
                  onClick={() => handlePinDigit(digit)}
                >
                  {digit}
                </button>
              ))}
              <button className="pin-clear" onClick={handleClearPin}>Clear</button>
              <button className="pin-digit" onClick={() => handlePinDigit(0)}>0</button>
              <button className="pin-submit" onClick={handleSubmit}>Enter</button>
            </div>
            
            <button className="back-button" onClick={() => {
              setSelectedEmployee('');
              setPin('');
              setMode('select');
            }}>
              Back
            </button>
          </div>
        )}

        {mode === 'success' && (
          <div className="success-message">
            <h2>Success!</h2>
            <p>{message}</p>
            <div className="checkmark">✓</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckInOut;