// src/services/api.js
// This service provides data functions that will later be replaced with Firebase

// Mock employee data - this would come from Firebase
const employees = [
    { id: '1', name: 'John Smith', department: 'Engineering', code: '1234', imageUrl: null },
    { id: '2', name: 'Sarah Johnson', department: 'Marketing', code: '2345', imageUrl: null },
    { id: '3', name: 'Michael Brown', department: 'Finance', code: '3456', imageUrl: null },
    { id: '4', name: 'Emily Davis', department: 'Human Resources', code: '4567', imageUrl: null },
    { id: '5', name: 'David Wilson', department: 'Operations', code: '5678', imageUrl: null },
    { id: '6', name: 'Jessica Martinez', department: 'Customer Support', code: '6789', imageUrl: null },
    { id: '7', name: 'Robert Taylor', department: 'Product', code: '7890', imageUrl: null },
    { id: '8', name: 'Jennifer Anderson', department: 'Sales', code: '8901', imageUrl: null },
    { id: '9', name: 'Christopher Thomas', department: 'IT', code: '9012', imageUrl: null },
    { id: '10', name: 'Amanda White', department: 'Legal', code: '0123', imageUrl: null },
    { id: '11', name: 'Matthew Garcia', department: 'Engineering', code: '1122', imageUrl: null },
    { id: '12', name: 'Lisa Rodriguez', department: 'Marketing', code: '2233', imageUrl: null },
  ];
  
  // Mock time records - this would be stored in Firebase
  let timeRecords = [];
  
  /**
   * Get all employees (with a simulated delay)
   * @returns {Promise<Array>} List of employees
   */
  export const getEmployees = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...employees]);
      }, 800); // Simulate network delay
    });
  };
  
  /**
   * Get an employee by ID (with a simulated delay)
   * @param {string} id Employee ID
   * @returns {Promise<Object|null>} Employee object or null if not found
   */
  export const getEmployeeById = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(emp => emp.id === id) || null;
        resolve(employee);
      }, 600); // Simulate network delay
    });
  };
  
  /**
   * Verify employee PIN code
   * @param {string} employeeId Employee ID
   * @param {string} code PIN code entered
   * @returns {Promise<boolean>} Whether the code is valid
   */
  export const verifyEmployeeCode = (employeeId, code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(emp => emp.id === employeeId);
        resolve(employee && employee.code === code);
      }, 1000); // Simulate verification delay
    });
  };
  
  /**
   * Record a check-in or check-out action
   * @param {string} employeeId Employee ID
   * @param {string} action 'check-in' or 'check-out'
   * @returns {Promise<Object>} Recorded time entry
   */
  export const recordTimeAction = (employeeId, action) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employees.find(emp => emp.id === employeeId);
        
        if (!employee) {
          throw new Error(`Employee with ID ${employeeId} not found`);
        }
        
        const timeRecord = {
          id: `tr-${Date.now()}`,
          employeeId,
          employeeName: employee.name,
          department: employee.department,
          action,
          timestamp: new Date().toISOString()
        };
        
        // Add to mock database
        timeRecords.push(timeRecord);
        
        resolve(timeRecord);
      }, 800); // Simulate network delay
    });
  };
  
  /**
   * Get time records for an employee
   * @param {string} employeeId Employee ID
   * @returns {Promise<Array>} List of time records
   */
  export const getEmployeeTimeRecords = (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = timeRecords.filter(record => record.employeeId === employeeId);
        resolve(records);
      }, 800); // Simulate network delay
    });
  };
  
  /**
   * Get all time records
   * @returns {Promise<Array>} List of all time records
   */
  export const getAllTimeRecords = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...timeRecords]);
      }, 1000); // Simulate network delay
    });
  };
  
  /**
   * Search employees by name or department
   * @param {string} query Search query
   * @returns {Promise<Array>} Filtered list of employees
   */
  export const searchEmployees = (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || query.trim() === '') {
          resolve([...employees]);
          return;
        }
        
        const lowercaseQuery = query.toLowerCase().trim();
        const filtered = employees.filter(
          employee => 
            employee.name.toLowerCase().includes(lowercaseQuery) || 
            employee.department.toLowerCase().includes(lowercaseQuery)
        );
        
        resolve(filtered);
      }, 500); // Simulate network delay
    });
  };
  
  export default {
    getEmployees,
    getEmployeeById,
    verifyEmployeeCode,
    recordTimeAction,
    getEmployeeTimeRecords,
    getAllTimeRecords,
    searchEmployees
  };