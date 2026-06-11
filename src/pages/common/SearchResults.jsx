import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Eye } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { containerStyle } from '../../styles/shared';

const SearchResults = ({ query = '' }) => {
  const { employees } = useContext(AppContext);

  const matched = employees.filter(emp =>
    emp.name.toLowerCase().includes(query.toLowerCase()) ||
    emp.department.toLowerCase().includes(query.toLowerCase()) ||
    emp.designation.toLowerCase().includes(query.toLowerCase()) ||
    (emp.skills || []).some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={containerStyle} className="animate-fade-in">
      <PageHeader
        title="Search Results"
        subtitle={`Found ${matched.length} profiles matching keyword query "**${query}**"`}
      />

      {/* Renders lists */}
      {matched.length === 0 ? (
        <div className="glass-card" style={emptyCard}>
          <Search size={40} style={{ color: 'var(--text-muted)' }} />
          <h3>No matches found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Expand your query parameters or double check spelling.</p>
        </div>
      ) : (
        <div style={resultsGrid}>
          {matched.map((emp) => (
            <div key={emp.id} className="glass-card" style={cardStyle}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  ...avatarStyle,
                  backgroundColor: emp.bgColor || 'var(--primary)'
                }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={itemName}>{emp.name}</h3>
                  <span style={itemTitle}>{emp.designation} • {emp.department}</span>
                </div>
              </div>
              <a href={`#/profile/${emp.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Eye size={12} />
                <span>View profile</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const emptyCard = {
  padding: '4rem 1.5rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  color: 'var(--text-muted)'
};

const resultsGrid = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const cardStyle = {
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid var(--border-color)'
};

const avatarStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: '800',
  fontSize: '0.9rem'
};

const itemName = {
  fontSize: '0.85rem',
  fontWeight: '700'
};

const itemTitle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)'
};

export default SearchResults;
