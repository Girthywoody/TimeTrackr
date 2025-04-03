// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import EmployeeSelection from './components/EmployeeSelection';
import CodeEntry from './components/CodeEntry';
import SuccessScreen from './components/SuccessScreen';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/select-employee" element={<EmployeeSelection />} />
        <Route path="/code-entry/:employeeId/:action" element={<CodeEntry />} />
        <Route path="/success/:action" element={<SuccessScreen />} />
      </Routes>
    </div>
  );
};

export default App;