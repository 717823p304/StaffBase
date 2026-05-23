import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const { activeRole } = useContext(AppContext);

  return (
    <div style={pageStyle} className="animate-fade-in">
      <div style={cardStyle} className="glass-card">
        <div style={iconContainerStyle}>
          <ShieldAlert size={48} />
        </div>
        <h1 style={headingStyle}>Unauthorized Access</h1>
        <p style={subtextStyle}>
          You do not have the required permissions to access this console path. Your account is logged in with **{activeRole}** privileges.
        </p>
        <div style={metaStyle}>
          <span>Requested Resource: RESTRICTED ADMIN CONSOLE</span>
        </div>
        <button
          onClick={() => { window.location.hash = '/'; }}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-deep)',
  padding: '1.5rem',
  color: 'var(--text-primary)'
};

const cardStyle = {
  maxWidth: '420px',
  width: '100%',
  padding: '2.5rem',
  textAlign: 'center',
  background: 'rgba(239, 68, 68, 0.03)',
  border: '1px solid rgba(239, 68, 68, 0.2)'
};

const iconContainerStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--danger)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem auto'
};

const headingStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '0.5rem',
  color: 'var(--text-primary)'
};

const subtextStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5',
  marginBottom: '1rem'
};

const metaStyle = {
  fontSize: '0.75rem',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  color: 'var(--text-muted)',
  padding: '6px 12px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '6px',
  display: 'inline-block'
};

export default Unauthorized;
