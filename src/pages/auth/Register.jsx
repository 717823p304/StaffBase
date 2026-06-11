import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserPlus, Info } from 'lucide-react';
import AuthPageLayout from '../../components/AuthPageLayout';
import { authTitleStyle, authSubtextStyle, authIconBadgeStyle } from '../../styles/authStyles';

const Register = () => {
  const { submitRegistrationRequest } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const success = await submitRegistrationRequest({ name, email, department });
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <AuthPageLayout>
      {!submitted ? (
        <>
          <h1 style={authTitleStyle}>Profile Request</h1>
          <p style={authSubtextStyle}>Request your corporate credentials from HR Operations to access the platform.</p>
          
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
          <div style={authIconBadgeStyle}>
            <Info size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Request Submitted!</h2>
          <p style={authSubtextStyle}>
            Your registration request has been forwarded to the HR team. Once approved, you will receive an invitation email containing password coordinates.
          </p>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default Register;
