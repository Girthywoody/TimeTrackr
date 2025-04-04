// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBHRyWdsZg-KKsW-gxY0X49LSGMZw-twAE",
  authDomain: "timet-e8c09.firebaseapp.com",
  projectId: "timet-e8c09",
  storageBucket: "timet-e8c09.appspot.com",
  messagingSenderId: "522645731403",
  appId: "1:522645731403:web:5882c2aca0dcd7c19e75ce",
  measurementId: "G-G3LD9JYH8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Employees collection functions
export const getEmployees = async () => {
  const employeesRef = collection(db, 'employees');
  const snapshot = await getDocs(employeesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEmployeeById = async (id) => {
  const employeeRef = doc(db, 'employees', id);
  const docSnap = await getDoc(employeeRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const searchEmployees = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return await getEmployees();
  }
  
  const employeesRef = collection(db, 'employees');
  const snapshot = await getDocs(employeesRef);
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(employee => 
      employee.name.toLowerCase().includes(lowercaseSearch) || 
      employee.department.toLowerCase().includes(lowercaseSearch)
    );
};

export const verifyEmployeeCode = async (employeeId, code) => {
  const employee = await getEmployeeById(employeeId);
  return employee && employee.code === code;
};

// TimeRecords collection functions
export const recordTimeAction = async (employeeId, action) => {
  const employee = await getEmployeeById(employeeId);
  
  if (!employee) {
    throw new Error(`Employee with ID ${employeeId} not found`);
  }
  
  const timeRecord = {
    employeeId,
    employeeName: employee.name,
    department: employee.department,
    action,
    timestamp: serverTimestamp()
  };
  
  const timeRecordsRef = collection(db, 'timeRecords');
  const docRef = await addDoc(timeRecordsRef, timeRecord);
  
  return { id: docRef.id, ...timeRecord };
};

export const getEmployeeTimeRecords = async (employeeId, startDate, endDate) => {
  const timeRecordsRef = collection(db, 'timeRecords');
  let q = query(timeRecordsRef, where('employeeId', '==', employeeId), orderBy('timestamp', 'asc'));
  
  // Add date range filter if provided
  if (startDate && endDate) {
    q = query(q, where('timestamp', '>=', startDate), where('timestamp', '<=', endDate));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllTimeRecords = async (startDate, endDate) => {
  const timeRecordsRef = collection(db, 'timeRecords');
  let q = query(timeRecordsRef, orderBy('timestamp', 'desc'));
  
  // Add date range filter if provided
  if (startDate && endDate) {
    q = query(q, where('timestamp', '>=', startDate), where('timestamp', '<=', endDate));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Calculate hours worked
export const calculateHoursWorked = async (employeeId, startDate, endDate) => {
  const timeRecords = await getEmployeeTimeRecords(employeeId, startDate, endDate);
  
  // Sort records by timestamp
  const sortedRecords = [...timeRecords].sort((a, b) => {
    const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
    const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
    return timeA - timeB;
  });
  
  let totalMilliseconds = 0;
  let checkInTime = null;
  let dailyHours = {};
  
  // Process each record
  for (const record of sortedRecords) {
    const timestamp = record.timestamp?.toDate ? record.timestamp.toDate() : new Date(record.timestamp);
    const dateKey = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (record.action === 'check-in') {
      checkInTime = timestamp;
    } else if (record.action === 'check-out' && checkInTime) {
      const duration = timestamp - checkInTime;
      totalMilliseconds += duration;
      
      // Add to daily hours
      if (!dailyHours[dateKey]) {
        dailyHours[dateKey] = 0;
      }
      dailyHours[dateKey] += duration;
      
      checkInTime = null;
    }
  }
  
  // Convert milliseconds to hours
  const totalHours = totalMilliseconds / (1000 * 60 * 60);
  
  // Convert daily milliseconds to hours
  const dailyHoursFormatted = Object.entries(dailyHours).map(([date, ms]) => ({
    date,
    hours: ms / (1000 * 60 * 60)
  }));
  
  return {
    totalHours,
    dailyHours: dailyHoursFormatted
  };
};

export default {
  app,
  auth,
  db,
  getEmployees,
  getEmployeeById,
  searchEmployees,
  verifyEmployeeCode,
  recordTimeAction,
  getEmployeeTimeRecords,
  getAllTimeRecords,
  calculateHoursWorked
};