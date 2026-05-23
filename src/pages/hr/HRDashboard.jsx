import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Briefcase, Sliders, AlertCircle, Clock, UserPlus, Eye, Users, UserCheck, X } from 'lucide-react';

const HRDashboard = () => {
  const { 
    employees, 
    notifications,
    registrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest
  } = useContext(AppContext);

  // Aggregates
  const probationEmployees = employees.filter(e => e.status === 'On Probation');
  const leavesEmployees = employees.filter(e => e.status === 'On Leave');
  const activeEmployees = employees.filter(e => e.status === 'Active');

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>HR Operations Console</h1>
          <p style={subtitleStyle}>Oversee staffing segments, confirmation workflows, probation timelines, and compliance reviews.</p>
        </div>
        <a href="#/hr/add-employee" className="btn btn-primary">
          <UserPlus size={16} />
          <span>Add Employee Wizard</span>
        </a>
      </div>

      {/* Overview Grid */}
      <div style={gridStyle}>
        
        {/* Pending Profile Requests Panel */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <UserCheck size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={panelTitleStyle}>Pending Profile Requests ({registrationRequests?.length || 0})</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {!registrationRequests || registrationRequests.length === 0 ? (
              <p style={emptyTextStyle}>No pending employee profile requests at this time.</p>
            ) : (
              <div style={listStyle}>
                {registrationRequests.map(req => (
                  <div key={req.id} style={reqItemStyle}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ ...itemNameStyle, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{req.name}</h4>
                        <span style={reqDeptBadge}>{req.department}</span>
                      </div>
                      <p style={{ ...itemSubStyle, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{req.email}</p>
                      <p style={reqTimeText}>{new Date(req.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                    <div style={reqActionsStyle}>
                      <button 
                        onClick={() => approveRegistrationRequest(req.id)}
                        className="btn btn-primary"
                        style={actionBtnStyle}
                        title="Approve & Onboard"
                      >
                        <UserPlus size={12} />
                        <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => rejectRegistrationRequest(req.id)}
                        className="btn btn-secondary"
                        style={rejectBtnStyle}
                        title="Reject Request"
                      >
                        <X size={12} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Probation Panel */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Clock size={18} style={{ color: 'var(--warning)' }} />
              <h3 style={panelTitleStyle}>Probation Tracker ({probationEmployees.length})</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {probationEmployees.length === 0 ? (
              <p style={emptyTextStyle}>No employees currently in probation segment.</p>
            ) : (
              <div style={listStyle}>
                {probationEmployees.map(emp => (
                  <div key={emp.id} style={listItemStyle}>
                    <div>
                      <h4 style={itemNameStyle}>{emp.name}</h4>
                      <p style={itemSubStyle}>{emp.designation} • Joined {emp.dateOfJoining}</p>
                    </div>
                    <a href={`#/profile/${emp.id}`} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                      <Eye size={12} />
                      <span>Review</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leaves Panel */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertCircle size={18} style={{ color: 'var(--info)' }} />
              <h3 style={panelTitleStyle}>On Leave Absence list ({leavesEmployees.length})</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {leavesEmployees.length === 0 ? (
              <p style={emptyTextStyle}>All employees are present at work.</p>
            ) : (
              <div style={listStyle}>
                {leavesEmployees.map(emp => (
                  <div key={emp.id} style={listItemStyle}>
                    <div>
                      <h4 style={itemNameStyle}>{emp.name}</h4>
                      <p style={itemSubStyle}>{emp.designation} • {emp.department}</p>
                    </div>
                    <span className="badge badge-warning">On Leave</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compliance Warnings */}
        <div className="glass-card" style={panelCardStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
              <h3 style={panelTitleStyle}>Compliance & Expiry Warnings ({notifications.length})</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {notifications.length === 0 ? (
              <p style={emptyTextStyle}>All document audits verified. Compliance normal.</p>
            ) : (
              <div style={listStyle}>
                {notifications.slice(0, 4).map((notif, idx) => (
                  <div key={idx} style={warningItemStyle}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: `var(--${notif.type})`
                    }}></span>
                    <p style={warningText}>{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
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

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
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

const panelCardStyle = {
  border: '1px solid var(--border-color)'
};

const panelHeaderStyle = {
  padding: '1rem 1.25rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const panelTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700'
};

const emptyTextStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  textAlign: 'center',
  padding: '2rem 1rem'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px'
};

const itemNameStyle = {
  fontSize: '0.85rem',
  fontWeight: '700'
};

const itemSubStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  marginTop: '1px'
};

const warningItemStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  padding: '8px 10px',
  background: 'rgba(255, 255, 255, 0.01)',
  borderRadius: '6px'
};

const warningText = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)'
};

const reqItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px'
};

const reqDeptBadge = {
  fontSize: '0.65rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: 'var(--primary)',
  background: 'var(--primary-glow)',
  padding: '2px 6px',
  borderRadius: '4px',
  whiteSpace: 'nowrap'
};

const reqTimeText = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  marginTop: '2px'
};

const reqActionsStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '4px'
};

const actionBtnStyle = {
  padding: '4px 8px',
  fontSize: '0.7rem',
  flex: 1,
  justifyContent: 'center',
  height: '26px'
};

const rejectBtnStyle = {
  padding: '4px 8px',
  fontSize: '0.7rem',
  flex: 1,
  justifyContent: 'center',
  height: '26px',
  color: '#ef4444',
  borderColor: 'rgba(239, 68, 68, 0.2)',
  background: 'rgba(239, 68, 68, 0.05)'
};

export default HRDashboard;
