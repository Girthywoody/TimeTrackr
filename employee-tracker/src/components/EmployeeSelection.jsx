// src/components/EmployeeSelection.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EmployeeSelection.css';

// Mock employee data - replace with your actual employee list
const employeeList = [
  { id: 1, name: 'John Smith', department: 'Engineering' },
  { id: 2, name: 'Sarah Johnson', department: 'Marketing' },
  { id: 3, name: 'Michael Brown', department: 'Finance' },
  { id: 4, name: 'Emily Davis', department: 'Human Resources' },
  { id: 5, name: 'David Wilson', department: 'Operations' },
  { id: 6, name: 'Jessica Martinez', department: 'Customer Support' },
  { id: 7, name: 'Robert Taylor', department: 'Product' },
  { id: 8, name: 'Jennifer Anderson', department: 'Sales' },
  { id: 9, name: 'Christopher Thomas', department: 'IT' },
  { id: 10, name: 'Amanda White', department: 'Legal' },
];

const EmployeeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const action = location.state?.action || 'check-in';
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployees = employeeList.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEmployeeSelect = (employeeId) => {
    navigate(`/code-entry/${employeeId}/${action}`);
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="employee-selection">
      <h1>{action === 'check-in' ? 'Check In' : 'Check Out'}</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="employee-list">
        {filteredEmployees.map((employee) => (
          <div 
            key={employee.id} 
            className="employee-card"
            onClick={() => handleEmployeeSelect(employee.id)}
          >
            <div className="employee-avatar">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="employee-info">
              <h3>{employee.name}</h3>
              <p>{employee.department}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="back-btn" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

export default EmployeeSelection;