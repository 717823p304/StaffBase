import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useContext(AppContext);

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="toast-icon success" style={{ color: 'var(--success)' }} />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon warning" style={{ color: 'var(--warning)' }} />;
      case 'danger':
        return <AlertCircle size={18} className="toast-icon danger" style={{ color: 'var(--danger)' }} />;
      default:
        return <Info size={18} className="toast-icon info" style={{ color: 'var(--info)' }} />;
    }
  };

  return (
    <div className="toast-container" style={containerStyle}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.type}`} style={{ ...cardStyle, borderLeft: `4px solid var(--${toast.type})` }}>
          {getIcon(toast.type)}
          <span style={messageStyle}>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} style={closeButtonStyle}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Styles embedded in Vanilla CSS style variables or inline to guarantee robust visual styling
const containerStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  pointerEvents: 'none'
};

const cardStyle = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(15, 21, 36, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '12px 16px',
  minWidth: '280px',
  maxWidth: '400px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  animation: 'slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  color: 'var(--text-primary)'
};

const messageStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  flex: 1
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'color 0.2s',
  ':hover': {
    color: 'var(--text-primary)'
  }
};

export default Toast;
