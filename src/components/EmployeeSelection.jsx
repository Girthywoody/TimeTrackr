// src/components/EmployeeSelection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import '../styles/EmployeeSelection.css';

// Mock employee data - replace with Firebase fetching later
const employeeList = [
  { id: 1, name: 'John Smith', department: 'Engineering', imageUrl: null },
  { id: 2, name: 'Sarah Johnson', department: 'Marketing', imageUrl: null },
  { id: 3, name: 'Michael Brown', department: 'Finance', imageUrl: null },
  { id: 4, name: 'Emily Davis', department: 'Human Resources', imageUrl: null },
  { id: 5, name: 'David Wilson', department: 'Operations', imageUrl: null },
  { id: 6, name: 'Jessica Martinez', department: 'Customer Support', imageUrl: null },
  { id: 7, name: 'Robert Taylor', department: 'Product', imageUrl: null },
  { id: 8, name: 'Jennifer Anderson', department: 'Sales', imageUrl: null },
  { id: 9, name: 'Christopher Thomas', department: 'IT', imageUrl: null },
  { id: 10, name: 'Amanda White', department: 'Legal', imageUrl: null },
  { id: 11, name: 'Matthew Garcia', department: 'Engineering', imageUrl: null },
  { id: 12, name: 'Lisa Rodriguez', department: 'Marketing', imageUrl: null },
];

const EmployeeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const action = location.state?.action || 'check-in';
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employeeList);
  
  // Focus the search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Filter employees when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employeeList);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = employeeList.filter(employee =>
      employee.name.toLowerCase().includes(lowercasedSearch) ||
      employee.department.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredEmployees(filtered);
  }, [searchTerm]);
  
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
    return colors[id % colors.length];
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
        {filteredEmployees.length === 0 ? (
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
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id} 
                className="employee-card slide-up"
                style={{ animationDelay: `${(employee.id % 10) * 50}ms` }}
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