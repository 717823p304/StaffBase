import React, { useState, useEffect } from 'react';
import { Lock, Save } from 'lucide-react';
import { api } from '../../services/api';
import AuthPageLayout from '../../components/AuthPageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { authTitleStyle, authSubtextStyle, authInputContainerStyle, authInputIconStyle } from '../../styles/authStyles';

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
    <AuthPageLayout>
      {!submitted ? (
        <>
          <h1 style={authTitleStyle}>Reset Password</h1>
          <p style={authSubtextStyle}>Define your new high-entropy corporate security password.</p>
          
          <ErrorMessage message={errorMsg} />

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
              <div style={authInputContainerStyle}>
                <Lock size={16} style={authInputIconStyle} />
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
              <div style={authInputContainerStyle}>
                <Lock size={16} style={authInputIconStyle} />
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
          <p style={authSubtextStyle}>Your password coordinates have been updated. You can now log in securely using your new password.</p>
          <a href="#/login" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Proceed to Sign In
          </a>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default ResetPassword;
