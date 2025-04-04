// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import EmployeeSelection from './components/EmployeeSelection';
import CodeEntry from './components/CodeEntry';
import SuccessScreen from './components/SuccessScreen';

// Import our styles
import './styles/Theme.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/select-employee" element={<EmployeeSelection />} />
      <Route path="/code-entry/:employeeId/:action" element={<CodeEntry />} />
      <Route path="/success/:action" element={<SuccessScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;