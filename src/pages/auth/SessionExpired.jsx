import React from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';

const SessionExpired = () => {
  return (
    <div style={pageStyle} className="animate-fade-in">
      <div style={cardStyle} className="glass-card">
        <div style={iconContainerStyle}>
          <ShieldAlert size={40} />
        </div>
        <h1 style={headingStyle}>Session Expired</h1>
        <p style={subtextStyle}>
          Your corporate authentication token has expired due to inactivity. Please sign in again to resume your session securely.
        </p>
        <button
          onClick={() => { window.location.hash = '/login'; }}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
        >
          <LogIn size={16} />
          <span>Sign In Again</span>
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
  maxWidth: '400px',
  width: '100%',
  padding: '2.5rem',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.08)'
};

const iconContainerStyle = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  background: 'var(--warning-glow)',
  color: 'var(--warning)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem auto'
};

const headingStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '0.5rem'
};

const subtextStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

export default SessionExpired;
