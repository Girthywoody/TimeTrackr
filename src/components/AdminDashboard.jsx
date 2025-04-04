// src/components/AdminDashboard.jsx (Simplified)
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const AdminDashboard = () => {
  return (
    <Layout 
      title="Admin Dashboard" 
      showBackButton
      backButtonPath="/"
      className="admin-dashboard-page"
    >
      <div className="dashboard-container" style={{ padding: '20px' }}>
        <h2>Admin Dashboard</h2>
        <p>This is a simplified admin dashboard to verify routing is working correctly.</p>
        
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Troubleshooting Steps</h3>
          <ul style={{ marginLeft: '20px' }}>
            <li>Verify Firebase configuration in src/services/firebase.js</li>
            <li>Check browser console for any errors</li>
            <li>Make sure all dependencies are installed with npm install</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;