import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { ShieldCheck, ShieldAlert, Key, RotateCcw, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle, gridStyle, panelCardStyle, panelHeaderStyle, panelTitleStyle } from '../../styles/shared';

const ManageRoles = () => {
  const { addToast } = useContext(AppContext);

  // States
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unlockedRoles, setUnlockedRoles] = useState({});

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles');
      if (res.success) {
        setRoles(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to retrieve clearance roles', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const toggleRoleLock = async (idx, roleId) => {
    const isUnlocked = !!unlockedRoles[idx];
    setUnlockedRoles(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
    
    if (!isUnlocked) {
      addToast(`${roles[idx].name} rules unlocked for editing.`, 'info');
    } else {
      // Save changes to backend
      try {
        const res = await api.put(`/roles/${roleId}`, roles[idx].permissions);
        if (res.success) {
          addToast(`${roles[idx].name} rules secured and saved successfully.`, 'success');
          fetchRoles(); // refresh
        }
      } catch (err) {
        addToast(err.message || 'Failed to save clearance permissions', 'danger');
      }
    }
  };

  const handleTogglePermission = (roleIdx, pIdx) => {
    setRoles(prev => prev.map((role, idx) => 
      idx === roleIdx 
        ? { 
            ...role, 
            permissions: role.permissions.map((p, i) => i === pIdx ? { ...p, active: !p.active } : p) 
          } 
        : role
    ));
  };

  const handleEnableAll = (roleIdx) => {
    setRoles(prev => prev.map((role, idx) => 
      idx === roleIdx 
        ? { ...role, permissions: role.permissions.map(p => ({ ...p, active: true })) } 
        : role
    ));
    addToast(`All permissions enabled for ${roles[roleIdx].name}.`, 'success');
  };

  const handleDisableAll = (roleIdx) => {
    setRoles(prev => prev.map((role, idx) => 
      idx === roleIdx 
        ? { ...role, permissions: role.permissions.map(p => ({ ...p, active: false })) } 
        : role
    ));
    addToast(`All permissions disabled for ${roles[roleIdx].name}.`, 'warning');
  };

  const handleResetDefaults = () => {
    fetchRoles();
    setUnlockedRoles({});
    addToast("All role permissions reloaded from system database.", "info");
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Clearance & Roles Controller"
        subtitle="Inspect and customize corporate clearance levels, permission matrices, and security privileges."
      >
        <button 
          onClick={handleResetDefaults} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RotateCcw size={14} />
          <span>Reload Settings</span>
        </button>
      </PageHeader>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Retrieving clearance directories...
        </div>
      ) : (
        /* Renders grids of matrix */
        <div style={gridStyle}>
          {roles.map((role, idx) => {
            const isUnlocked = !!unlockedRoles[idx];

            return (
              <div 
                key={role.id} 
                className="glass-card" 
                style={{
                  ...panelCardStyle,
                  borderColor: isUnlocked ? (role.color || 'var(--primary)') : 'var(--border-color)',
                  boxShadow: isUnlocked ? `0 0 15px rgba(255, 255, 255, 0.05)` : 'none',
                  transform: isUnlocked ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={panelHeaderStyle}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Key size={18} style={{ color: role.color || 'var(--primary)' }} />
                    <h3 style={panelTitleStyle}>{role.name} Level</h3>
                  </div>
                  {isUnlocked && <span style={{ ...editingLabel, color: role.color }}>Editable</span>}
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Enable All / Disable All Quick Controls */}
                  {isUnlocked && (
                    <div style={quickControlsRow}>
                      <button 
                        onClick={() => handleEnableAll(idx)}
                        style={{ ...quickButton, color: 'var(--success)', border: '1px solid var(--success-glow)' }}
                      >
                        Enable All
                      </button>
                      <button 
                        onClick={() => handleDisableAll(idx)}
                        style={{ ...quickButton, color: 'var(--danger)', border: '1px solid var(--danger-glow)' }}
                      >
                        Disable All
                      </button>
                    </div>
                  )}

                  {role.permissions.map((perm, pIdx) => (
                    <div 
                      key={pIdx} 
                      style={{
                        ...permRow,
                        borderColor: isUnlocked ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-color)',
                        backgroundColor: isUnlocked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)'
                      }}
                    >
                      <span style={permNameStyle}>{perm.name}</span>
                      {isUnlocked ? (
                        /* Styled Toggle Switch */
                        <label style={switchLabelStyle}>
                          <input 
                            type="checkbox" 
                            checked={perm.active}
                            onChange={() => handleTogglePermission(idx, pIdx)}
                            style={checkboxHiddenStyle}
                          />
                          <span style={{ 
                            ...switchTrackStyle, 
                            backgroundColor: perm.active ? (role.color || 'var(--primary)') : 'rgba(120, 120, 120, 0.15)',
                            border: perm.active ? `1px solid ${role.color}` : '1px solid var(--border-color)'
                          }}>
                            <span style={{ 
                              ...switchThumbStyle, 
                              transform: perm.active ? 'translateX(18px)' : 'translateX(2px)' 
                            }} />
                          </span>
                        </label>
                      ) : perm.active ? (
                        <span style={allowedBadge}><ShieldCheck size={14} /> Allowed</span>
                      ) : (
                        <span style={blockedBadge}><ShieldAlert size={14} /> Denied</span>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={() => toggleRoleLock(idx, role.id)}
                    className={isUnlocked ? "btn btn-primary" : "btn btn-secondary"}
                    style={{ 
                      marginTop: '1rem', 
                      width: '100%', 
                      justifyContent: 'center', 
                      fontSize: '0.8rem',
                      backgroundColor: isUnlocked ? (role.color || 'var(--primary)') : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isUnlocked ? (role.color || 'var(--primary)') : 'var(--border-color)',
                      color: isUnlocked ? '#000000' : 'var(--text-primary)',
                      fontWeight: isUnlocked ? '700' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <EyeOff size={14} />
                        <span>Lock & Secure Rules</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Modify Access Rules</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Styling definitions
const editingLabel = {
  fontSize: '0.65rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  padding: '2px 8px',
  borderRadius: '4px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const quickControlsRow = {
  display: 'flex',
  gap: '10px',
  marginBottom: '4px'
};

const quickButton = {
  flex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  padding: '6px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s'
};

const permRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 10px',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  transition: 'all 0.2s'
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

// Switch Styles
const switchLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer'
};

const checkboxHiddenStyle = {
  display: 'none'
};

const switchTrackStyle = {
  width: '38px',
  height: '20px',
  borderRadius: '10px',
  position: 'relative',
  transition: 'all 0.25s ease',
  display: 'inline-block',
  boxSizing: 'border-box'
};

const switchThumbStyle = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  position: 'absolute',
  top: '2px',
  left: 0,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
};

export default ManageRoles;
