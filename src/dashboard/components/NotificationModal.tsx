import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'react-feather';

interface NotificationToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // ms
}

const iconMap = {
  success: <CheckCircle color="#28a745" size={24} style={{marginRight: 8}} />,
  error: <XCircle color="#dc3545" size={24} style={{marginRight: 8}} />,
  info: <Info color="#17a2b8" size={24} style={{marginRight: 8}} />,
};

const NotificationToast: React.FC<NotificationToastProps> = ({ show, onClose, title, message, type = 'info', duration = 4000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1055,
        minWidth: 320,
        maxWidth: 400,
        background: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        borderRadius: 8,
        borderLeft: `6px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'}`,
        padding: '16px 20px 16px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        animation: 'fadeInToast 0.3s',
      }}
      role="alert"
    >
      {iconMap[type]}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 15 }}>{message}</div>
      </div>
    </div>
  );
};

export default NotificationToast;

// Thêm animation fadeInToast vào global css nếu muốn:
// @keyframes fadeInToast { from { opacity: 0; transform: translateY(-16px);} to { opacity: 1; transform: none; } } 