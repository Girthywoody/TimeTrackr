import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import CheckInOut from './CheckInOut';
import { getEmployees, getHours, STORAGE_KEYS } from './mockData';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Initialize local storage with mock data if empty
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(getEmployees()));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.HOURS)) {
      localStorage.setItem(STORAGE_KEYS.HOURS, JSON.stringify(getHours()));
    }
    
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  const handleAdminLogin = () => {
    // For demo purposes, admin PIN is "admin123"
    if (adminPin === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('admin_logged_in', 'true');
      setAdminPin('');
      setShowAdminLogin(false);
    } else {
      alert('Invalid admin PIN');
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_logged_in');
  };
  
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="nav-brand">
            Employee Manager
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Check In/Out</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                <button onClick={handleAdminLogout} className="logout-button">Logout</button>
              </>
            ) : (
              <button 
                onClick={() => setShowAdminLogin(true)} 
                className="admin-login-button"
              >
                Admin Login
              </button>
            )}
          </div>
        </nav>
        
        {showAdminLogin && (
          <div className="modal">
            <div className="modal-content admin-login">
              <h2>Admin Login</h2>
              <input
                type="password"
                placeholder="Enter Admin PIN"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
              />
              <div className="modal-actions">
                <button onClick={handleAdminLogin}>Login</button>
                <button 
                  className="cancel" 
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPin('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<CheckInOut />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;