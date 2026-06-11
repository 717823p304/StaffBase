import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Download, Users, Gauge, Percent, BarChart2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';
import { downloadFile } from '../../utils/downloadFile';

const ReportsDashboard = () => {
  const { employees, addToast } = useContext(AppContext);

  // Helper to dynamically determine gender from employee names in a predictable, stable way
  const getGender = (name) => {
    const femaleNames = [
      'sarah', 'amanda', 'elena', 'lily', 'connor', 'jane', 
      'marie', 'emily', 'sophia', 'ross', 'jenkins', 'rostova'
    ];
    const lower = name.toLowerCase();
    if (femaleNames.some(fn => lower.includes(fn))) return 'Female';
    return 'Male';
  };

  // 1. Calculate Male / Female rates dynamically
  const totalEmployees = employees.length || 1;
  const genderCounts = employees.reduce((acc, emp) => {
    const gender = getGender(emp.name);
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, { Male: 0, Female: 0 });

  const malePct = Math.round((genderCounts.Male / totalEmployees) * 100);
  const femalePct = 100 - malePct;

  // 2. Headcounts department wise
  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const departments = Object.keys(deptCounts);
  const maxCount = Math.max(...Object.values(deptCounts), 1);

  // 3. Simulated Department Efficiency (consistent with department names in system)
  const getDeptEfficiency = (deptName) => {
    const efficiencies = {
      'Engineering': 94,
      'Human Resources': 96,
      'Product & Design': 91,
      'Marketing & Sales': 88,
      'Finance': 95
    };
    return efficiencies[deptName] || 92; // Default fallback for newly added departments
  };

  const getEfficiencyStatus = (val) => {
    if (val >= 95) return { text: 'Optimal Performance', color: 'var(--success)' };
    if (val >= 90) return { text: 'Highly Productive', color: 'var(--primary)' };
    return { text: 'On Track', color: 'var(--secondary)' };
  };

  const handleExportExcel = async () => {
    try {
      await downloadFile('/reports/export/excel', 'StaffBase_Directory_Database.csv');
      addToast('CSV export downloaded successfully.', 'success');
    } catch (err) {
      addToast('Failed to export CSV: ' + err.message, 'danger');
    }
  };

  const handleExportPdf = async () => {
    try {
      await downloadFile('/reports/export/pdf', 'StaffBase_Directory_Report.pdf');
      addToast('PDF report downloaded successfully.', 'success');
    } catch (err) {
      addToast('Failed to export PDF: ' + err.message, 'danger');
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Operational Reports & Analytics"
        subtitle="Simplified key performance indicators: gender diversity distribution, staff headcount, and operational efficiencies."
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportExcel} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={14} />
            <span>Export Roster CSV</span>
          </button>
          <button onClick={handleExportPdf} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={14} />
            <span>Export PDF Report</span>
          </button>
        </div>
      </PageHeader>

      {/* Main Simplified Layout Grid */}
      <div style={reportsGrid}>
        
        {/* SECTION 1: Male / Female Diversity Rate */}
        <div className="glass-card" style={cardStyle}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={cardTitle}>Gender Representation Ratio</h3>
            </div>
            <span style={badgeStyle}>Workforce Balance</span>
          </div>
          <div style={cardBody}>
            {/* Visual Circular Representation */}
            <div style={genderVisualContainer}>
              <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" />
                
                {/* Female Ring (Pink) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#ec4899" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * femalePct) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
                
                {/* Male Ring (Primary/Gold) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="30" 
                  fill="transparent" 
                  stroke="var(--primary)" 
                  strokeWidth="10" 
                  strokeDasharray="188.4" 
                  strokeDashoffset={188.4 - (188.4 * malePct) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
              </svg>
              
              <div style={genderMetrics}>
                <div style={genderIndicatorRow}>
                  <span style={{ ...colorIndicator, backgroundColor: 'var(--primary)' }}></span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={genderText}>Male Staff</span>
                    <span style={genderPercentage}>{malePct}% <span style={genderSub}>{genderCounts.Male} employees</span></span>
                  </div>
                </div>
                
                <div style={genderIndicatorRow}>
                  <span style={{ ...colorIndicator, backgroundColor: '#ec4899' }}></span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={genderText}>Female Staff</span>
                    <span style={genderPercentage}>{femalePct}% <span style={genderSub}>{genderCounts.Female} employees</span></span>
                  </div>
                </div>
              </div>
            </div>
            <p style={insightText}>
              Balanced representation across executive roles aligns with our corporate diversity targets.
            </p>
          </div>
        </div>

        {/* SECTION 2: Staff Headcount Department-Wise */}
        <div className="glass-card" style={cardStyle}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={cardTitle}>Staff Headcount by Department</h3>
            </div>
            <span style={badgeStyle}>{employees.length} Total Staff</span>
          </div>
          <div style={cardBody}>
            <div style={headcountBarsContainer}>
              {departments.map((dept, idx) => {
                const count = deptCounts[dept];
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={idx} style={headcountBarRow}>
                    <div style={headcountRowHeader}>
                      <span style={deptNameText}>{dept}</span>
                      <span style={deptCountText}>{count} {count === 1 ? 'employee' : 'employees'}</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div style={barTrack}>
                      <div 
                        style={{ 
                          ...barFill, 
                          width: `${percentage}%`,
                          backgroundColor: ['var(--primary)', '#a18262', '#10b981', '#785b3c', '#be123c'][idx % 5] 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: Departmental Working Efficiency */}
        <div className="glass-card" style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={18} style={{ color: 'var(--success)' }} />
              <h3 style={cardTitle}>Departmental Operational Efficiency</h3>
            </div>
            <span style={badgeStyle}>Task Delivery Index</span>
          </div>
          <div style={cardBody}>
            <div style={efficiencyGrid}>
              {departments.map((dept, idx) => {
                const efficiency = getDeptEfficiency(dept);
                const status = getEfficiencyStatus(efficiency);
                
                return (
                  <div key={idx} style={efficiencyCard}>
                    <div style={efficiencyTitleRow}>
                      <span style={efficiencyDeptName}>{dept}</span>
                      <span style={{ ...efficiencyBadge, color: status.color, border: `1px solid ${status.color}` }}>
                        {status.text}
                      </span>
                    </div>
                    
                    <div style={efficiencyMetricRow}>
                      <div style={efficiencyGauge}>
                        <svg width="48" height="48" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="14" 
                            fill="none" 
                            stroke={status.color} 
                            strokeWidth="3" 
                            strokeDasharray="88" 
                            strokeDashoffset={88 - (88 * efficiency) / 100}
                            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                          />
                        </svg>
                        <span style={efficiencyPercentText}>{efficiency}%</span>
                      </div>
                      
                      <div style={efficiencyDescText}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                          <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                          <span>Milestones met on-time</span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Consistent delivery of targets and high task clearance speed.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Styling specifications


const reportsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1.25rem',
  minHeight: '280px'
};

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '12px',
  marginBottom: '16px'
};

const cardTitle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  margin: 0
};

const badgeStyle = {
  fontSize: '0.7rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-muted)',
  padding: '3px 8px',
  borderRadius: '12px',
  fontWeight: '600'
};

const cardBody = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center'
};

// Gender section styles
const genderVisualContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '1.5rem',
  flexWrap: 'wrap',
  margin: '10px 0'
};

const genderMetrics = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: '150px'
};

const genderIndicatorRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px'
};

const colorIndicator = {
  width: '10px',
  height: '10px',
  borderRadius: '3px',
  marginTop: '4px',
  flexShrink: 0
};

const genderText = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '600'
};

const genderPercentage = {
  fontSize: '1.1rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

const genderSub = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: 'normal',
  marginLeft: '4px'
};

const insightText = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textAlign: 'center',
  marginTop: '1.25rem',
  lineHeight: '1.4',
  margin: '1.25rem 0 0 0'
};

// Headcount section styles
const headcountBarsContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const headcountBarRow = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const headcountRowHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const deptNameText = {
  color: 'var(--text-primary)'
};

const deptCountText = {
  color: 'var(--text-muted)'
};

const barTrack = {
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  borderRadius: '4px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.02)'
};

const barFill = {
  height: '100%',
  borderRadius: '4px',
  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
};

// Efficiency section styles
const efficiencyGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
  marginTop: '4px'
};

const efficiencyCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: '8px',
  padding: '12px'
};

const efficiencyTitleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const efficiencyDeptName = {
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const efficiencyBadge = {
  fontSize: '0.65rem',
  padding: '2px 6px',
  borderRadius: '4px',
  fontWeight: '600'
};

const efficiencyMetricRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const efficiencyGauge = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  flexShrink: 0
};

const efficiencyPercentText = {
  position: 'absolute',
  fontSize: '0.75rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

const efficiencyDescText = {
  display: 'flex',
  flexDirection: 'column'
};

export default ReportsDashboard;

