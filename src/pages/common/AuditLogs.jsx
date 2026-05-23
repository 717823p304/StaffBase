import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Database, Clock, Calendar } from 'lucide-react';

const AuditLogs = () => {
  const { activityLogs } = useContext(AppContext);

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Enterprise Audit Logs</h1>
        <p style={subtitleStyle}>Inspect corporate operations events, directory metadata writes, and security credentials updates.</p>
      </div>

      {/* Renders table list */}
      <div className="glass-card table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Operator Account</th>
              <th>Action Category</th>
              <th>Detailed Timestamp</th>
              <th>Operation Details</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log) => (
              <tr key={log.id}>
                <td>
                  <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{log.operator}</strong>
                </td>
                <td>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AuditLogs;
