import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Clock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';

const AuditLogs = () => {
  const { activityLogs } = useContext(AppContext);

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Enterprise Audit Logs"
        subtitle="Inspect corporate operations events, directory metadata writes, and security credentials updates."
      />

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

export default AuditLogs;
