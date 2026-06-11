import React, { createContext, useState, useEffect } from 'react';
import { api, setTokens, clearTokens, getAccessToken } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Theme Selection ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('staffbase_theme');
    return saved ? saved : 'dark';
  });

  // --- Global States ---
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'StaffBase Inc.',
    sessionTimeoutMinutes: 30,
    enableMfa: false
  });
  
  // --- Auth Session ---
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState('Employee');
  
  // --- Notifications & Toast States ---
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('staffbase_theme', theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    addToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // --- Toast Notification Helpers ---
  const addToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Initial Data Load (Triggered on login/startup) ---
  const loadBackendData = async () => {
    try {
      const empData = await api.get('/employees');
      if (empData.success) {
        setEmployees(empData.data.employees);
      }
    } catch (err) {
      console.error('Failed to load employees:', err.message);
    }

    try {
      const notifyData = await api.get('/notifications');
      if (notifyData.success) {
        setNotifications([
          ...notifyData.data.savedNotifications,
          ...notifyData.data.expiryAlerts
        ]);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
    }

    if (activeRole === 'Admin' || activeRole === 'HR') {
      try {
        const reqData = await api.get('/hr/requests');
        if (reqData.success) {
          setRegistrationRequests(reqData.data);
        }
      } catch (err) {
        console.error('Failed to load HR requests:', err.message);
      }

      try {
        const histData = await api.get('/hr/requests/all');
        if (histData.success) {
          setRequestHistory(histData.data);
        }
      } catch (err) {
        console.error('Failed to load HR request history:', err.message);
      }
    }

    if (activeRole === 'Admin') {
      try {
        const logsData = await api.get('/audit-logs');
        if (logsData.success) {
          const mappedLogs = logsData.data.map(log => ({
            id: log.id,
            operator: log.email,
            action: log.status === 'SUCCESS' ? 'Login Success' : 'Login Failure',
            timestamp: log.timestamp,
            detail: `IP: ${log.ipAddress}${log.failureReason ? ` - ${log.failureReason}` : ''}`
          }));
          setActivityLogs(mappedLogs);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err.message);
      }

      try {
        const settingsData = await api.get('/admin/settings');
        if (settingsData.success) {
          setSystemSettings(settingsData.data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err.message);
      }

      try {
        const deptsData = await api.get('/admin/departments');
        if (deptsData.success) {
          setDepartments(deptsData.data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err.message);
      }
    }
  };

  // Auto-validate session on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          // Attempt to load current user details (e.g. employees count)
          const testRes = await api.get('/employees');
          if (testRes.success) {
            // Restore session user coordinates from stored config
            const savedUser = localStorage.getItem('staffbase_session_user');
            if (savedUser) {
              const parsed = JSON.parse(savedUser);
              setCurrentUser(parsed.profile);
              setActiveRole(parsed.role);
            }
          }
        } catch (err) {
          clearTokens();
          localStorage.removeItem('staffbase_session_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fetch directories when active role/user changes
  useEffect(() => {
    if (currentUser) {
      loadBackendData();
    }
  }, [currentUser, activeRole]);

  // --- Auth Handlers ---
  const loginUser = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        setTokens(accessToken, refreshToken);
        localStorage.setItem('staffbase_session_user', JSON.stringify(user));
        
        setCurrentUser(user.profile);
        setActiveRole(user.role);
        addToast(`Logged in successfully as ${user.profile ? user.profile.name : 'Administrator'}!`, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Invalid email or password credentials', 'danger');
    }
    return false;
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await api.post('/auth/google', { idToken: googleToken });
      if (res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        setTokens(accessToken, refreshToken);
        localStorage.setItem('staffbase_session_user', JSON.stringify(user));
        
        setCurrentUser(user.profile);
        setActiveRole(user.role);
        addToast(`Logged in successfully with Google as ${user.profile ? user.profile.name : 'Administrator'}!`, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Google authentication failed', 'danger');
    }
    return false;
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignored: cleanup locally anyway
    }
    clearTokens();
    localStorage.removeItem('staffbase_session_user');
    setCurrentUser(null);
    setActiveRole('Employee');
    setEmployees([]);
    setNotifications([]);
    setRegistrationRequests([]);
    setActivityLogs([]);
    addToast('Logged out successfully.', 'info');
  };

  // --- CRUD API Handlers ---
  const addEmployee = async (employeeData) => {
    try {
      const res = await api.post('/employees', employeeData);
      if (res.success) {
        setEmployees(prev => [...prev, res.data]);
        addToast(`Employee ${res.data.name} added successfully!`, 'success');
        loadBackendData(); // Sync logs
        return res.data;
      }
    } catch (err) {
      addToast(err.message || 'Failed to add new employee profile', 'danger');
    }
    return null;
  };

  const updateEmployee = async (id, updatedFields) => {
    try {
      const res = await api.put(`/employees/${id}`, updatedFields);
      if (res.success) {
        setEmployees(prev => prev.map(emp => emp.id === id ? res.data : emp));
        if (currentUser && currentUser.id === id) {
          setCurrentUser(res.data);
          // Sync saved session info
          const savedUser = JSON.parse(localStorage.getItem('staffbase_session_user') || '{}');
          savedUser.profile = res.data;
          localStorage.setItem('staffbase_session_user', JSON.stringify(savedUser));
        }
        addToast('Profile updated successfully.', 'success');
        loadBackendData();
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to update employee details', 'danger');
    }
    return false;
  };

  const updateEmployeeSkills = (id, newSkills) => {
    return updateEmployee(id, { skills: newSkills });
  };

  const updateEmployeeBanking = (id, bankingData) => {
    return updateEmployee(id, { bankingInfo: bankingData });
  };

  const updateEmployeeEmergency = (id, contacts) => {
    return updateEmployee(id, { emergencyContacts: contacts });
  };

  const uploadEmployeeDocument = async (id, docName, fileType, expiryDate = 'N/A', file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('name', docName);
      formData.append('expiryDate', expiryDate);
      formData.append('employeeId', id);

      const res = await api.post('/documents/upload', formData);
      if (res.success) {
        addToast(`Document "${docName}" uploaded, pending review.`, 'success');
        loadBackendData();
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload document file', 'danger');
    }
    return false;
  };

  const verifyEmployeeDocument = async (empId, docId, approve = true) => {
    try {
      const res = await api.put(`/documents/${docId}/verify`, { approve });
      if (res.success) {
        addToast(approve ? 'Document approved and verified.' : 'Document rejected.', approve ? 'success' : 'warning');
        loadBackendData();
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to resolve document verification', 'danger');
    }
    return false;
  };

  const submitRegistrationRequest = async (reqData) => {
    try {
      const res = await api.post('/auth/register', reqData);
      if (res.success) {
        addToast(`Profile request for ${reqData.name} sent to HR!`, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit registration request', 'danger');
    }
    return false;
  };

  const approveRegistrationRequest = async (requestId) => {
    try {
      const res = await api.post(`/hr/requests/${requestId}/approve`);
      if (res.success) {
        setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
        setEmployees(prev => [...prev, res.data]);
        addToast(`Approved and provisioned credentials successfully.`, 'success');
        loadBackendData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to approve registration request', 'danger');
    }
  };

  const rejectRegistrationRequest = async (requestId) => {
    try {
      const res = await api.post(`/hr/requests/${requestId}/reject`);
      if (res.success) {
        setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
        addToast(`Profile request rejected.`, 'warning');
        loadBackendData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to reject registration request', 'danger');
    }
  };

  const confirmEmployeeProbation = async (id) => {
    try {
      const res = await api.put(`/hr/employees/${id}/probation`);
      if (res.success) {
        setEmployees(prev => prev.map(e => e.id === id ? res.data : e));
        addToast(`Onboarding completed & status set to Active!`, 'success');
        loadBackendData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to confirm employee probation', 'danger');
    }
  };

  const addDepartment = async (deptName, deptCode, manager) => {
    try {
      const res = await api.post('/admin/departments', { name: deptName, code: deptCode, manager });
      if (res.success) {
        setDepartments(prev => [...prev, res.data]);
        addToast(`Department "${deptName}" created.`, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to create department', 'danger');
    }
    return false;
  };

  const deleteDepartment = async (id) => {
    try {
      const res = await api.delete(`/admin/departments/${id}`);
      if (res.success) {
        setDepartments(prev => prev.filter(d => d.id !== id));
        addToast('Department deleted.', 'warning');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete department', 'danger');
    }
    return false;
  };

  const updateSettings = async (settings) => {
    try {
      const res = await api.post('/admin/settings', settings);
      if (res.success) {
        setSystemSettings(res.data);
        addToast('System settings saved.', 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'danger');
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        employees,
        departments,
        designations,
        activityLogs,
        systemSettings,
        currentUser,
        activeRole,
        notifications,
        toasts,
        loading,
        setCurrentUser,
        setActiveRole,
        setSystemSettings,
        addToast,
        removeToast,
        loginUser,
        loginWithGoogle,
        logoutUser,
        addEmployee,
        updateEmployee,
        updateEmployeeSkills,
        updateEmployeeBanking,
        updateEmployeeEmergency,
        uploadEmployeeDocument,
        verifyEmployeeDocument,
        addDepartment,
        deleteDepartment,
        updateSettings,
        registrationRequests,
        requestHistory,
        submitRegistrationRequest,
        approveRegistrationRequest,
        rejectRegistrationRequest,
        confirmEmployeeProbation
      }}
    >
      {loading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem' }} className="animate-pulse">Loading StaffBase Security Portal...</div>
        </div>
      ) : children}
    </AppContext.Provider>
  );
};

