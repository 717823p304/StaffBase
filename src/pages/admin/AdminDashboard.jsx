import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sliders, Plus, Trash2, ShieldAlert, Building2, Save } from 'lucide-react';

const AdminDashboard = () => {
  const {
    departments,
    systemSettings,
    setSystemSettings,
    addDepartment,
    deleteDepartment,
    addToast
  } = useContext(AppContext);

  // Department fields State
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptManager, setDeptManager] = useState('');

  // Settings State
  const [companyName, setCompanyName] = useState(systemSettings.companyName || 'StaffBase Inc.');
  const [timeout, setTimeoutVal] = useState(systemSettings.sessionTimeoutMinutes || 30);
  const [mfa, setMfa] = useState(systemSettings.enableMfa || false);

  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    if (!deptName || !deptCode || !deptManager) {
      addToast('Please fill all department fields.', 'warning');
      return;
    }
    addDepartment(deptName, deptCode, deptManager);
    setDeptName('');
    setDeptCode('');
    setDeptManager('');
  };

  const handleSaveSettings = () => {
    setSystemSettings({
      ...systemSettings,
      companyName,
      sessionTimeoutMinutes: timeout,
      enableMfa: mfa
    });
    addToast('System settings saved.', 'success');
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>System Administration Console</h1>
        <p style={subtitleStyle}>Oversee system-wide preferences, active security directory parameters, and department catalogs.</p>
      </div>

      {/* Grid splits */}
      <div style={workspaceSplit}>
        
        {/* Left: Department Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Department List Panel */}
          <div className="glass-card" style={panelStyle}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Building2 size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={panelTitle}>Corporate Department Catalog</h3>
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Dept Name</th>
                      <th>Code</th>
                      <th>Director / Lead</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td><strong>{dept.name}</strong></td>
                        <td><span className="badge badge-info">{dept.code}</span></td>
                        <td>{dept.manager}</td>
                        <td>
                          {departments.length > 2 ? (
                            <button onClick={() => deleteDepartment(dept.id)} style={actionBtnStyle}>
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Department Form */}
          <div className="glass-card" style={panelStyle}>
            <div style={panelHeader}>
              <h3 style={panelTitle}>Add New Department</h3>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <form onSubmit={handleAddDeptSubmit} style={formStyle}>
                <div className="form-group">
                  <label className="form-label">Department Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Legal Operations"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Code Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., LGL"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Appointed Lead Manager</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., John Smith"
                    value={deptManager}
                    onChange={(e) => setDeptManager(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Plus size={16} />
                  <span>Register Department</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Right: Security & Configurations */}
        <div className="glass-card" style={panelStyle}>
          <div style={panelHeader}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Sliders size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={panelTitle}>Directory Global Settings</h3>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="form-group">
              <label className="form-label">Registered Enterprise Name</label>
              <input
                type="text"
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Authentication Token TTL (Minutes)</label>
              <input
                type="number"
                className="form-input"
                value={timeout}
                onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1rem' }}>
              <input
                type="checkbox"
                id="enable-mfa"
                checked={mfa}
                onChange={(e) => setMfa(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="enable-mfa" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                Enforce Multi-Factor Authentication (MFA)
              </label>
            </div>

            <div style={warningNotice} className="glass-card">
              <ShieldAlert size={18} />
              <div>
                <strong style={{ fontSize: '0.75rem', display: 'block' }}>Corporate Compliance Warning:</strong>
                <span style={{ fontSize: '0.7rem', display: 'block', marginTop: '2px', opacity: 0.9 }}>
                  Security controls require regular key rotation. MFA enforcement will apply to all staff consoles.
                </span>
              </div>
            </div>

            <button onClick={handleSaveSettings} className="btn btn-primary" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
              <Save size={16} />
              <span>Save System Settings</span>
            </button>

          </div>
        </div>

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

const workspaceSplit = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '1.5rem'
};

// End of style variables

const panelStyle = {
  border: '1px solid var(--border-color)'
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

const actionBtnStyle = {
  background: 'rgba(239, 68, 68, 0.05)',
  border: '1px solid rgba(239, 68, 68, 0.1)',
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  color: 'var(--danger)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  ':hover': {
    background: '#ef4444',
    color: '#ffffff'
  }
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const warningNotice = {
  padding: '10px 12px',
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
  background: 'rgba(239, 68, 68, 0.02)',
  borderColor: 'rgba(239, 68, 68, 0.15)',
  color: 'var(--danger)',
  textAlign: 'left'
};

export default AdminDashboard;
