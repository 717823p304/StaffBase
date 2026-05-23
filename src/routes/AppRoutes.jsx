import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Unauthorized from '../pages/auth/Unauthorized';
import SessionExpired from '../pages/auth/SessionExpired';

// Pages
import MainDashboard from '../pages/common/MainDashboard';
import Profile from '../pages/employee/Profile';
import EmployeeDirectory from '../pages/employee/EmployeeDirectory';
import OrgChart from '../pages/employee/OrgChart';
import Documents from '../pages/employee/Documents';
import HelpSupport from '../pages/common/HelpSupport';
import SearchResults from '../pages/common/SearchResults';

// HR Pages
import HRDashboard from '../pages/hr/HRDashboard';
import AddEmployee from '../pages/hr/AddEmployee';
import Onboarding from '../pages/hr/Onboarding';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageRoles from '../pages/admin/ManageRoles';
import AuditLogs from '../pages/common/AuditLogs';

// Reports Pages
import ReportsDashboard from '../pages/reports/ReportsDashboard';

// Landing Page & 404 Page
import LandingHome from '../pages/common/LandingHome';
import NotFound from '../pages/common/NotFound';

const AppRoutes = () => {
  const { currentUser } = useContext(AppContext);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse path and params
  // E.g. #/profile/EMP-103?tab=skills -> path: "/profile/EMP-103", parts: ["profile", "EMP-103"], query: { tab: "skills" }
  const parseHash = () => {
    const hash = currentHash || '#/';
    const pathWithQuery = hash.replace(/^#/, '');
    const [path, queryStr] = pathWithQuery.split('?');
    const parts = path.split('/').filter(Boolean);

    const query = {};
    if (queryStr) {
      const params = new URLSearchParams(queryStr);
      for (const [key, val] of params.entries()) {
        query[key] = val;
      }
    }

    return {
      fullPath: path || '/',
      parts,
      query
    };
  };

  const { fullPath, parts, query } = parseHash();

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Unauthenticated Routes (Landing Home, Login, Reset, etc.)
    if (fullPath === '/' || fullPath === '/home') {
      return <LandingHome />;
    }
    if (fullPath === '/login') {
      return <Login />;
    }
    if (fullPath === '/register') {
      return <Register />;
    }
    if (fullPath === '/forgot-password') {
      return <ForgotPassword />;
    }
    if (fullPath === '/reset-password') {
      return <ResetPassword />;
    }
    if (fullPath === '/unauthorized') {
      return <Unauthorized />;
    }
    if (fullPath === '/session-expired') {
      return <SessionExpired />;
    }

    // 2. Protected Routes (require session / DashboardLayout wrapping)
    return (
      <ProtectedRoute>
        <DashboardLayout>
          {dispatchProtectedView()}
        </DashboardLayout>
      </ProtectedRoute>
    );
  };

  // Internal Protected Dispatcher
  const dispatchProtectedView = () => {
    // Home Dashboard
    if (fullPath === '/dashboard') {
      return <MainDashboard />;
    }

    // Search Results Page
    if (fullPath === '/search') {
      return <SearchResults query={query.q || ''} />;
    }

    // Employee Profiles
    if (parts[0] === 'profile') {
      const empId = parts[1] || null; // If null, represents "My Profile"
      return <Profile id={empId} activeTab={query.tab || 'about'} />;
    }

    // Employee Directory
    if (fullPath === '/employee/directory') {
      return <EmployeeDirectory />;
    }

    // Org Chart
    if (fullPath === '/employee/org-chart') {
      return <OrgChart />;
    }

    // My Documents Vault
    if (fullPath === '/employee/documents') {
      return <Documents />;
    }

    // Help & Support
    if (fullPath === '/help') {
      return <HelpSupport />;
    }

    // --- HR Console Routes ---
    if (fullPath === '/hr/dashboard') {
      return (
        <RoleRoute allowedRoles={['Admin', 'HR Manager']}>
          <HRDashboard />
        </RoleRoute>
      );
    }
    if (fullPath === '/hr/add-employee') {
      return (
        <RoleRoute allowedRoles={['Admin', 'HR Manager']}>
          <AddEmployee />
        </RoleRoute>
      );
    }
    if (fullPath === '/hr/onboarding') {
      return (
        <RoleRoute allowedRoles={['Admin', 'HR Manager']}>
          <Onboarding />
        </RoleRoute>
      );
    }

    // --- Admin Console Routes ---
    if (fullPath === '/admin/settings') {
      return (
        <RoleRoute allowedRoles={['Admin']}>
          <AdminDashboard />
        </RoleRoute>
      );
    }
    if (fullPath === '/admin/roles') {
      return (
        <RoleRoute allowedRoles={['Admin']}>
          <ManageRoles />
        </RoleRoute>
      );
    }
    if (fullPath === '/admin/audit-logs') {
      return (
        <RoleRoute allowedRoles={['Admin']}>
          <AuditLogs />
        </RoleRoute>
      );
    }

    // --- Reports Console Routes ---
    if (fullPath === '/reports') {
      return (
        <RoleRoute allowedRoles={['Admin', 'HR Manager']}>
          <ReportsDashboard />
        </RoleRoute>
      );
    }

    // Default Fallback
    return <NotFound />;
  };

  return renderRoute();
};

export default AppRoutes;
