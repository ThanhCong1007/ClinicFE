import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-tv',
      label: 'Dashboard',
      color: 'text-primary'
    },
    {
      path: '/tables',
      icon: 'fas fa-table',
      label: 'Tables',
      color: 'text-warning'
    },
    {
      path: '/billing',
      icon: 'fas fa-credit-card',
      label: 'Billing',
      color: 'text-success'
    },
    {
      path: '/virtual-reality',
      icon: 'fas fa-cube',
      label: 'Virtual Reality',
      color: 'text-info'
    },
    {
      path: '/rtl',
      icon: 'fas fa-globe',
      label: 'RTL',
      color: 'text-danger'
    }
  ];

  const accountItems = [
    {
      path: '/profile',
      icon: 'fas fa-user',
      label: 'Profile',
      color: 'text-secondary'
    },
    {
      path: '/sign-in',
      icon: 'fas fa-sign-in-alt',
      label: 'Sign In',
      color: 'text-warning'
    },
    {
      path: '/sign-up',
      icon: 'fas fa-user-plus',
      label: 'Sign Up',
      color: 'text-info'
    }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="p-3">
        <div className="d-flex align-items-center mb-4">
          <img 
            src="/public/image/logo.png" 
            alt="Logo" 
            className="me-2"
            style={{ width: '32px', height: '32px' }}
          />
          {!collapsed && (
            <span className="text-white fw-bold">Argon Dashboard</span>
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
              src="/public/image/help-icon.svg" 
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

export default Sidebar; 