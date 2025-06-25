import React from 'react';
import { logout } from '../../services/userService';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'link';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  children = 'Đăng xuất',
  variant = 'button'
}) => {
  const handleLogout = () => {
    logout();
  };

  if (variant === 'link') {
    return (
      <a href="#" onClick={handleLogout} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default LogoutButton; 