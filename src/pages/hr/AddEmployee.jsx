import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowLeft, ArrowRight, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';

const AddEmployee = () => {
  const { addEmployee, departments, designations } = useContext(AppContext);
  const [step, setStep] = useState(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);
  const [role, setRole] = useState('Employee');

  const [salary, setSalary] = useState(60000);
  const [bankName, setBankName] = useState('Apex Capital Bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleNext = () => {
    if (step === 1 && (!name || !email)) {
      alert('Please fill out Name and Corporate Email fields.');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newEmp = {
      name,
      email,
      bio,
      department,
      designation,
      dateOfJoining,
      role,
      bankingInfo: {
        bankName,
        accountName: accountName || name,
        accountNumber: `•••• •••• •••• ${accountNumber.slice(-4) || '1234'}`,
        ifscCode,
        salary: parseInt(salary) || 50000
      }
    };

    addEmployee(newEmp);
    window.location.hash = '/employee/directory';
  };

  const stepLabels = [
    { num: 1, text: 'Personal Info' },
    { num: 2, text: 'Employment' },
    { num: 3, text: 'Financials' },
    { num: 4, text: 'Review' }
  ];

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Add Employee Wizard</h1>
        <p style={subtitleStyle}>Register newly hired personnel into the active corporate payroll directory.</p>
      </div>

      {/* Step Indicators */}
      <div className="glass-card" style={stepBarCard}>
        {stepLabels.map((lbl) => (
          <div key={lbl.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={step === lbl.num ? activeStepBullet : step > lbl.num ? completedStepBullet : stepBullet}>
              {lbl.num}
            </span>
            <span style={step === lbl.num ? activeStepLabel : stepLabel}>{lbl.text}</span>
            {lbl.num !== 4 && <div style={stepSeparator}></div>}
          </div>
        ))}
      </div>

      {/* Wizard Form Container */}
      <div className="glass-card" style={formCardStyle}>
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={sectionTitleStyle}>1. Personal Profiles Coordinates</h2>
              <p style={sectionSubStyle}>Submit names, corporate contact coordinates, and initial summaries.</p>
              
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="E.g., Charlotte Bronte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="E.g., charlotte@staffbase.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Profile Bio</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Brief summary detailing department experiences..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Employment Details */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={sectionTitleStyle}>2. Position & Segment Alignments</h2>
              <p style={sectionSubStyle}>Define department structures, designations, and permissions.</p>

              <div style={formGrid}>
                <div className="form-group">
                  <label className="form-label">Department Segment</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Position Designation</label>
                  <select
                    className="form-select"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    {designations.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Joining Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Console Access Clearance</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Employee">Employee Access</option>
                    <option value="HR">HR Console</option>
                    <option value="Admin">System Administrator</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financial Details */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={sectionTitleStyle}>3. Banking coordinates & Compensation</h2>
              <p style={sectionSubStyle}>Define starting compensations and deposit routes.</p>

              <div style={formGrid}>
                <div className="form-group">
                  <label className="form-label">Annual Base Salary ($ USD)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salary}
                    onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deposit Bank</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bank Account Payee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Charlotte Bronte"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full digit coordinate"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Routing / IFSC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="IFSC or Bank Branch Code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 style={sectionTitleStyle}>4. Audit and Confirmation</h2>
              <p style={sectionSubStyle}>Verify details before appending the record.</p>

              <div style={reviewCard} className="glass-card">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={checkIconWrapper}>
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proposed Email: {email}</p>
                  </div>
                </div>

                <hr style={dividerStyle} />

                <div style={reviewGrid}>
                  <div>
                    <span style={reviewLabel}>Assignment</span>
                    <strong style={reviewVal}>{designation} ({department})</strong>
                  </div>
                  <div>
                    <span style={reviewLabel}>Starting Salary</span>
                    <strong style={{ ...reviewVal, color: 'var(--success)' }}>${salary.toLocaleString()} USD</strong>
                  </div>
                  <div>
                    <span style={reviewLabel}>System Privileges</span>
                    <strong style={reviewVal}>{role} Level</strong>
                  </div>
                  <div>
                    <span style={reviewLabel}>Joining Date</span>
                    <strong style={reviewVal}>{dateOfJoining}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav Controls */}
          <div style={navControlsRow}>
            {step > 1 && (
              <button type="button" onClick={handleBack} className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto', background: 'var(--accent-gradient)' }}>
                <UserPlus size={16} />
                <span>Onboard Employee</span>
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
};

// Styling definitions
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)'
};

const stepBarCard = {
  padding: '1.25rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px'
};

const stepBullet = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  border: '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'var(--text-muted)'
};

const activeStepBullet = {
  ...stepBullet,
  border: '2px solid var(--primary)',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  boxShadow: 'var(--shadow-glow)'
};

const completedStepBullet = {
  ...stepBullet,
  border: '2px solid var(--success)',
  background: 'var(--success-glow)',
  color: 'var(--success)'
};

const stepLabel = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  fontWeight: '600'
};

const activeStepLabel = {
  ...stepLabel,
  color: 'var(--text-primary)',
  fontWeight: '800'
};

const stepSeparator = {
  width: '50px',
  height: '2px',
  backgroundColor: 'var(--border-color)'
};

// End of style variables

const formCardStyle = {
  padding: '2.5rem 2rem'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '800'
};

const sectionSubStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  marginBottom: '1.5rem'
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const navControlsRow = {
  display: 'flex',
  marginTop: '2rem',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1.5rem'
};

const reviewCard = {
  padding: '1.5rem',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)'
};

const checkIconWrapper = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dividerStyle = {
  margin: '1.25rem 0',
  border: 'none',
  borderTop: '1px solid var(--border-color)'
};

const reviewGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem'
};

const reviewLabel = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
  display: 'block'
};

const reviewVal = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginTop: '2px',
  display: 'block'
};

export default AddEmployee;
