import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Toast Notifications Hub */}
      <Toast />
      
      <div className="app-grid">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Content Pane Workspace */}
        <div className="content-pane">
          {/* Header Navbar */}
          <Navbar />

          {/* Inner Views Scrollable Viewport */}
          <main className="main-viewport">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
