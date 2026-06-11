import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';
import { HelpCircle, BookOpen, Mail, Plus, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';

const HelpSupport = () => {
  const { addToast, activeRole } = useContext(AppContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('IT Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/tickets');
      if (res.success) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast('Please provide a subject and message.', 'warning');
      return;
    }

    try {
      const res = await api.post('/support/tickets', { category, subject, message });
      if (res.success) {
        addToast('Support ticket submitted successfully.', 'success');
        setSubject('');
        setMessage('');
        fetchTickets(); // reload
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit ticket', 'danger');
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const res = await api.put(`/support/tickets/${ticketId}/close`, {});
      if (res.success) {
        addToast('Ticket closed successfully.', 'success');
        fetchTickets();
      }
    } catch (err) {
      addToast(err.message || 'Failed to close ticket', 'danger');
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 style={titleStyle}>Help & Support Desk</h1>
        <p style={subtitleStyle}>Submit request tickets, review corporate documentation, or contact operations administrators.</p>
      </div>

      {/* Grid splits */}
      <div style={gridStyle}>
        
        {/* Left: Create Ticket Form */}
        <div className="glass-card" style={panelCard}>
          <div style={panelHeader}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={panelTitle}>Create Support Ticket</h3>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="IT Support">IT Support</option>
                  <option value="HR Operations">HR Operations</option>
                  <option value="Finance / Payroll">Finance / Payroll</option>
                  <option value="General">General Inquiries</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Summary of your issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Message</label>
                <textarea 
                  className="form-textarea" 
                  rows={4}
                  placeholder="Provide details about the issue or request coordinates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Tickets List & Manual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tickets Vault */}
          <div className="glass-card" style={panelCard}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MessageSquare size={18} style={{ color: 'var(--secondary)' }} />
                <h3 style={panelTitle}>{activeRole === 'Admin' || activeRole === 'HR' ? 'All Active Support Tickets' : 'Your Support Tickets'}</h3>
              </div>
              <span className="badge badge-info">{tickets.length} Total</span>
            </div>
            <div style={{ padding: '1.25rem', maxHeight: '350px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  <MessageSquare size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p>No active support tickets found.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tickets.map((t) => (
                    <div key={t.id} style={ticketCard} className="glass-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{t.category}</span>
                          <h4 style={ticketSubject}>{t.subject}</h4>
                          <p style={ticketMsg}>{t.message}</p>
                          <span style={ticketMeta}>
                            By {t.employeeName} • {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <span className={`badge badge-${t.status === 'Open' ? 'warning' : 'success'}`} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {t.status === 'Open' ? <Clock size={10} /> : <CheckCircle size={10} />}
                            {t.status}
                          </span>
                          {t.status === 'Open' && (
                            <button 
                              onClick={() => handleCloseTicket(t.id)}
                              className="btn btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Manual */}
          <div className="glass-card" style={panelCard}>
            <div style={panelHeader}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={panelTitle}>Directory User Manual</h3>
              </div>
            </div>
            <div style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p>1. <strong>System Settings</strong>: Administrators can adjust session timeouts and company branding under Admin console.</p>
              <p>2. <strong>Verification</strong>: HR reviews all pending files and approves them directly to active status.</p>
              <p>3. <strong>Direct Role Mapping</strong>: Role classifications are automated. Suffix `@admin.com` maps to Administrator clearance.</p>
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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

const ticketCard = {
  padding: '12px',
  border: '1px solid var(--border-color)',
  textAlign: 'left'
};

const ticketSubject = {
  fontSize: '0.85rem',
  fontWeight: '700',
  margin: '6px 0 2px 0',
  color: 'var(--text-primary)'
};

const ticketMsg = {
  fontSize: '0.78rem',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  lineHeight: '1.3'
};

const ticketMeta = {
  fontSize: '0.68rem',
  color: 'var(--text-muted)'
};

export default HelpSupport;
