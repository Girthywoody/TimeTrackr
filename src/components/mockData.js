// Mock data for initial development
export const initialEmployees = [
    { id: 1, name: 'John Doe', position: 'Cashier', wage: 15.50, active: true },
    { id: 2, name: 'Jane Smith', position: 'Manager', wage: 22.75, active: true },
    { id: 3, name: 'Bob Johnson', position: 'Stock Clerk', wage: 14.25, active: true },
    { id: 4, name: 'Sarah Williams', position: 'Assistant Manager', wage: 19.50, active: true },
    { id: 5, name: 'Mike Wilson', position: 'Cashier', wage: 15.00, active: false }
  ];
  
  export const initialHours = [
    { id: 1, employeeId: 1, date: '2025-04-01', checkIn: '09:00', checkOut: '17:00', hours: 8 },
    { id: 2, employeeId: 1, date: '2025-04-02', checkIn: '09:00', checkOut: '17:00', hours: 8 },
    { id: 3, employeeId: 2, date: '2025-04-01', checkIn: '08:00', checkOut: '16:00', hours: 8 },
    { id: 4, employeeId: 3, date: '2025-04-02', checkIn: '12:00', checkOut: '20:00', hours: 8 },
    { id: 5, employeeId: 4, date: '2025-04-01', checkIn: '10:00', checkOut: '18:00', hours: 8 },
    { id: 6, employeeId: 1, date: '2025-04-03', checkIn: '09:00', checkOut: '14:00', hours: 5 },
    { id: 7, employeeId: 2, date: '2025-04-03', checkIn: '08:00', checkOut: '17:00', hours: 9 },
    { id: 8, employeeId: 3, date: '2025-04-03', checkIn: '12:00', checkOut: '20:00', hours: 8 },
    { id: 9, employeeId: 4, date: '2025-04-02', checkIn: '10:00', checkOut: '19:00', hours: 9 }
  ];
  
  // Employee PINs for check-in/out (in a real app, these would be hashed)
  export const employeePins = {
    '1': '1234',
    '2': '5678',
    '3': '9012',
    '4': '3456',
    '5': '7890'
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    EMPLOYEES: 'app_employees',
    HOURS: 'app_hours',
    CURRENT_USER: 'app_current_user'
  };
  
  // Helper functions for data persistence
  export const saveEmployees = (employees) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  };
  
  export const getEmployees = () => {
    const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return storedEmployees ? JSON.parse(storedEmployees) : initialEmployees;
  };
  
  export const saveHours = (hours) => {
    localStorage.setItem(STORAGE_KEYS.HOURS, JSON.stringify(hours));
  };
  
  export const getHours = () => {
    const storedHours = localStorage.getItem(STORAGE_KEYS.HOURS);
    return storedHours ? JSON.parse(storedHours) : initialHours;
  };
  
  export const checkEmployeePin = (employeeId, pin) => {
    return employeePins[employeeId] === pin;
  };
  
  export const recordCheckInOut = (employeeId, isCheckIn) => {
    const hours = getHours();
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Check if there's an existing record for today
    const existingRecord = hours.find(hour => 
      hour.employeeId === parseInt(employeeId) && hour.date === currentDate
    );
    
    if (isCheckIn) {
      // For check-in, either create new record or update existing
      if (existingRecord) {
        if (!existingRecord.checkIn) {
          existingRecord.checkIn = currentTime;
          saveHours(hours);
        }
        return existingRecord;
      } else {
        const newRecord = {
          id: Math.max(...hours.map(h => h.id), 0) + 1,
          employeeId: parseInt(employeeId),
          date: currentDate,
          checkIn: currentTime,
          checkOut: null,
          hours: 0
        };
        saveHours([...hours, newRecord]);
        return newRecord;
      }
    } else {
      // For check-out, must have an existing record
      if (existingRecord && existingRecord.checkIn) {
        // Calculate hours worked
        const checkInTime = new Date(`${currentDate}T${existingRecord.checkIn}`);
        const checkOutTime = new Date(`${currentDate}T${currentTime}`);
        const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        
        existingRecord.checkOut = currentTime;
        existingRecord.hours = parseFloat(hoursWorked.toFixed(2));
        saveHours(hours);
        return existingRecord;
      }
      return null;
    }
  };