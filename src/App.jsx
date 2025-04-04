// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import EmployeeSelection from './components/EmployeeSelection';
import CodeEntry from './components/CodeEntry';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import DiagnosticPage from './components/DiagnosticPage';

// Import our styles
import './styles/Theme.css';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/select-employee" element={<EmployeeSelection />} />
        <Route path="/code-entry/:employeeId/:action" element={<CodeEntry />} />
        <Route path="/success/:action" element={<SuccessScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/diagnostics" element={<DiagnosticPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;