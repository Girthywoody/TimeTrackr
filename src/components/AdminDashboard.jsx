import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

import { 
  getEmployees, 
  getHours, 
  saveEmployees, 
  saveHours 
} from './mockData';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [hours, setHours] = useState([]);
  
  // Load data from local storage
  useEffect(() => {
    setEmployees(getEmployees());
    setHours(getHours());
  }, []);
  const [editEmployee, setEditEmployee] = useState(null);
  const [editHours, setEditHours] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    wage: '',
    active: true
  });

  // Employee management functions
  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.wage) {
      alert('Please fill out all fields');
      return;
    }
    
    const employee = {
      ...newEmployee,
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      wage: parseFloat(newEmployee.wage)
    };
    
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    setNewEmployee({ name: '', position: '', wage: '', active: true });
  };

  const removeEmployee = (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      const updatedEmployees = employees.filter(employee => employee.id !== id);
      const updatedHours = hours.filter(hour => hour.employeeId !== id);
      
      setEmployees(updatedEmployees);
      setHours(updatedHours);
      
      saveEmployees(updatedEmployees);
      saveHours(updatedHours);
    }
  };

  const updateEmployee = () => {
    if (!editEmployee.name || !editEmployee.position || !editEmployee.wage) {
      alert('Please fill out all fields');
      return;
    }
    
    const updatedEmployees = employees.map(employee => 
      employee.id === editEmployee.id ? {...editEmployee, wage: parseFloat(editEmployee.wage)} : employee
    );
    
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    setEditEmployee(null);
  };

  // Hours management functions
  const updateHours = () => {
    if (!editHours.checkIn || !editHours.checkOut) {
      alert('Please fill out all fields');
      return;
    }
    
    // Calculate hours worked
    const checkIn = new Date(`2025-01-01T${editHours.checkIn}`);
    const checkOut = new Date(`2025-01-01T${editHours.checkOut}`);
    const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60);
    
    const updatedHours = hours.map(hour => 
      hour.id === editHours.id ? {...editHours, hours: hoursWorked} : hour
    );
    
    setHours(updatedHours);
    saveHours(updatedHours);
    setEditHours(null);
  };

  // Group hours by date and employee for the hours table
  const groupedHours = hours.reduce((acc, hour) => {
    if (!acc[hour.date]) {
      acc[hour.date] = {};
    }
    
    const employee = employees.find(e => e.id === hour.employeeId);
    if (employee) {
      acc[hour.date][hour.employeeId] = {
        ...hour,
        employeeName: employee.name
      };
    }
    
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      
      <nav>
        <button 
          className={activeTab === 'employees' ? 'active' : ''} 
          onClick={() => setActiveTab('employees')}
        >
          Manage Employees
        </button>
        <button 
          className={activeTab === 'hours' ? 'active' : ''} 
          onClick={() => setActiveTab('hours')}
        >
          Hours Table
        </button>
      </nav>
      
      <main>
        {activeTab === 'employees' && (
          <div className="employees-section">
            <h2>Manage Employees</h2>
            
            <div className="add-employee">
              <h3>Add New Employee</h3>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Employee Name" 
                  value={newEmployee.name} 
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} 
                />
                <input 
                  type="text" 
                  placeholder="Position" 
                  value={newEmployee.position} 
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})} 
                />
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Hourly Wage" 
                  value={newEmployee.wage} 
                  onChange={(e) => setNewEmployee({...newEmployee, wage: e.target.value})} 
                />
                <button onClick={addEmployee}>Add Employee</button>
              </div>
            </div>
            
            <div className="employees-list">
              <h3>Current Employees</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Hourly Wage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.position}</td>
                      <td>${employee.wage.toFixed(2)}</td>
                      <td>{employee.active ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button onClick={() => setEditEmployee(employee)}>Edit</button>
                        <button className="remove" onClick={() => removeEmployee(employee.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {editEmployee && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Edit Employee</h3>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Employee Name" 
                      value={editEmployee.name} 
                      onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})} 
                    />
                    <input 
                      type="text" 
                      placeholder="Position" 
                      value={editEmployee.position} 
                      onChange={(e) => setEditEmployee({...editEmployee, position: e.target.value})} 
                    />
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Hourly Wage" 
                      value={editEmployee.wage} 
                      onChange={(e) => setEditEmployee({...editEmployee, wage: e.target.value})} 
                    />
                    <div className="status-toggle">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={editEmployee.active} 
                          onChange={(e) => setEditEmployee({...editEmployee, active: e.target.checked})} 
                        />
                        Active
                      </label>
                    </div>
                    <div className="modal-actions">
                      <button onClick={updateEmployee}>Save</button>
                      <button className="cancel" onClick={() => setEditEmployee(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'hours' && (
          <div className="hours-section">
            <h2>Hours Table</h2>
            
            <table className="hours-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {employees.map(employee => (
                    <th key={employee.id}>{employee.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedHours).sort().map(date => (
                  <tr key={date}>
                    <td>{new Date(date).toLocaleDateString()}</td>
                    {employees.map(employee => {
                      const hourData = groupedHours[date][employee.id];
                      return (
                        <td key={employee.id} onClick={() => hourData && setEditHours(hourData)}>
                          {hourData ? (
                            <div className="hour-cell">
                              <div>{hourData.checkIn} - {hourData.checkOut}</div>
                              <div>{hourData.hours.toFixed(2)} hours</div>
                            </div>
                          ) : (
                            <div className="hour-cell empty">No hours</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {editHours && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Edit Hours</h3>
                  <p>Employee: {employees.find(e => e.id === editHours.employeeId)?.name}</p>
                  <p>Date: {new Date(editHours.date).toLocaleDateString()}</p>
                  <div className="form-group">
                    <div className="time-inputs">
                      <label>
                        Check In:
                        <input 
                          type="time" 
                          value={editHours.checkIn} 
                          onChange={(e) => setEditHours({...editHours, checkIn: e.target.value})} 
                        />
                      </label>
                      <label>
                        Check Out:
                        <input 
                          type="time" 
                          value={editHours.checkOut} 
                          onChange={(e) => setEditHours({...editHours, checkOut: e.target.value})} 
                        />
                      </label>
                    </div>
                    <div className="modal-actions">
                      <button onClick={updateHours}>Save</button>
                      <button className="cancel" onClick={() => setEditHours(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;