import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { Sliders, Plus, Trash2, ShieldAlert, Building2, Save, User, Users, ShieldCheck, ToggleLeft, ToggleRight, UserPlus, Key } from 'lucide-react';

const AdminDashboard = () => {
  const {
    departments,
    systemSettings,
    addDepartment,
    deleteDepartment,
    updateSettings,
    addToast
  } = useContext(AppContext);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'accounts'

  // Department fields State
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptManager, setDeptManager] = useState('');

  // Settings State
  const [companyName, setCompanyName] = useState('');
  const [timeout, setTimeoutVal] = useState(30);
  const [mfa, setMfa] = useState(false);

  // Sync settings state when systemSettings is loaded from context
  useEffect(() => {
    if (systemSettings) {
      setCompanyName(systemSettings.companyName || 'StaffBase Inc.');
      setTimeoutVal(systemSettings.sessionTimeoutMinutes || 30);
      setMfa(systemSettings.enableMfa || false);
    }
  }, [systemSettings]);

  // Account Management State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Create User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Employee');
  const [newUserStatus, setNewUserStatus] = useState('Active');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch directory users', 'danger');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddDeptSubmit = async (e) => {
    e.preventDefault();
    if (!deptName || !deptCode || !deptManager) {
      addToast('Please fill all department fields.', 'warning');
      return;
    }
    const success = await addDepartment(deptName, deptCode, deptManager);
    if (success) {
      setDeptName('');
      setDeptCode('');
      setDeptManager('');
    }
  };

  const handleSaveSettings = async () => {
    await updateSettings({
      companyName,
      sessionTimeoutMinutes: timeout,
      enableMfa: mfa
    });
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      addToast('Please fill out all user creation fields.', 'warning');
      return;
    }
    try {
      const res = await api.post('/admin/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        status: newUserStatus
      });
      if (res.success) {
        addToast(`User account for ${newUserName} created successfully.`, 'success');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('Employee');
        setNewUserStatus('Active');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create user account', 'danger');
    }
  };

  const handleToggleUserStatus = async (email, currentActive) => {
    try {
      const res = await api.put(`/admin/users/${email}/status`, { active: !currentActive });
      if (res.success) {
        addToast(`User status updated successfully.`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle user status', 'danger');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to permanently delete account: ${email}?`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/users/${email}`);
      if (res.success) {
        addToast(`Account ${email} deleted.`, 'warning');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete user account', 'danger');
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>System Administration Console</h1>
        <p style={subtitleStyle}>Oversee system-wide preferences, active security directory parameters, and department catalogs.</p>
      </div>

      {/* Tabs Switcher */}
      <div style={tabsRowStyle}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            ...tabButtonStyle,
            borderBottom: activeTab === 'settings' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)'
          }}
        >
          <Sliders size={16} />
          <span>System Configuration</span>
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          style={{
            ...tabButtonStyle,
            borderBottom: activeTab === 'accounts' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'accounts' ? 'var(--text-primary)' : 'var(--text-muted)'
          }}
        >
          <Users size={16} />
          <span>Admin & User Accounts</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'settings' ? (
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
                            <button onClick={() => deleteDepartment(dept.id)} style={actionBtnStyle}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {departments.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                            No departments registered in directory.
                          </td>
                        </tr>
                      )}
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
      ) : (
        <div style={workspaceSplit}>
          
          {/* Left: Accounts List */}
          <div className="glass-card" style={panelStyle}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Users size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={panelTitle}>Directory User Accounts</h3>
              </div>
              <span className="badge badge-info">{users.length} Active Accounts</span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Loading active security directory...
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Staff Profile</th>
                        <th>Role</th>
                        <th>Credentials Suffix</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{user.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {user.employeeId || 'System Admin'} • {user.department || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-${user.role === 'Admin' ? 'danger' : user.role === 'HR' ? 'warning' : 'info'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user.email}</td>
                          <td>
                            <span className={`badge badge-${user.active ? 'success' : 'danger'}`}>
                              {user.active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleToggleUserStatus(user.email, user.active)}
                                style={{
                                  ...actionBtnStyle,
                                  color: user.active ? 'var(--warning)' : 'var(--success)',
                                  background: 'rgba(255,255,255,0.02)'
                                }}
                                title={user.active ? 'Disable Account' : 'Enable Account'}
                              >
                                {user.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                style={actionBtnStyle}
                                title="Delete Account"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right: Add New User Form */}
          <div className="glass-card" style={panelStyle}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <UserPlus size={18} style={{ color: 'var(--success)' }} />
                <h3 style={panelTitle}>Create User Profile</h3>
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <form onSubmit={handleCreateUserSubmit} style={formStyle}>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Alex Johnson"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Suffix</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="alex@employee.com, sara@hr.com, john@admin.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Note: Domain suffix resolves role automatically (@admin.com, @hr.com, @employee.com).
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Security Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Console Access Role</label>
                  <select
                    className="form-select"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                  >
                    <option value="Employee">Employee Mode</option>
                    <option value="HR">HR Mode</option>
                    <option value="Admin">Admin Mode</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Status</label>
                  <select
                    className="form-select"
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value)}
                  >
                    <option value="Active">Active / Enabled</option>
                    <option value="Disabled">Disabled / Inactive</option>
                  </select>
                </div>

                <div style={encryptionNotice} className="glass-card">
                  <Key size={14} />
                  <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>
                    Credentials will be cryptographically hashed using BCrypt.
                  </span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  <Plus size={16} />
                  <span>Create User Account</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}
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
  gap: '12px'
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

const encryptionNotice = {
  padding: '8px 10px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  background: 'rgba(16, 185, 129, 0.02)',
  borderColor: 'rgba(16, 185, 129, 0.15)',
  color: 'var(--success)'
};

const tabsRowStyle = {
  display: 'flex',
  gap: '1.5rem',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '2px'
};

const tabButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '8px 12px',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
};

export default AdminDashboard;
