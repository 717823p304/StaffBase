import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Search, ChevronDown, Sparkles, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const {
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    notifications,
    employees,
    addToast,
    theme,
    toggleTheme,
    loginUser
  } = useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Profile quick-toggle handler
  const handleUserSwitch = async (empId) => {
    const selected = employees.find(e => e.id === empId);
    if (selected) {
      addToast(`Authenticating profile context for ${selected.name}...`, 'info');
      const success = await loginUser(selected.email, 'password123');
      if (success) {
        setShowProfileSelector(false);
      } else {
        addToast(`Failed to switch profile to ${selected.name}`, 'danger');
      }
    }
  };

  // Direct active-role toggle handler
  const handleRoleToggle = async (e) => {
    const newRole = e.target.value;
    let email = 'john@employee.com';
    if (newRole === 'Admin') {
      email = 'sarah@admin.com';
    } else if (newRole === 'HR') {
      email = 'michael@hr.com';
    }
    
    addToast(`Authenticating context for ${newRole} Mode...`, 'info');
    const success = await loginUser(email, 'password123');
    if (!success) {
      addToast(`Failed to switch to ${newRole} Mode`, 'danger');
    }
  };

  return (
    <header className="navbar">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="navbar-search-form">
        <div className="navbar-search-container">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search employees, documents, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Header Actions */}
      <div className="navbar-actions">
        
        {/* Dynamic Sandbox Role Switcher */}
        <div className="demo-switcher">
          <Sparkles size={14} style={{ color: 'var(--secondary)' }} />
          <span className="demo-switcher-label">Demo Control:</span>
          <select
            value={activeRole}
            onChange={handleRoleToggle}
            className="demo-switcher-select"
          >
            <option value="Admin">Admin Mode</option>
            <option value="HR">HR Mode</option>
            <option value="Employee">Employee Mode</option>
          </select>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="navbar-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon Tray */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileSelector(false);
            }}
            className="navbar-icon-btn"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="navbar-notification-badge">{notifications.length}</span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="navbar-dropdown glass-card animate-fade-in">
              <div className="navbar-dropdown-header">
                <h3>Notifications & Warnings</h3>
                <span className="badge badge-warning">{notifications.length} Alerts</span>
              </div>
              <div className="navbar-dropdown-body">
                {notifications.length === 0 ? (
                  <p style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    All systems normal. No action items.
                  </p>
                ) : (
                  <div className="navbar-dropdown-list">
                    {notifications.map((alert) => (
                      <div key={alert.id} style={{ padding: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: alert.type === 'danger' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--info)',
                            marginTop: '6px'
                          }}></span>
                          <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{alert.title}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Flyout Switcher */}
        <div style={{ position: 'relative' }}>
          {currentUser && (
            <div
              onClick={() => {
                setShowProfileSelector(!showProfileSelector);
                setShowNotifications(false);
              }}
              className="navbar-profile-trigger"
            >
              <div 
                className="navbar-avatar"
                style={{ backgroundColor: currentUser.bgColor || 'var(--primary)' }}
              >
                {currentUser.profilePic ? (
                  <img src={currentUser.profilePic} alt={currentUser.name} className="navbar-avatar-img" />
                ) : (
                  currentUser.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{currentUser.name}</span>
                <span className="navbar-user-role">{currentUser.designation}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          {/* Profile Switcher Dropdown */}
          {showProfileSelector && (
            <div className="navbar-dropdown glass-card animate-fade-in" style={{ right: 0, width: '260px' }}>
              <div className="navbar-dropdown-header">
                <h3>Switch Demo Profile</h3>
              </div>
              <div className="navbar-dropdown-body">
                <p style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Simulate employee logins:
                </p>
                <div className="navbar-dropdown-list">
                  {employees.slice(0, 3).map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleUserSwitch(emp.id)}
                      className="navbar-dropdown-btn"
                    >
                      <div 
                        className="navbar-avatar"
                        style={{ backgroundColor: emp.bgColor, minWidth: '30px', height: '30px', fontSize: '0.75rem' }}
                      >
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{emp.role} • {emp.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
