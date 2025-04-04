// src/scripts/initFirebase.js
// This script can be used to initialize your Firebase database with sample data
// Run this once to set up your database with initial employees

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHRyWdsZg-KKsW-gxY0X49LSGMZw-twAE",
  authDomain: "timet-e8c09.firebaseapp.com", 
  projectId: "timet-e8c09",
  storageBucket: "timet-e8c09.appspot.com",
  messagingSenderId: "522645731403",
  appId: "1:522645731403:web:5882c2aca0dcd7c19e75ce"
};

// Sample employee data
const sampleEmployees = [
  { name: 'John Smith', department: 'Engineering', code: '1234', imageUrl: null },
  { name: 'Sarah Johnson', department: 'Marketing', code: '2345', imageUrl: null },
  { name: 'Michael Brown', department: 'Finance', code: '3456', imageUrl: null },
  { name: 'Emily Davis', department: 'Human Resources', code: '4567', imageUrl: null },
  { name: 'David Wilson', department: 'Operations', code: '5678', imageUrl: null },
  { name: 'Jessica Martinez', department: 'Customer Support', code: '6789', imageUrl: null },
  { name: 'Robert Taylor', department: 'Product', code: '7890', imageUrl: null },
  { name: 'Jennifer Anderson', department: 'Sales', code: '8901', imageUrl: null },
  { name: 'Christopher Thomas', department: 'IT', code: '9012', imageUrl: null },
  { name: 'Amanda White', department: 'Legal', code: '0123', imageUrl: null },
  { name: 'Matthew Garcia', department: 'Engineering', code: '1122', imageUrl: null },
  { name: 'Lisa Rodriguez', department: 'Marketing', code: '2233', imageUrl: null }
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Initialize the database with sample employees
 */
async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  try {
    // Check if employees already exist
    const employeesRef = collection(db, 'employees');
    const snapshot = await getDocs(employeesRef);
    
    if (!snapshot.empty) {
      console.log('Database already has employees. Skipping initialization.');
      console.log(`Found ${snapshot.size} existing employees.`);
      return;
    }
    
    // Add sample employees
    for (const employee of sampleEmployees) {
      await addDoc(collection(db, 'employees'), employee);
      console.log(`Added employee: ${employee.name}`);
    }
    
    console.log('Database initialized successfully with sample employees!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase();

/**
 * This function can be used to generate sample time records for testing
 * Uncomment and run to create sample time records
 */
/*
async function generateSampleTimeRecords() {
  console.log('Generating sample time records...');
  
  try {
    // Get all employees
    const employeesRef = collection(db, 'employees');
    const snapshot = await getDocs(employeesRef);
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Current date
    const now = new Date();
    
    // Create time records for the past 7 days
    for (let i = 0; i < 7; i++) {
      const recordDate = new Date(now);
      recordDate.setDate(now.getDate() - i);
      
      // Skip weekends
      const dayOfWeek = recordDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      for (const employee of employees) {
        // Check in time (8:00 - 9:30 AM with some randomness)
        const checkInHour = 8 + Math.floor(Math.random() * 1.5);
        const checkInMinute = Math.floor(Math.random() * 60);
        const checkInTime = new Date(recordDate);
        checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
        
        // Check out time (4:30 - 6:00 PM with some randomness)
        const checkOutHour = 16 + Math.floor(Math.random() * 2);
        const checkOutMinute = 30 + Math.floor(Math.random() * 30);
        const checkOutTime = new Date(recordDate);
        checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);
        
        // Add check-in record
        await addDoc(collection(db, 'timeRecords'), {
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          action: 'check-in',
          timestamp: checkInTime
        });
        
        // Add check-out record
        await addDoc(collection(db, 'timeRecords'), {
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          action: 'check-out',
          timestamp: checkOutTime
        });
      }
      
      console.log(`Generated records for ${recordDate.toDateString()}`);
    }
    
    console.log('Sample time records generated successfully!');
  } catch (error) {
    console.error('Error generating sample time records:', error);
  }
}

// Uncomment to generate sample time records
// generateSampleTimeRecords();
*/

export default {
  initializeDatabase
};