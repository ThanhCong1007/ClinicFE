import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, onToggleDarkMode, darkMode }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard' || path === '/admin/') return 'Doanh Thu';
    if (path === '/admin/tables') return 'Người dùng';
    if (path === '/admin/billing') return 'Hóa đơn';
    if (path === '/admin/profile') return 'Profile';
    if (path === '/admin/sign-in') return 'Sign In';
    if (path === '/admin/sign-up') return 'Sign Up';
    if (path === '/admin/virtual-reality') return 'Virtual Reality';
    if (path === '/admin/rtl') return 'RTL';
    return 'Dashboard';
  };

  const notifications = [
    {
      id: 1,
      avatar: '/image/team-2.jpg',
      title: 'New message from Laur',
      time: '13 minutes ago',
      icon: 'fas fa-user'
    },
    {
      id: 2,
      avatar: '/image/spotify-logo.svg',
      title: 'New album by Travis Scott',
      time: '1 day',
      icon: 'fas fa-music'
    },
    {
      id: 3,
      avatar: '/image/credit-card.svg',
      title: 'Payment successfully completed',
      time: '2 days',
      icon: 'fas fa-credit-card'
    }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark admin-navbar">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white d-lg-none me-3"
            onClick={onToggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
          
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/admin" className="text-white-50">Admin</Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                {getPageTitle()}
              </li>
            </ol>
            <h6 className="mb-0 text-white fw-bold">{getPageTitle()}</h6>
          </nav>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="fas fa-search text-white-50"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-transparent text-white"
                placeholder="Type here..."
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              />
            </div>
          </div>

          <ul className="navbar-nav">
            <li className="nav-item me-3">
            </li>

            <li className="nav-item me-3">
              <div className="dropdown">
                <button
                  className="btn btn-link text-white nav-link"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="fas fa-bell"></i>
                </button>
                
                {showNotifications && (
                  <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '300px' }}>
                    {notifications.map((notification) => (
                      <a key={notification.id} className="dropdown-item" href="#">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={notification.avatar}
                              alt="Avatar"
                              className="rounded-circle"
                              style={{ width: '36px', height: '36px' }}
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1 small">{notification.title}</h6>
                            <p className="mb-0 text-muted small">
                              <i className="fas fa-clock me-1"></i>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>

            <li className="nav-item me-3">
              <button
                className="btn btn-link text-white nav-link"
                onClick={onToggleDarkMode}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </li>

            <li className="nav-item">
              <button className="btn btn-link text-white nav-link">
                <i className="fas fa-cog"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 