import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  Users,
  FolderSync,
  UserPlus,
  TrendingUp,
  FileCheck,
  Clock,
  ArrowRight,
  UserCheck
} from 'lucide-react';

const MainDashboard = () => {
  const {
    currentUser,
    activeRole,
    employees,
    departments,
    activityLogs,
    notifications,
    verifyEmployeeDocument
  } = useContext(AppContext);

  // --- Aggregate Stats for HR/Admin Mode ---
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const probationCount = employees.filter(e => e.status === 'On Probation').length;
  const leaveCount = employees.filter(e => e.status === 'On Leave').length;
  
  // Find all pending documents across the whole organization
  const pendingDocs = employees.flatMap(emp =>
    (emp.documents || [])
      .filter(doc => doc.status === 'Pending')
      .map(doc => ({ ...doc, empName: emp.name, empId: emp.id }))
  );

  // Compute department statistics
  const deptStats = departments.map(dept => {
    const count = employees.filter(e => e.department === dept.name).length;
    return { name: dept.name, count, percent: employees.length > 0 ? (count / employees.length) * 100 : 0 };
  });

  // Render Employee Mode Dashboard
  const renderEmployeeDashboard = () => {
    // Find matching employee details
    const empDetails = employees.find(e => e.id === currentUser.id) || currentUser;
    const verifiedDocsCount = (empDetails.documents || []).filter(d => d.status === 'Verified').length;
    const totalDocsCount = (empDetails.documents || []).length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
        
        {/* Welcome Header Banner */}
        <div className="glass-card" style={{
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '4px solid var(--primary)',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="navbar-avatar animate-float" style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              fontSize: '1.75rem',
              backgroundColor: empDetails.bgColor || 'var(--primary)',
              border: '2px solid var(--border-color)',
              color: '#ffffff'
            }}>
              {empDetails.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                Staff Console
              </span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                Welcome back, {empDetails.name}!
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                {empDetails.designation} • {empDetails.department}
              </p>
            </div>
          </div>
          <div>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}>
              {empDetails.status}
            </span>
          </div>
        </div>

        {/* Employee Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Card 1: Personal Credentials Status */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '270px', borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', background: 'var(--primary-glow)', border: '1px solid var(--border-color)' }}>
                <FileCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Document Vault</h3>
            </div>
            
            <div style={{ marginTop: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {verifiedDocsCount} / {totalDocsCount}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Compliance Files</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div style={{
                    height: '100%',
                    width: `${totalDocsCount > 0 ? (verifiedDocsCount / totalDocsCount) * 100 : 0}%`,
                    background: 'var(--accent-gradient)'
                  }}></div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Ensure your passport, contracts, and certifications are fully verified to avoid clearance holds.
                </p>
              </div>
              
              <a href="#/employee/documents" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.6rem' }}>
                <span>Manage Files</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 2: Quick Contact Details */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '270px', borderTop: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid var(--border-color)' }}>
                <UserCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Emergency Contacts</h3>
            </div>
            
            <div style={{ marginTop: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {empDetails.emergencyContacts && empDetails.emergencyContacts.length > 0 ? (
                  empDetails.emergencyContacts.map((contact, idx) => (
                    <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>{contact.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{contact.relationship} • {contact.phone}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                    No contacts declared in your workspace profile yet.
                  </p>
                )}
              </div>
              
              <a href={`#/profile/${empDetails.id}?tab=contacts`} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '0.6rem' }}>
                <span>Edit Contacts</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 3: Timeline Summary */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '270px', borderTop: '3px solid var(--secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', background: 'var(--secondary-glow)', border: '1px solid var(--border-color)' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Milestones</h3>
            </div>
            
            <div style={{ marginTop: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '10px' }}>
                {(empDetails.timeline || []).slice(-3).map((event, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary)',
                      boxShadow: '0 0 8px var(--secondary-glow)'
                    }}></div>
                    <div style={{ paddingLeft: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>{event.date}</span>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{event.title}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Render HR / Admin Console Dashboard
  const renderHRDashboard = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
        
        {/* Page Titles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '4px', fontWeight: 800 }}>
              Operational Console
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Manage corporate headcount compliance, verify document vaults, and review department settings.
            </p>
          </div>
          <a href="#/hr/add-employee" className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add New Employee</span>
          </a>
        </div>

        {/* Dynamic Metric Rows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Staff Strength</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', background: 'var(--primary-glow)' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{employees.length}</h2>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}><TrendingUp size={10} style={{ marginRight: '3px' }} /> +12.3%</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Clearances</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: 'var(--accent-glow)' }}>
                <UserCheck size={18} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{activeCount}</h2>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{leaveCount} on leave</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Probation</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', background: 'var(--warning-glow)' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{probationCount}</h2>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Inspections</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Documents</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', background: 'var(--danger-glow)' }}>
                <FolderSync size={18} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: pendingDocs.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                {pendingDocs.length}
              </h2>
              <span className={`badge badge-${pendingDocs.length > 0 ? 'danger' : 'success'}`} style={{ fontSize: '0.65rem' }}>
                {pendingDocs.length > 0 ? 'Clearance Needed' : 'Fully Clear'}
              </span>
            </div>
          </div>

        </div>

        {/* Details Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }} className="responsive-dashboard-row">
          
          {/* Column Left: Pending Verifications & Department Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Pending Document Verification Tray */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, borderTop: '3px solid var(--warning)' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Pending Document Approvals</h3>
                <span className={`badge badge-${pendingDocs.length > 0 ? 'warning' : 'success'}`}>
                  {pendingDocs.length} Actionable
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {pendingDocs.length === 0 ? (
                  <p style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    All employee files are fully verified and up-to-date.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingDocs.slice(0, 3).map((doc) => (
                      <div key={doc.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 700 }}>{doc.name}</h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Uploaded by <strong>{doc.empName}</strong> ({doc.empId})
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => verifyEmployeeDocument(doc.empId, doc.id, false)}
                            className="btn btn-danger"
                            style={{ padding: '4px 10px', fontSize: '0.7rem', minHeight: '30px' }}
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => verifyEmployeeDocument(doc.empId, doc.id, true)}
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.7rem', minHeight: '30px' }}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, borderTop: '3px solid var(--primary)' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Headcount by Department</h3>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {deptStats.map((dept, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContext: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px' }}>
                      <span style={{ marginRight: 'auto' }}>{dept.name}</span>
                      <span style={{ color: 'var(--primary)' }}>{dept.count} Staff ({Math.round(dept.percent)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${dept.percent}%`,
                        backgroundColor: ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)', 'var(--info)'][idx % 5]
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column Right: Activity Log & System Audit Ledger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, borderTop: '3px solid var(--secondary)' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>System Audit Trail</h3>
                <a href="#/admin/audit-logs" className="badge badge-info" style={{ fontSize: '0.65rem' }}>View All</a>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} style={{
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '700' }}>
                        <span style={{ color: 'var(--primary)' }}>{log.operator}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem', border: '1px solid var(--primary)', textTransform: 'uppercase' }}>
                          {log.action}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
                        {log.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  };

  return activeRole === 'Employee' ? renderEmployeeDashboard() : renderHRDashboard();
};

export default MainDashboard;
