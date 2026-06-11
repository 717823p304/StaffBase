import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { Network, ArrowRight, GitFork } from 'lucide-react';

const OrgChart = () => {
  const { employees, addToast } = useContext(AppContext);
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgChart = async () => {
      try {
        const res = await api.get('/org-chart/hierarchy');
        if (res.success) {
          setHierarchy(res.data);
        }
      } catch (err) {
        console.error('Failed to load org chart hierarchy', err);
        addToast('Failed to load organization hierarchy.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchOrgChart();
  }, []);

  // Grouping logic:
  // Root level: employees that have subordinates but do not have a manager listed in hierarchy
  const employeeIdsWithManager = new Set(hierarchy.map(h => h.employeeId));
  const level1 = employees.filter(e => !employeeIdsWithManager.has(e.id));
  const rootEmployees = level1.length > 0 ? level1 : employees.filter(e => e.id === 'EMP-101');
  const rootIds = new Set(rootEmployees.map(r => r.id));

  // Level 2: managed by a root employee
  const level2Relations = hierarchy.filter(h => rootIds.has(h.managerId));
  const level2Ids = new Set(level2Relations.map(h => h.employeeId));
  const level2 = employees.filter(e => level2Ids.has(e.id));

  // Level 3: managed by a Level 2 employee
  const level3Relations = hierarchy.filter(h => level2Ids.has(h.managerId));
  const level3Ids = new Set(level3Relations.map(h => h.employeeId));
  const level3 = employees.filter(e => level3Ids.has(e.id));

  const renderNode = (emp) => {
    if (!emp) return null;
    return (
      <a href={`#/profile/${emp.id}`} key={emp.id} style={nodeLinkWrapper}>
        <div style={nodeCardStyle} className="glass-card">
          <div style={{
            ...nodeAvatarStyle,
            backgroundColor: emp.bgColor || 'var(--primary)'
          }}>
            {emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={nodeName}>{emp.name}</h3>
            <span style={nodeTitle}>{emp.designation}</span>
            <div style={nodeDeptBadge}>{emp.department}</div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Organization Hierarchy</h1>
          <p style={subtitleStyle}>Visualize team structures, leadership connections, and reporting coordinates.</p>
        </div>
      </div>

      {/* Visual Chart Canvas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading reporting hierarchy...</div>
      ) : (
        <div className="glass-card" style={canvasStyle}>
          
          {/* Level 1: Executive Leader */}
          <div style={tierContainer}>
            <div style={tierLabelStyle}>Executive Directorate</div>
            <div style={nodesRow}>
              {rootEmployees.map(emp => renderNode(emp))}
            </div>
          </div>

          {/* Vertical Connector Line 1 */}
          {level2.length > 0 && <div style={verticalConnectorLine}></div>}

          {/* Level 2: Management & Leads */}
          {level2.length > 0 && (
            <div style={{ ...tierContainer, background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '1.5rem 1rem' }}>
              <div style={tierLabelStyle}>Department Management & Leads</div>
              <div style={nodesRowWrap}>
                {level2.map(emp => (
                  <div key={emp.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {renderNode(emp)}
                    {/* Connector pointing to subordinates */}
                    {hierarchy.some(h => h.managerId === emp.id) && <div style={subConnectorLine}></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Staff Core */}
          {level3.length > 0 && (
            <div style={{ ...tierContainer, marginTop: '1.5rem' }}>
              <div style={tierLabelStyle}>Core Team & Consultants</div>
              <div style={level3RowStyle}>
                {level2.map(mgr => {
                  const subs = level3.filter(emp => hierarchy.some(h => h.employeeId === emp.id && h.managerId === mgr.id));
                  if (subs.length === 0) return null;
                  return (
                    <div key={mgr.id} style={subGroupColumn}>
                      <span style={reportIndicator}>Reporting to {mgr.name}:</span>
                      {subs.map(sub => renderNode(sub))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

// Styling definitions
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

const canvasStyle = {
  padding: '3rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'radial-gradient(circle at center, var(--primary-glow) 0%, rgba(0, 0, 0, 0) 70%)',
  overflowX: 'auto'
};

const tierContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minWidth: '700px'
};

const tierLabelStyle = {
  fontSize: '0.675rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.8px',
  marginBottom: '1rem'
};

const nodesRow = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  gap: '10px'
};

const nodesRowWrap = {
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  flexWrap: 'nowrap',
  gap: '10px'
};

const nodeLinkWrapper = {
  display: 'block',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'scale(1.03)'
  }
};

const nodeCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  width: '210px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-md)',
  borderRadius: '10px'
};

const nodeAvatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '1rem'
};

const nodeName = {
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--text-primary)'
};

const nodeTitle = {
  fontSize: '0.675rem',
  color: 'var(--text-muted)',
  display: 'block',
  marginTop: '1px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '135px'
};

const nodeDeptBadge = {
  fontSize: '0.6rem',
  fontWeight: 'bold',
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  padding: '1px 6px',
  borderRadius: '4px',
  display: 'inline-block',
  marginTop: '4px'
};

// Connections
const verticalConnectorLine = {
  width: '2px',
  height: '24px',
  backgroundColor: 'var(--border-color)',
  margin: '8px 0'
};

const subConnectorLine = {
  width: '2px',
  height: '20px',
  backgroundColor: 'var(--primary)',
  margin: '6px 0 0 0',
  opacity: 0.5
};

const level3RowStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '3rem',
  width: '100%'
};

const subGroupColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px'
};

const reportIndicator = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
  marginBottom: '2px'
};

export default OrgChart;
