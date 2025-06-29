import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-tv',
      label: 'Dashboard',
      color: 'text-primary'
    },
    {
      path: '/admin/tables',
      icon: 'fas fa-table',
      label: 'Tables',
      color: 'text-warning'
    },
    {
      path: '/admin/billing',
      icon: 'fas fa-credit-card',
      label: 'Billing',
      color: 'text-success'
    },
    {
      path: '/admin/virtual-reality',
      icon: 'fas fa-cube',
      label: 'Virtual Reality',
      color: 'text-info'
    },
    {
      path: '/admin/rtl',
      icon: 'fas fa-globe',
      label: 'RTL',
      color: 'text-danger'
    }
  ];

  const accountItems = [
    {
      path: '/admin/profile',
      icon: 'fas fa-user',
      label: 'Profile',
      color: 'text-secondary'
    },
    {
      path: '/admin/sign-in',
      icon: 'fas fa-sign-in-alt',
      label: 'Sign In',
      color: 'text-warning'
    },
    {
      path: '/admin/sign-up',
      icon: 'fas fa-user-plus',
      label: 'Sign Up',
      color: 'text-info'
    }
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="p-3">
        <div className="d-flex align-items-center mb-4">
          <img 
            src="/image/logo-ct.png" 
            alt="Logo" 
            className="me-2"
            style={{ width: '32px', height: '32px' }}
          />
          {!collapsed && (
            <span className="text-white fw-bold">Admin Dashboard</span>
          )}
        </div>
      </div>

      <hr className="text-white-50" />

      <nav className="px-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-2">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center text-white ${
                  location.pathname === item.path ? 'active bg-white bg-opacity-25' : ''
                }`}
                style={{ borderRadius: '10px', padding: '12px' }}
              >
                <i className={`${item.icon} ${item.color} me-3`}></i>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {!collapsed && (
          <div className="mt-4">
            <h6 className="text-white-50 text-uppercase small fw-bold mb-3">
              Account pages
            </h6>
          </div>
        )}

        <ul className="nav flex-column">
          {accountItems.map((item) => (
            <li key={item.path} className="nav-item mb-2">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center text-white ${
                  location.pathname === item.path ? 'active bg-white bg-opacity-25' : ''
                }`}
                style={{ borderRadius: '10px', padding: '12px' }}
              >
                <i className={`${item.icon} ${item.color} me-3`}></i>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="mt-auto p-3">
          <div className="text-center">
            <img 
              src="/image/shapes/waves-gray.svg" 
              alt="Help" 
              className="mb-3"
              style={{ width: '50%' }}
            />
            <h6 className="text-white mb-1">Need help?</h6>
            <p className="text-white-50 small mb-3">Please check our docs</p>
            <a 
              href="https://www.creative-tim.com/learning-lab/tailwind/html/quick-start/argon-dashboard/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-light w-100 mb-2"
            >
              Documentation
            </a>
            <a 
              href="https://www.creative-tim.com/product/argon-dashboard-pro-tailwind" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary w-100"
            >
              Upgrade to pro
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar; 