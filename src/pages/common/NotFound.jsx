import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={cardStyle} className="glass-card animate-float">
        <div style={iconContainerStyle}>
          <Compass size={44} />
        </div>
        <h1 style={headingStyle}>404</h1>
        <h2 style={subheadingStyle}>Path Not Found</h2>
        <p style={subtextStyle}>
          The directory resource or view segment you requested does not exist or has been relocated in the active corporate directory.
        </p>
        <button
          onClick={() => { window.location.hash = '/'; }}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  padding: '2rem',
  color: 'var(--text-primary)'
};

const cardStyle = {
  maxWidth: '400px',
  width: '100%',
  padding: '2.5rem',
  textAlign: 'center',
  border: '1px solid var(--border-color)'
};

const iconContainerStyle = {
  width: '76px',
  height: '76px',
  borderRadius: '50%',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem auto',
  boxShadow: 'var(--shadow-glow)'
};

const headingStyle = {
  fontSize: '3rem',
  fontWeight: '900',
  lineHeight: '1',
  background: 'var(--accent-gradient)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.25rem'
};

const subheadingStyle = {
  fontSize: '1.25rem',
  fontWeight: '800',
  marginBottom: '0.75rem'
};

const subtextStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

export default NotFound;
