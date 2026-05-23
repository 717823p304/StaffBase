import React, { createContext, useState, useEffect } from 'react';
import {
  MOCK_EMPLOYEES,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DESIGNATIONS,
  MOCK_ACTIVITY_LOGS,
  SYSTEM_SETTINGS
} from '../services/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Load Theme selection ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('staffbase_theme');
    return saved ? saved : 'dark'; // Defaults to dark mode
  });

  // --- Load Initial State from LocalStorage or Defaults ---
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('staffbase_employees');
    return saved ? JSON.parse(saved) : MOCK_EMPLOYEES;
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('staffbase_departments');
    return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENTS;
  });

  const [designations, setDesignations] = useState(() => {
    const saved = localStorage.getItem('staffbase_designations');
    return saved ? JSON.parse(saved) : DEFAULT_DESIGNATIONS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('staffbase_activity_logs');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITY_LOGS;
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('staffbase_system_settings');
    return saved ? JSON.parse(saved) : SYSTEM_SETTINGS;
  });

  // --- Auth Session ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('staffbase_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem('staffbase_active_role');
    return saved ? saved : 'Employee';
  });

  // --- Notifications Alerts ---
  const [notifications, setNotifications] = useState([]);

  // --- Toast Notifications State ---
  const [toasts, setToasts] = useState([]);

  // --- Pending Employee Registration Requests ---
  const [registrationRequests, setRegistrationRequests] = useState(() => {
    const saved = localStorage.getItem('staffbase_registration_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'req-demo-1',
        name: 'Sarah Connor',
        email: 'sarah.connor@cyberdyne.com',
        department: 'Engineering',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        status: 'Pending'
      },
      {
        id: 'req-demo-2',
        name: 'Marcus Wright',
        email: 'marcus.wright@projectangel.org',
        department: 'Product & Design',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        status: 'Pending'
      }
    ];
  });

  // Sync to LocalStorage & setup theme body selector
  useEffect(() => {
    localStorage.setItem('staffbase_theme', theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    addToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  useEffect(() => {
    localStorage.setItem('staffbase_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('staffbase_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('staffbase_designations', JSON.stringify(designations));
  }, [designations]);

  useEffect(() => {
    localStorage.setItem('staffbase_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('staffbase_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('staffbase_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('staffbase_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('staffbase_registration_requests', JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  // --- Generate Alerts / Expiry Notifications automatically ---
  useEffect(() => {
    const alerts = [];
    employees.forEach(emp => {
      if (emp.documents) {
        emp.documents.forEach(doc => {
          if (doc.expiryDate && doc.expiryDate !== 'N/A') {
            const expDate = new Date(doc.expiryDate);
            const today = new Date('2026-05-20');
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
              alerts.push({
                id: `alert-exp-${doc.id}`,
                type: 'danger',
                title: 'Document Expired',
                message: `${doc.name} of ${emp.name} expired on ${doc.expiryDate}!`,
                time: 'Just now'
              });
            } else if (diffDays <= 45) {
              alerts.push({
                id: `alert-exp-${doc.id}`,
                type: 'warning',
                title: 'Document Expiring Soon',
                message: `${doc.name} of ${emp.name} expires in ${diffDays} days (${doc.expiryDate}).`,
                time: 'Urgent'
              });
            }
          }
          
          if (doc.status === 'Pending') {
            alerts.push({
              id: `alert-pend-${doc.id}`,
              type: 'info',
              title: 'Verification Needed',
              message: `${emp.name} uploaded ${doc.name} which requires HR verification review.`,
              time: 'Pending Review'
            });
          }
        });
      }
    });

    setNotifications(alerts);
  }, [employees]);

  // --- Toast Helpers ---
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

  // --- Dynamic Auditor Logger ---
  const logActivity = (action, detail) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      operator: currentUser ? currentUser.name : 'System',
      action,
      detail
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // --- CRUD API Methods ---
  const loginUser = (email, password) => {
    const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setActiveRole(found.role);
      addToast(`Logged in successfully as ${found.name}!`, 'success');
      return found;
    } else {
      addToast('Invalid credentials. Try using one of the quick profiles.', 'danger');
      return null;
    }
  };

  const logoutUser = () => {
    addToast('Logged out successfully.', 'info');
    setCurrentUser(null);
    setActiveRole('Employee');
  };

  const addEmployee = (employeeData) => {
    const newId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newEmployee = {
      id: newId,
      profilePic: null,
      bgColor: ['#e0a927', '#a18262', '#10b981', '#be123c', '#64748b', '#785b3c'][Math.floor(Math.random() * 6)],
      status: 'Active',
      skills: [],
      emergencyContacts: [],
      bankingInfo: { bankName: '', accountName: '', accountNumber: '', ifscCode: '', salary: 50000 },
      timeline: [{ date: new Date().toISOString().split('T')[0], title: 'Onboarded', desc: 'Employee profile created.' }],
      documents: [],
      ...employeeData
    };

    setEmployees(prev => [...prev, newEmployee]);
    logActivity('Add Employee', `Created profile for ${newEmployee.name} (${newEmployee.id}) under ${newEmployee.department}.`);
    addToast(`Employee ${newEmployee.name} added successfully!`, 'success');
    return newEmployee;
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updatedFields } : emp))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
    logActivity('Edit Employee', `Updated details for employee ID ${id}.`);
    addToast('Profile updated successfully.', 'success');
  };

  const updateEmployeeSkills = (id, newSkills) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, skills: newSkills } : emp))
    );
    logActivity('Skills Managed', `Skills list updated for employee ID ${id}.`);
    addToast('Skills & qualifications updated.', 'success');
  };

  const updateEmployeeBanking = (id, bankingData) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, bankingInfo: { ...emp.bankingInfo, ...bankingData } } : emp))
    );
    logActivity('Payroll Managed', `Banking payroll coordinates updated for employee ID ${id}.`);
    addToast('Financial payroll profile updated.', 'success');
  };

  const updateEmployeeEmergency = (id, contacts) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, emergencyContacts: contacts } : emp))
    );
    logActivity('Contacts Managed', `Emergency contacts updated for employee ID ${id}.`);
    addToast('Emergency contacts updated.', 'success');
  };

  const uploadEmployeeDocument = (id, docName, fileType, expiryDate = 'N/A') => {
    const newDoc = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      name: docName,
      type: fileType,
      status: 'Pending',
      dateUploaded: new Date().toISOString().split('T')[0],
      expiryDate
    };

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === id) {
          return { ...emp, documents: [...(emp.documents || []), newDoc] };
        }
        return emp;
      })
    );
    logActivity('Document Uploaded', `Uploaded document "${docName}" for employee ID ${id}.`);
    addToast(`Document "${docName}" uploaded, pending review.`, 'success');
  };

  const verifyEmployeeDocument = (empId, docId, approve = true) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === empId) {
          return {
            ...emp,
            documents: emp.documents.map(d =>
              d.id === docId ? { ...d, status: approve ? 'Verified' : 'Rejected' } : d
            )
          };
        }
        return emp;
      })
    );
    logActivity('Document Verified', `Document ID ${docId} verification review set to ${approve ? 'Approved' : 'Rejected'}.`);
    addToast(approve ? 'Document approved and verified.' : 'Document rejected.', approve ? 'success' : 'warning');
  };

  const addDepartment = (deptName, deptCode, manager) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      name: deptName,
      code: deptCode,
      manager
    };
    setDepartments(prev => [...prev, newDept]);
    logActivity('Settings Modified', `Added department ${deptName} (${deptCode}).`);
    addToast(`Department "${deptName}" created.`, 'success');
  };

  const deleteDepartment = (id) => {
    const target = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    logActivity('Settings Modified', `Deleted department ${target?.name}.`);
    addToast('Department deleted.', 'warning');
  };

  const submitRegistrationRequest = (reqData) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      ...reqData
    };
    setRegistrationRequests(prev => [newRequest, ...prev]);
    logActivity('Registration Request', `Profile request submitted by ${newRequest.name} for ${newRequest.department}.`);
    addToast(`Profile request for ${newRequest.name} sent to HR!`, 'success');
  };

  const approveRegistrationRequest = (requestId) => {
    const req = registrationRequests.find(r => r.id === requestId);
    if (!req) return;

    // Convert request to an active employee profile
    const newEmp = addEmployee({
      name: req.name,
      email: req.email,
      department: req.department,
      designation: 'Associate Specialist',
      dateOfJoining: new Date().toISOString().split('T')[0],
      role: 'Employee'
    });

    setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
    logActivity('Approve Request', `Approved and provisioned credentials for ${req.name} (${newEmp.id}).`);
  };

  const rejectRegistrationRequest = (requestId) => {
    const req = registrationRequests.find(r => r.id === requestId);
    if (!req) return;

    setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
    logActivity('Reject Request', `Rejected corporate profile request from ${req.name} (${req.email}).`);
    addToast(`Profile request for ${req.name} rejected.`, 'warning');
  };

  const confirmEmployeeProbation = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    setEmployees(prev =>
      prev.map(e => e.id === id ? { ...e, status: 'Active' } : e)
    );
    logActivity('Confirm Probation', `Completed onboarding & confirmed probation for ${emp.name} (${emp.id}).`);
    addToast(`${emp.name} onboarding completed & status set to Active!`, 'success');
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
        setCurrentUser,
        setActiveRole,
        setSystemSettings,
        addToast,
        removeToast,
        logActivity,
        loginUser,
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
        registrationRequests,
        submitRegistrationRequest,
        approveRegistrationRequest,
        rejectRegistrationRequest,
        confirmEmployeeProbation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
