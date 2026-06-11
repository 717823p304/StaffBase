import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { api } from '../../services/api';
import AuthPageLayout from '../../components/AuthPageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { authTitleStyle, authSubtextStyle, authInputContainerStyle, authInputIconStyle } from '../../styles/authStyles';

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
    <AuthPageLayout>
      {!submitted ? (
        <>
          <h1 style={authTitleStyle}>Forgot Password?</h1>
          <p style={authSubtextStyle}>Enter your corporate email. We'll send you a secure link to reset your credentials.</p>
          
          <ErrorMessage message={errorMsg} />

          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <div style={authInputContainerStyle}>
                <Mail size={16} style={authInputIconStyle} />
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
          <p style={authSubtextStyle}>
            If that email matches an active profile in our directory, a secure credentials reset token has been dispatched. Check the backend logs for the simulated email contents!
          </p>
          <a href="#/reset-password" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Proceed to Password Reset
          </a>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default ForgotPassword;
