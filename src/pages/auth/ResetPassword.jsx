import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Save } from 'lucide-react';
import { api } from '../../services/api';

const ResetPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Parse token from hash parameter: #/reset-password?token=XYZ
    const hash = window.location.hash;
    const queryIdx = hash.indexOf('?');
    if (queryIdx !== -1) {
      const params = new URLSearchParams(hash.substring(queryIdx));
      const t = params.get('token');
      if (t) {
        setToken(t);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!token) {
      setErrorMsg('No secure reset token found in link URL. Please request a new link.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Failed to overhaul credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with authentication servers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="glass-card animate-fade-in">
        {!submitted ? (
          <>
            <h1 style={titleStyle}>Reset Password</h1>
            <p style={subtextStyle}>Define your new high-entropy corporate security password.</p>
            
            {errorMsg && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'var(--danger-glow)',
                color: 'var(--danger)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              {/* Reset Token (Optional helper text/field if token missing) */}
              {!token && (
                <div className="form-group">
                  <label className="form-label">Reset Token</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter security token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={inputContainerStyle}>
                  <Lock size={16} style={inputIconStyle} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={inputContainerStyle}>
                  <Lock size={16} style={inputIconStyle} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                disabled={loading}
              >
                <Save size={16} />
                <span>{loading ? 'Overhauling Credentials...' : 'Save New Credentials'}</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Credentials Overhauled!</h2>
            <p style={subtextStyle}>Your password coordinates have been updated. You can now log in securely using your new password.</p>
            <a href="#/login" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
              Proceed to Sign In
            </a>
          </div>
        )}

        <a href="#/login" style={backLinkStyle}>
          <ArrowLeft size={14} />
          <span>Return to Sign In</span>
        </a>
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
  padding: '2rem'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '0.5rem'
};

const subtextStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.4'
};

const inputContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIconStyle = {
  position: 'absolute',
  left: '12px',
  color: 'var(--text-muted)'
};

const backLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginTop: '1.5rem',
  fontWeight: '700'
};

export default ResetPassword;
