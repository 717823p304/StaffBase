import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, ShieldAlert, Key } from 'lucide-react';

const ManageRoles = () => {
  const { addToast } = useContext(AppContext);

  const matrices = [
    {
      role: 'Employee Level',
      color: 'var(--info)',
      permissions: [
        { name: 'Directory Listing Search', active: true },
        { name: 'Own Profile Bio & Skills Write', active: true },
        { name: 'Own Private Documents Upload', active: true },
        { name: 'HR Operations Wizard Access', active: false },
        { name: 'Financial Salary Details Edit', active: false },
        { name: 'Directory DB Core settings', active: false }
      ]
    },
    {
      role: 'HR Manager Level',
      color: 'var(--warning)',
      permissions: [
        { name: 'Directory Listing Search', active: true },
        { name: 'Own Profile Bio & Skills Write', active: true },
        { name: 'Own Private Documents Upload', active: true },
        { name: 'HR Operations Wizard Access', active: true },
        { name: 'Financial Salary Details Edit', active: true },
        { name: 'Directory DB Core settings', active: false }
      ]
    },
    {
      role: 'System Admin Level',
      color: 'var(--danger)',
      permissions: [
        { name: 'Directory Listing Search', active: true },
        { name: 'Own Profile Bio & Skills Write', active: true },
        { name: 'Own Private Documents Upload', active: true },
        { name: 'HR Operations Wizard Access', active: true },
        { name: 'Financial Salary Details Edit', active: true },
        { name: 'Directory DB Core settings', active: true }
      ]
    }
  ];

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Clearance & Roles Controller</h1>
        <p style={subtitleStyle}>Inspect corporate clearance structures, permission matrices, and security privileges.</p>
      </div>

      {/* Renders grids of matrix */}
      <div style={gridStyle}>
        {matrices.map((matrix, idx) => (
          <div key={idx} className="glass-card" style={panelCard}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Key size={18} style={{ color: matrix.color }} />
                <h3 style={panelTitle}>{matrix.role}</h3>
              </div>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {matrix.permissions.map((perm, pIdx) => (
                <div key={pIdx} style={permRow}>
                  <span style={permNameStyle}>{perm.name}</span>
                  {perm.active ? (
                    <span style={allowedBadge}><ShieldCheck size={14} /> Allowed</span>
                  ) : (
                    <span style={blockedBadge}><ShieldAlert size={14} /> Denied</span>
                  )}
                </div>
              ))}
              <button
                onClick={() => addToast(`Role configuration changes are locked to default for demo sandboxing.`, 'info')}
                className="btn btn-secondary"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                Modify Access Rules
              </button>
            </div>
          </div>
        ))}
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem'
};

const panelCard = {
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
};

const panelHeader = {
  padding: '1rem 1.25rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const panelTitle = {
  fontSize: '0.95rem',
  fontWeight: '700'
};

const permRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px'
};

const permNameStyle = {
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-secondary)'
};

const allowedBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  color: 'var(--success)',
  background: 'var(--success-glow)',
  padding: '2px 6px',
  borderRadius: '4px'
};

const blockedBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  color: 'var(--danger)',
  background: 'var(--danger-glow)',
  padding: '2px 6px',
  borderRadius: '4px'
};

export default ManageRoles;
