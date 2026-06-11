import React, { useState } from 'react';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { api } from '../../services/api';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Failed to dispatch reset token.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error connecting to auth services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="glass-card animate-fade-in">
        {!submitted ? (
          <>
            <h1 style={titleStyle}>Forgot Password?</h1>
            <p style={subtextStyle}>Enter your corporate email. We'll send you a secure link to reset your credentials.</p>
            
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
              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <div style={inputContainerStyle}>
                  <Mail size={16} style={inputIconStyle} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@staffbase.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <Send size={16} />
                <span>{loading ? 'Dispatched Link...' : 'Send Reset Coordinates'}</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email Dispatched!</h2>
            <p style={subtextStyle}>
              If that email matches an active profile in our directory, a secure credentials reset token has been dispatched. Check the backend logs for the simulated email contents!
            </p>
            <a href="#/reset-password" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
              Proceed to Password Reset
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

export default ForgotPassword;
