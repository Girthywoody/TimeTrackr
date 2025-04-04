// src/components/EmployeeSelection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEmployees, searchEmployees } from '../services/firebase';
import Layout from './Layout';
import '../styles/EmployeeSelection.css';

const EmployeeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const action = location.state?.action || 'check-in';
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load employees from Firebase
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeeData = await getEmployees();
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Focus the search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Filter employees when search term changes
  useEffect(() => {
    const filterEmployees = async () => {
      if (searchTerm.trim() === '') {
        setFilteredEmployees(employees);
        return;
      }
      
      try {
        const filtered = await searchEmployees(searchTerm);
        setFilteredEmployees(filtered);
      } catch (error) {
        console.error('Error searching employees:', error);
      }
    };
    
    filterEmployees();
  }, [searchTerm, employees]);
  
  const handleEmployeeSelect = (employeeId) => {
    navigate(`/code-entry/${employeeId}/${action}`);
  };
  
  // Generate initials from name
  const getInitials = (name) => {
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

  return (
    <Layout 
      title={action === 'check-in' ? 'Check In' : 'Check Out'}
      subtitle="Select an employee"
      showBackButton
      backButtonPath="/"
      className="employee-selection-page"
    >
      <div className="search-container slide-up">
        <div className="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-button" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="employee-list-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="no-results">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="no-results-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No employees found</p>
            <button className="btn btn-neutral" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="employee-list">
            {filteredEmployees.map((employee, index) => (
              <div 
                key={employee.id} 
                className="employee-card slide-up"
                style={{ animationDelay: `${(index % 10) * 50}ms` }}
                onClick={() => handleEmployeeSelect(employee.id)}
              >
                <div 
                  className="employee-avatar"
                  style={{ 
                    backgroundColor: getAvatarColor(employee.id),
                  }}
                >
                  {employee.imageUrl ? (
                    <img src={employee.imageUrl} alt={employee.name} />
                  ) : (
                    <span>{getInitials(employee.name)}</span>
                  )}
                </div>
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <span className="department-badge">
                    {employee.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeSelection;