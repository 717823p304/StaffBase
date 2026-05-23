import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Compass, CheckCircle, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

const Onboarding = () => {
  const { employees, confirmEmployeeProbation } = useContext(AppContext);

  // Find employees who joined recently or are in probation
  const onboardingStaff = employees.filter(e => e.status === 'On Probation' || e.status === 'Active').slice(0, 3);

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Onboarding & Probation Control</h1>
        <p style={subtitleStyle}>Track equipment provisioning, systems induction checklists, and probation milestones for new hires.</p>
      </div>

      {/* Renders pipeline tracking board */}
      <div style={pipelineGrid}>
        {onboardingStaff.map((emp) => {
          // Calculate arbitrary onboarding progress
          const isProbation = emp.status === 'On Probation';
          const progress = isProbation ? 65 : 100;
          
          return (
            <div key={emp.id} className="glass-card" style={cardStyle}>
              {/* Card Header */}
              <div style={cardHeaderRow}>
                <div style={{
                  ...avatarStyle,
                  backgroundColor: emp.bgColor || 'var(--primary)'
                }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{emp.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation} • ID: {emp.id}</span>
                </div>
              </div>

              {/* Progress metrics */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
                  <span>Induction Progress</span>
                  <span>{progress}%</span>
                </div>
                <div style={progressBarContainer}>
                  <div style={{
                    ...progressBarFill,
                    width: `${progress}%`,
                    background: isProbation ? 'var(--warning)' : 'var(--success)'
                  }}></div>
                </div>
              </div>

              {/* Checklist list */}
              <div style={checklistContainer}>
                <div style={checklistItem}>
                  <span style={isProbation ? itemActiveIcon : itemSuccessIcon}>✓</span>
                  <span>1. IT Assets & Workspace Provisioning</span>
                </div>
                <div style={checklistItem}>
                  <span style={isProbation ? itemActiveIcon : itemSuccessIcon}>✓</span>
                  <span>2. Corporate NDA & Security Signoff</span>
                </div>
                <div style={checklistItem}>
                  <span style={isProbation ? itemPendingIcon : itemSuccessIcon}>{isProbation ? '○' : '✓'}</span>
                  <span>3. Financial Banking & Payroll Audit</span>
                </div>
                <div style={checklistItem}>
                  <span style={isProbation ? itemPendingIcon : itemSuccessIcon}>{isProbation ? '○' : '✓'}</span>
                  <span>4. Formal Orientation & Team Syncs</span>
                </div>
              </div>

              {/* Confirmation details */}
              <div style={confirmationSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Joining: **{emp.dateOfJoining}**</span>
                  <span className={`badge badge-${isProbation ? 'warning' : 'success'}`}>{emp.status}</span>
                </div>
                {isProbation && (
                  <button
                    onClick={() => confirmEmployeeProbation(emp.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem', padding: '6px 12px', fontSize: '0.75rem', boxShadow: 'none' }}
                  >
                    Approve Confirmation
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

// Styling Variables
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

const pipelineGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--border-color)'
};

const cardHeaderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const avatarStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '1.1rem'
};

const progressBarContainer = {
  width: '100%',
  height: '6px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '3px',
  overflow: 'hidden',
  marginBottom: '1.25rem'
};

const progressBarFill = {
  height: '100%',
  borderRadius: '3px'
};

const checklistContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '1.25rem',
  marginBottom: '1.25rem'
};

const checklistItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const itemSuccessIcon = {
  fontWeight: 'bold',
  color: 'var(--success)'
};

const itemActiveIcon = {
  fontWeight: 'bold',
  color: 'var(--warning)'
};

const itemPendingIcon = {
  color: 'var(--text-muted)'
};

const confirmationSection = {
  marginTop: 'auto'
};

export default Onboarding;
