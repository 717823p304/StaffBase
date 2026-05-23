import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  Users,
  GitBranch,
  FolderOpen,
  HelpCircle,
  ShieldAlert,
  Sliders,
  Database,
  BarChart3,
  LogOut,
  UserPlus
} from 'lucide-react';

const Sidebar = () => {
  const { activeRole, logoutUser } = useContext(AppContext);
  const currentHash = window.location.hash || '#/dashboard';

  const isActive = (hash) => {
    return currentHash.startsWith(hash);
  };

  const employeeLinks = [
    { name: 'Dashboard', hash: '#/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Profile', hash: '#/profile', icon: <User size={18} /> },
    { name: 'Directory', hash: '#/employee/directory', icon: <Users size={18} /> },
    { name: 'Org Chart', hash: '#/employee/org-chart', icon: <GitBranch size={18} /> },
    { name: 'My Documents', hash: '#/employee/documents', icon: <FolderOpen size={18} /> },
    { name: 'Help & Support', hash: '#/help', icon: <HelpCircle size={18} /> }
  ];

  const hrLinks = [
    { name: 'HR Dashboard', hash: '#/hr/dashboard', icon: <Sliders size={18} /> },
    { name: 'Add Employee', hash: '#/hr/add-employee', icon: <UserPlus size={18} /> },
    { name: 'Onboarding', hash: '#/hr/onboarding', icon: <Sliders size={18} /> }
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', hash: '#/admin/settings', icon: <Sliders size={18} /> },
    { name: 'Manage Roles', hash: '#/admin/roles', icon: <ShieldAlert size={18} /> },
    { name: 'Reports', hash: '#/reports', icon: <BarChart3 size={18} /> },
    { name: 'Audit Logs', hash: '#/admin/audit-logs', icon: <Database size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-badge">SB</div>
        <div>
          <h1 className="sidebar-logo-title">StaffBase</h1>
          <span className="sidebar-logo-subtitle">HR Management</span>
        </div>
      </div>

      <div className="sidebar-role-container">
        <span className={`badge badge-${activeRole === 'Admin' ? 'danger' : activeRole === 'HR Manager' ? 'warning' : 'info'}`}>
          {activeRole} Console
        </span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Employee Area</div>
        {employeeLinks.map(link => (
          <a
            key={link.hash}
            href={link.hash}
            className={`sidebar-link ${isActive(link.hash) ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}

        {/* HR Manager or Admin links */}
        {(activeRole === 'HR Manager' || activeRole === 'Admin') && (
          <>
            <div className="sidebar-section-label">HR Console</div>
            {hrLinks.map(link => (
              <a
                key={link.hash}
                href={link.hash}
                className={`sidebar-link ${isActive(link.hash) ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </>
        )}

        {/* Admin only links */}
        {activeRole === 'Admin' && (
          <>
            <div className="sidebar-section-label">Admin Console</div>
            {adminLinks.map(link => (
              <a
                key={link.hash}
                href={link.hash}
                className={`sidebar-link ${isActive(link.hash) ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logoutUser} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
