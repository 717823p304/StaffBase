import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, addToast } = useContext(AppContext);

  useEffect(() => {
    if (!currentUser) {
      addToast('Please login to access this section.', 'warning');
      window.location.hash = '/login';
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={loadingStyle}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Redirecting to Login...</p>
      </div>
    );
  }

  return children;
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: 'var(--bg-deep)'
};

export default ProtectedRoute;
