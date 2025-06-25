import React from 'react';
import './NotificationModal.css';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  confirmText?: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  onConfirm,
  showConfirmButton = false,
  confirmText = 'Xác nhận'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="notification-overlay">
      <div className={`notification-modal notification-${type}`}>
        <div className="notification-header">
          <span className="notification-icon">{getIcon()}</span>
          <h3 className="notification-title">{title}</h3>
          <button className="notification-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="notification-body">
          <p className="notification-message">{message}</p>
        </div>
        <div className="notification-footer">
          {showConfirmButton && (
            <button className="notification-confirm-btn" onClick={handleConfirm}>
              {confirmText}
            </button>
          )}
          <button className="notification-cancel-btn" onClick={onClose}>
            {showConfirmButton ? 'Hủy' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 