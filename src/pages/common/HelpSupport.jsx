import React from 'react';
import { HelpCircle, BookOpen, Compass, Mail } from 'lucide-react';

const HelpSupport = () => {
  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Help & Support Center</h1>
        <p style={subtitleStyle}>Read documentation, search guides, and contact HR operations support teams.</p>
      </div>

      {/* Grid splits */}
      <div style={gridStyle}>
        
        {/* Support manual */}
        <div className="glass-card" style={panelCard}>
          <div style={panelHeader}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={panelTitle}>Directory User Manual</h3>
            </div>
          </div>
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <p>
              Welcome to the StaffBase HR Workspaces console. Here are quick tips to navigate the interface:
            </p>
            <div>
              <strong>1. Switching Profiles</strong>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Click your profile avatar in the top-right navbar corner. A dropdown reveals shortcut switches to pre-authenticate as Sarah, Michael, or John DOE.
              </p>
            </div>
            <div>
              <strong>2. Simulating Clearances</strong>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Use the glowing "Demo Control" select box in the Navbar to switch permission states between Admin, HR, and Employee.
              </p>
            </div>
            <div>
              <strong>3. File vaults Uploads</strong>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Navigate to "My Documents". Select a document category, name it, and submit to check pending lists.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="glass-card" style={panelCard}>
          <div style={panelHeader}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Mail size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={panelTitle}>Corporate HR Support</h3>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Need custom modifications, profile corrections, or payroll clearance adjustments? Contact our operations team.
            </p>
            <div style={supportContactCard} className="glass-card">
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>HR Helpline</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                ✉️ hr-alerts@staffbase.com • 📞 Ext 409
              </span>
            </div>
            <div style={supportContactCard} className="glass-card">
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>IT Directory Services</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                ✉️ support-it@staffbase.com • 📞 Ext 101
              </span>
            </div>
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const panelCard = {
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
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

const supportContactCard = {
  padding: '12px',
  border: '1px solid var(--border-color)',
  textAlign: 'left'
};

export default HelpSupport;
