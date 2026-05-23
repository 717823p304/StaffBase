import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  User,
  Clock,
  Briefcase,
  Smartphone,
  CreditCard,
  Plus,
  Trash2,
  Lock,
  Edit2,
  Save,
  CheckCircle,
  FileCheck,
  FolderOpen
} from 'lucide-react';

const Profile = ({ id, activeTab = 'about' }) => {
  const {
    currentUser,
    activeRole,
    employees,
    updateEmployee,
    updateEmployeeSkills,
    updateEmployeeBanking,
    updateEmployeeEmergency,
    addToast
  } = useContext(AppContext);

  // If no ID is passed, default to viewing current logged-in user
  const targetId = id || currentUser.id;
  const emp = employees.find(e => e.id === targetId);

  if (!emp) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: 'var(--danger)' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The employee ID "{targetId}" does not exist in the directory.</p>
        <a href="#/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Back to Home</a>
      </div>
    );
  }

  // Authorizations
  const isSelf = currentUser.id === emp.id;
  const hasAccessToPrivateDetails = isSelf || activeRole === 'HR Manager' || activeRole === 'Admin';

  const [currentActiveTab, setCurrentActiveTab] = useState(activeTab);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(emp.bio || '');

  // Skills Editing
  const [newSkill, setNewSkill] = useState('');
  
  // Emergency Contact Editing
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactsState, setContactsState] = useState(emp.emergencyContacts || []);
  
  // Banking Editing
  const [isEditingBanking, setIsEditingBanking] = useState(false);
  const [bankingState, setBankingState] = useState(emp.bankingInfo || { bankName: '', accountName: '', accountNumber: '', ifscCode: '', salary: 50000 });

  const handleSaveBio = () => {
    updateEmployee(emp.id, { bio: bioInput });
    setIsEditingBio(false);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      if (emp.skills.includes(newSkill.trim())) {
        addToast('Skill already exists.', 'warning');
        return;
      }
      const updated = [...emp.skills, newSkill.trim()];
      updateEmployeeSkills(emp.id, updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillName) => {
    const updated = emp.skills.filter(s => s !== skillName);
    updateEmployeeSkills(emp.id, updated);
  };

  // Contacts Handlers
  const handleAddContact = () => {
    setContactsState([...contactsState, { name: '', relationship: '', phone: '', email: '' }]);
  };

  const handleRemoveContact = (idx) => {
    setContactsState(contactsState.filter((_, i) => i !== idx));
  };

  const handleSaveContacts = () => {
    updateEmployeeEmergency(emp.id, contactsState);
    setIsEditingContacts(false);
  };

  // Banking Handlers
  const handleSaveBanking = () => {
    updateEmployeeBanking(emp.id, bankingState);
    setIsEditingBanking(false);
  };

  const tabs = [
    { id: 'about', label: 'About Me', icon: <User size={16} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { id: 'skills', label: 'Skills & Qualifications', icon: <Briefcase size={16} /> },
    { id: 'contacts', label: 'Emergency Contacts', icon: <Smartphone size={16} /> },
    { id: 'banking', label: 'Banking & Payroll', icon: <CreditCard size={16} /> }
  ];

  return (
    <div style={containerStyle} className="animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card" style={headerCardStyle}>
        <div style={headerContentStyle}>
          <div style={{
            ...avatarBigStyle,
            backgroundColor: emp.bgColor || 'var(--primary)'
          }}>
            {emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={empNameStyle}>{emp.name}</h1>
              <span className={`badge badge-${emp.status === 'Active' ? 'success' : emp.status === 'On Probation' ? 'warning' : 'danger'}`}>
                {emp.status}
              </span>
            </div>
            <p style={empSubtextStyle}>{emp.designation} • {emp.department}</p>
            <p style={empEmailStyle}>{emp.email} • Joined {emp.dateOfJoining}</p>
          </div>
          <div style={empIdBadgeStyle}>
            <span>ID: {emp.id}</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={tabBarContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentActiveTab(tab.id)}
              style={currentActiveTab === tab.id ? tabButtonActive : tabButtonStyle}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div style={{ marginTop: '1rem' }}>
        
        {/* Panel 1: About Me */}
        {currentActiveTab === 'about' && (
          <div className="glass-card" style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Professional Biography</h2>
              {isSelf && !isEditingBio && (
                <button onClick={() => setIsEditingBio(true)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Edit2 size={12} />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              {isEditingBio ? (
                <div>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveBio} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Save size={12} />
                      <span>Save Bio</span>
                    </button>
                    <button onClick={() => setIsEditingBio(false)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p style={bioTextStyle}>{emp.bio || 'This employee has not written a corporate biography yet.'}</p>
              )}

              <hr style={dividerStyle} />

              <h3 style={sectionHeadingStyle}>Corporate Details</h3>
              <div style={infoGridStyle}>
                <div style={infoItem}>
                  <span style={infoLabel}>Active Directory Role</span>
                  <span style={infoValue}>{emp.role}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Employment Segment</span>
                  <span style={infoValue}>{emp.department}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Position Designation</span>
                  <span style={infoValue}>{emp.designation}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Hire / Onboarding Date</span>
                  <span style={infoValue}>{emp.dateOfJoining}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Timeline */}
        {currentActiveTab === 'timeline' && (
          <div className="glass-card" style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Employment & Career Milestones</h2>
            </div>
            <div style={{ padding: '2rem 1.5rem' }}>
              <div style={timelineContainer}>
                {(emp.timeline || []).map((event, idx) => (
                  <div key={idx} style={timelineRowStyle}>
                    <div style={timelineBulletWrapper}>
                      <div style={timelineDot}></div>
                      {idx !== emp.timeline.length - 1 && <div style={timelineConnectorLine}></div>}
                    </div>
                    <div style={timelineContentCard} className="glass-card">
                      <span style={timelineEventDate}>{event.date}</span>
                      <h3 style={timelineEventTitle}>{event.title}</h3>
                      <p style={timelineEventDesc}>{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel 3: Skills */}
        {currentActiveTab === 'skills' && (
          <div className="glass-card" style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Skills & Core Competencies</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={tabInstructionText}>Declare technical stacks, certifications, and operations skills to enable department searches.</p>
              
              {/* Skill Pill Grids */}
              <div style={skillsGridStyle}>
                {(emp.skills || []).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills currently declared.</p>
                ) : (
                  (emp.skills || []).map((skill, idx) => (
                    <div key={idx} style={skillPillStyle}>
                      <span>{skill}</span>
                      {hasAccessToPrivateDetails && (
                        <button onClick={() => handleRemoveSkill(skill)} style={skillRemoveBtn}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Skill Adder Form */}
              {hasAccessToPrivateDetails && (
                <form onSubmit={handleAddSkill} style={skillFormStyle}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Docker, Public Speaking, AWS, Accounting"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    style={{ maxWidth: '300px' }}
                  />
                  <button type="submit" className="btn btn-primary">
                    <Plus size={16} />
                    <span>Add Skill</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Panel 4: Emergency Contacts */}
        {currentActiveTab === 'contacts' && (
          <div className="glass-card" style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Emergency Contacts</h2>
              {hasAccessToPrivateDetails && !isEditingContacts && (
                <button onClick={() => setIsEditingContacts(true)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Edit2 size={12} />
                  <span>Edit Contacts</span>
                </button>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              {isEditingContacts ? (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {contactsState.map((contact, idx) => (
                      <div key={idx} style={editableContactRow} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>Contact #{idx + 1}</span>
                          <button onClick={() => handleRemoveContact(idx)} style={deleteContactRowBtn}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div style={contactInputGrid}>
                          <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={contact.name}
                              onChange={(e) => {
                                const newCont = [...contactsState];
                                newCont[idx].name = e.target.value;
                                setContactsState(newCont);
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Relationship</label>
                            <input
                              type="text"
                              className="form-input"
                              value={contact.relationship}
                              onChange={(e) => {
                                const newCont = [...contactsState];
                                newCont[idx].relationship = e.target.value;
                                setContactsState(newCont);
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-input"
                              value={contact.phone}
                              onChange={(e) => {
                                const newCont = [...contactsState];
                                newCont[idx].phone = e.target.value;
                                setContactsState(newCont);
                              }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              className="form-input"
                              value={contact.email}
                              onChange={(e) => {
                                const newCont = [...contactsState];
                                newCont[idx].email = e.target.value;
                                setContactsState(newCont);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleAddContact} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Plus size={12} />
                      <span>Add Contact Record</span>
                    </button>
                    <button onClick={handleSaveContacts} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Save size={12} />
                      <span>Save Changes</span>
                    </button>
                    <button onClick={() => { setIsEditingContacts(false); setContactsState(emp.emergencyContacts || []); }} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={contactsListGrid}>
                  {(emp.emergencyContacts || []).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No emergency contact details are currently listed in this employee record.</p>
                  ) : (
                    (emp.emergencyContacts || []).map((contact, idx) => (
                      <div key={idx} style={contactCardStyle} className="glass-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{contact.name}</h3>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', margin: '4px 0 10px 0' }}>
                          {contact.relationship}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span>📞 {contact.phone}</span>
                          {contact.email && <span>✉️ {contact.email}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panel 5: Banking */}
        {currentActiveTab === 'banking' && (
          <div className="glass-card" style={panelCardStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Banking coordinates & Compensation Details</h2>
              {hasAccessToPrivateDetails && !isEditingBanking && (
                <button onClick={() => setIsEditingBanking(true)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Edit2 size={12} />
                  <span>Edit Payroll Coordinates</span>
                </button>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              {!hasAccessToPrivateDetails ? (
                <div style={lockOverlay}>
                  <Lock size={36} />
                  <h3>Confidential Information Locked</h3>
                  <p>You do not have the clearance coordinates required to review financial payroll metadata for other employees.</p>
                </div>
              ) : isEditingBanking ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={contactInputGrid}>
                    <div className="form-group">
                      <label className="form-label">Bank Institution Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bankingState.bankName}
                        onChange={(e) => setBankingState({ ...bankingState, bankName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Account Payee Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bankingState.accountName}
                        onChange={(e) => setBankingState({ ...bankingState, accountName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bankingState.accountNumber}
                        onChange={(e) => setBankingState({ ...bankingState, accountNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bank IFSC / Routing Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bankingState.ifscCode}
                        onChange={(e) => setBankingState({ ...bankingState, ifscCode: e.target.value })}
                        required
                      />
                    </div>
                    {(activeRole === 'HR Manager' || activeRole === 'Admin') && (
                      <div className="form-group">
                        <label className="form-label">Annual Base Salary ($ USD)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={bankingState.salary}
                          onChange={(e) => setBankingState({ ...bankingState, salary: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveBanking} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Save size={12} />
                      <span>Save Changes</span>
                    </button>
                    <button onClick={() => { setIsEditingBanking(false); setBankingState(emp.bankingInfo); }} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={infoGridStyle}>
                  <div style={infoItem}>
                    <span style={infoLabel}>Deposit Bank</span>
                    <span style={infoValue}>{emp.bankingInfo?.bankName || 'Not Declared'}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Account Holder</span>
                    <span style={infoValue}>{emp.bankingInfo?.accountName || 'Not Declared'}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Account Coordinates</span>
                    <span style={infoValue}>{emp.bankingInfo?.accountNumber || 'Not Declared'}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Institution Code (IFSC)</span>
                    <span style={infoValue}>{emp.bankingInfo?.ifscCode || 'Not Declared'}</span>
                  </div>
                  {(activeRole === 'HR Manager' || activeRole === 'Admin' || isSelf) && (
                    <div style={infoItem}>
                      <span style={infoLabel}>Annual Base Salary</span>
                      <span style={{ ...infoValue, color: 'var(--success)', fontWeight: '800' }}>
                        ${emp.bankingInfo?.salary?.toLocaleString() || '0'} USD
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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

const headerCardStyle = {
  padding: '2rem',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)'
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flexWrap: 'wrap',
  marginBottom: '2rem'
};

const avatarBigStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '2rem',
  boxShadow: 'var(--shadow-glow)'
};

const empNameStyle = {
  fontSize: '1.75rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  letterSpacing: '-0.5px'
};

const empSubtextStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  marginTop: '2px',
  fontWeight: '600'
};

const empEmailStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  marginTop: '2px'
};

const empIdBadgeStyle = {
  padding: '6px 12px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  color: 'var(--text-secondary)'
};

const tabBarContainer = {
  display: 'flex',
  gap: '8px',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1.25rem',
  flexWrap: 'wrap'
};

const tabButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0.625rem 1rem',
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '600',
  transition: 'all 0.2s'
};

const tabButtonActive = {
  ...tabButtonStyle,
  background: 'var(--primary-glow)',
  color: 'var(--primary)'
};

const panelCardStyle = {
  border: '1px solid var(--border-color)'
};

const panelHeaderStyle = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const panelTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const bioTextStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.6',
  whiteSpace: 'pre-line'
};

const dividerStyle = {
  margin: '1.5rem 0',
  border: 'none',
  borderTop: '1px solid var(--border-color)'
};

const sectionHeadingStyle = {
  fontSize: '0.875rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.8px',
  marginBottom: '1rem'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem'
};

const infoItem = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const infoLabel = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '600'
};

const infoValue = {
  fontSize: '0.95rem',
  color: 'var(--text-primary)',
  fontWeight: '700'
};

// Timeline Styles
const timelineContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  position: 'relative'
};

const timelineRowStyle = {
  display: 'flex',
  position: 'relative',
  gap: '1.5rem'
};

const timelineBulletWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '16px'
};

const timelineDot = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  boxShadow: 'var(--shadow-glow)',
  zIndex: 1,
  marginTop: '16px'
};

const timelineConnectorLine = {
  flex: 1,
  width: '2px',
  backgroundColor: 'var(--border-color)',
  marginTop: '4px'
};

const timelineContentCard = {
  flex: 1,
  padding: '1.25rem 1.5rem',
  background: 'var(--bg-card)'
};

const timelineEventDate = {
  fontSize: '0.75rem',
  color: 'var(--primary)',
  fontWeight: '700'
};

const timelineEventTitle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  marginTop: '2px'
};

const timelineEventDesc = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginTop: '4px'
};

// Skills Styles
const tabInstructionText = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginBottom: '1rem'
};

const skillsGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '1.5rem'
};

const skillPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  background: 'var(--primary-glow)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const skillRemoveBtn = {
  background: 'none',
  border: 'none',
  color: 'var(--danger)',
  cursor: 'pointer',
  padding: '2px',
  display: 'flex',
  alignItems: 'center'
};

const skillFormStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '1rem',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1rem'
};

// Emergency Contacts Styles
const contactsListGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.25rem'
};

const contactCardStyle = {
  padding: '1.25rem',
  border: '1px solid var(--border-color)'
};

const editableContactRow = {
  padding: '1.25rem',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const contactInputGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px'
};

const deleteContactRowBtn = {
  background: 'none',
  border: 'none',
  color: 'var(--danger)',
  cursor: 'pointer'
};

// Banking Locks
const lockOverlay = {
  padding: '3rem 1.5rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  color: 'var(--text-muted)'
};

export default Profile;
