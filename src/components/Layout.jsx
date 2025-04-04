// src/components/Layout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const Layout = ({ 
  children, 
  title, 
  subtitle,
  showBackButton = false,
  backButtonPath = '/',
  backButtonText = 'Back',
  fullWidth = false,
  centerContent = false,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backButtonPath);
  };

  return (
    <div className={`layout ${centerContent ? 'layout-center' : ''} ${className}`}>
      <div className={`layout-container ${fullWidth ? 'layout-full-width' : ''}`}>
        {(title || showBackButton) && (
          <header className="layout-header">
            {showBackButton && (
              <button 
                className="btn btn-icon-only" 
                onClick={handleBack}
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
            )}
            {title && (
              <div className="header-titles">
                <h1 className="layout-title">{title}</h1>
                {subtitle && <h2 className="layout-subtitle">{subtitle}</h2>}
              </div>
            )}
          </header>
        )}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showBackButton: PropTypes.bool,
  backButtonPath: PropTypes.string,
  backButtonText: PropTypes.string,
  fullWidth: PropTypes.bool,
  centerContent: PropTypes.bool,
  className: PropTypes.string
};

export default Layout;