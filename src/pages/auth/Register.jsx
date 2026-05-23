import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowLeft, UserPlus, Info } from 'lucide-react';

const Register = () => {
  const { submitRegistrationRequest } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    submitRegistrationRequest({ name, email, department });
    setSubmitted(true);
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} className="glass-card animate-fade-in">
        {!submitted ? (
          <>
            <h1 style={titleStyle}>Profile Request</h1>
            <p style={subtextStyle}>Request your corporate credentials from HR Operations to access the platform.</p>
            
            <form onSubmit={handleRegisterSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Personal Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john.doe@personal.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Proposed Department</label>
                <select 
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Product & Design</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                <UserPlus size={16} />
                <span>Submit Request to HR</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={badgeStyle}>
              <Info size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Request Submitted!</h2>
            <p style={subtextStyle}>
              Your registration request has been forwarded to the HR team. Once approved, you will receive an invitation email containing password coordinates.
            </p>
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

const badgeStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem auto'
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

export default Register;
