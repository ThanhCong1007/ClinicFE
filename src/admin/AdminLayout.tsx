import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import Dashboard from './src/pages/Dashboard';
import Tables from './src/pages/Tables';
import Billing from './src/pages/Billing';
import Profile from './src/pages/Profile';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import VirtualReality from './src/pages/VirtualReality';
import RTL from './src/pages/RTL';
import ErrorBoundary from '../user/components/ErrorBoundary';
import NotificationProvider from './components/NotificationProvider';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex-grow-1 ${darkMode ? 'admin-dark-mode' : ''}`}>
      <ErrorBoundary>
        <AdminSidebar collapsed={sidebarCollapsed} />
        <div className={`admin-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <AdminNavbar 
            onToggleSidebar={toggleSidebar} 
            onToggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
          />
          <div className="container-fluid p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/virtual-reality" element={<VirtualReality />} />
              <Route path="/rtl" element={<RTL />} />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
} 