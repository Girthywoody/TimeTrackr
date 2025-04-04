// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  getEmployees,
  getAllTimeRecords,
  calculateHoursWorked 
} from '../services/firebase';
import Layout from './Layout';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [timeRecords, setTimeRecords] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hours'); // 'hours', 'records', 'employees'
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const employeeData = await getEmployees();
        setEmployees(employeeData);
        
        // Fetch time records
        const records = await getAllTimeRecords();
        setTimeRecords(records);
        
        // Calculate hours worked for each employee
        const hoursData = {};
        for (const employee of employeeData) {
          const hours = await calculateHoursWorked(
            employee.id, 
            new Date(dateRange.startDate), 
            new Date(dateRange.endDate)
          );
          hoursData[employee.id] = hours;
        }
        setHoursWorked(hoursData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const formatHours = (hours) => {
    if (isNaN(hours)) return '0h 0m';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours}h ${minutes}m`;
  };
  
  const renderEmployeeHours = () => {
    return (
      <div className="hours-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Total Hours</th>
              <th>Daily Average</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const employeeHours = hoursWorked[employee.id] || { totalHours: 0, dailyHours: [] };
              const dailyAverage = employeeHours.dailyHours.length > 0 
                ? employeeHours.totalHours / employeeHours.dailyHours.length 
                : 0;
              
              return (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>{formatHours(employeeHours.totalHours)}</td>
                  <td>{formatHours(dailyAverage)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setActiveTab('details');
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderTimeRecords = () => {
    return (
      <div className="records-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {timeRecords.map(record => (
              <tr key={record.id}>
                <td>{record.employeeName}</td>
                <td>
                  <span className={`badge ${record.action === 'check-in' ? 'badge-primary' : 'badge-secondary'}`}>
                    {record.action === 'check-in' ? 'Check In' : 'Check Out'}
                  </span>
                </td>
                <td>{formatDate(record.timestamp)}</td>
                <td>{record.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;
    
    const employeeHours = hoursWorked[selectedEmployee.id] || { totalHours: 0, dailyHours: [] };
    
    return (
      <div className="employee-details">
        <div className="details-header">
          <button 
            className="btn btn-sm btn-neutral"
            onClick={() => {
              setSelectedEmployee(null);
              setActiveTab('hours');
            }}
          >
            Back to Hours
          </button>
          <h2>{selectedEmployee.name}</h2>
          <span className="department-badge">{selectedEmployee.department}</span>
        </div>
        
        <div className="details-summary">
          <div className="summary-card">
            <h3>Total Hours</h3>
            <div className="summary-value">{formatHours(employeeHours.totalHours)}</div>
          </div>
          <div className="summary-card">
            <h3>Days Worked</h3>
            <div className="summary-value">{employeeHours.dailyHours.length}</div>
          </div>
          <div className="summary-card">
            <h3>Daily Average</h3>
            <div className="summary-value">
              {formatHours(
                employeeHours.dailyHours.length > 0 
                  ? employeeHours.totalHours / employeeHours.dailyHours.length 
                  : 0
              )}
            </div>
          </div>
        </div>
        
        <h3 className="section-title">Daily Breakdown</h3>
        <div className="daily-breakdown-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {employeeHours.dailyHours.map(day => (
                <tr key={day.date}>
                  <td>{new Date(day.date).toLocaleDateString()}</td>
                  <td>{formatHours(day.hours)}</td>
                </tr>
              ))}
              {employeeHours.dailyHours.length === 0 && (
                <tr>
                  <td colSpan="2" className="no-data">No time records found for this period</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <h3 className="section-title">Time Records</h3>
        <div className="employee-records-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {timeRecords
                .filter(record => record.employeeId === selectedEmployee.id)
                .map(record => (
                  <tr key={record.id}>
                    <td>
                      <span className={`badge ${record.action === 'check-in' ? 'badge-primary' : 'badge-secondary'}`}>
                        {record.action === 'check-in' ? 'Check In' : 'Check Out'}
                      </span>
                    </td>
                    <td>{formatDate(record.timestamp)}</td>
                  </tr>
                ))}
              {!timeRecords.some(record => record.employeeId === selectedEmployee.id) && (
                <tr>
                  <td colSpan="2" className="no-data">No time records found for this employee</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderEmployeesList = () => {
    return (
      <div className="employees-list-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>PIN</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td className="pin-code">{employee.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <Layout 
      title="Admin Dashboard" 
      fullWidth
      className="admin-dashboard-page"
    >
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="date-filters">
            <div className="filter-group">
              <label htmlFor="startDate">Start Date</label>
              <input 
                type="date" 
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="endDate">End Date</label>
              <input 
                type="date" 
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
          </div>
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'hours' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('hours');
                setSelectedEmployee(null);
              }}
            >
              Hours Worked
            </button>
            <button 
              className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('records');
                setSelectedEmployee(null);
              }}
            >
              Time Records
            </button>
            <button 
              className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('employees');
                setSelectedEmployee(null);
              }}
            >
              Employees
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'hours' && renderEmployeeHours()}
              {activeTab === 'records' && renderTimeRecords()}
              {activeTab === 'employees' && renderEmployeesList()}
              {activeTab === 'details' && renderEmployeeDetails()}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;