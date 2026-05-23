import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { activeRole, addToast } = useContext(AppContext);

  const isAllowed = allowedRoles.includes(activeRole);

  useEffect(() => {
    if (!isAllowed) {
      addToast('Access denied: Insufficient permissions for this resource.', 'danger');
      window.location.hash = '/unauthorized';
    }
  }, [isAllowed]);

  if (!isAllowed) {
    return (
      <div style={loadingStyle}>
        <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Access Denied</p>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Checking credentials...</p>
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

export default RoleRoute;
