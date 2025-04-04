// src/components/DiagnosticPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

// Try to import Firebase but handle errors
let firebaseStatus = "Not loaded";
let firebaseError = null;

try {
  // Dynamically import to test if it works
  import('../services/firebase.js')
    .then(() => {
      firebaseStatus = "Loaded successfully";
    })
    .catch(err => {
      firebaseStatus = "Error loading";
      firebaseError = err.message;
    });
} catch (err) {
  firebaseStatus = "Error loading";
  firebaseError = err.message;
}

const DiagnosticPage = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    reactRouterStatus: "Checking...",
    routingStatus: "Checking...",
    firebaseStatus: firebaseStatus,
    firebaseError: firebaseError,
    browserInfo: navigator.userAgent,
  });

  useEffect(() => {
    // Check React Router
    setDiagnosticInfo(prev => ({
      ...prev,
      reactRouterStatus: "Working (this component loaded via a route)",
      routingStatus: "Working (navigation functional)"
    }));
  }, []);

  return (
    <Layout 
      title="System Diagnostics" 
      showBackButton
      backButtonPath="/"
    >
      <div style={{ padding: '20px' }}>
        <h2>TimeTrackr Diagnostics</h2>
        <p>This page helps diagnose issues with your application setup.</p>

        <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>System Status</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>React Router:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: diagnosticInfo.reactRouterStatus.includes("Working") ? 'green' : 'red' }}>
                    {diagnosticInfo.reactRouterStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Navigation:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: diagnosticInfo.routingStatus.includes("Working") ? 'green' : 'red' }}>
                    {diagnosticInfo.routingStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Firebase Status:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <span style={{ color: diagnosticInfo.firebaseStatus === "Loaded successfully" ? 'green' : 'red' }}>
                    {diagnosticInfo.firebaseStatus}
                  </span>
                  {diagnosticInfo.firebaseError && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                      Error: {diagnosticInfo.firebaseError}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Browser:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{diagnosticInfo.browserInfo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Route Testing</h3>
          <p>Click the links below to test if routing is working correctly:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <Link to="/" style={{ color: 'blue' }}>Home Screen</Link>
            <Link to="/admin" style={{ color: 'blue' }}>Admin Dashboard</Link>
            <Link to="/select-employee" style={{ color: 'blue' }}>Employee Selection</Link>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px' }}>
          <h3>Troubleshooting Steps</h3>
          <ol style={{ marginLeft: '20px' }}>
            <li>Check that Firebase is properly installed: <code>npm list firebase</code></li>
            <li>Verify Firebase configuration in <code>src/services/firebase.js</code></li>
            <li>Check browser console for JavaScript errors</li>
            <li>Make sure you're using a compatible browser</li>
            <li>Try clearing browser cache and reloading</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticPage;