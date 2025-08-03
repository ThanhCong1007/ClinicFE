import React, { useEffect, useRef } from 'react';
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
  autoClose?: number; // Thời gian tự động đóng (ms), 0 = không tự động đóng
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  onConfirm,
  showConfirmButton = false,
  confirmText = 'Xác nhận',
  autoClose = 3000 // Mặc định 3 giây
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Chỉ tự động đóng khi không có confirm button và autoClose > 0
      if (!showConfirmButton && autoClose > 0) {
        timeoutRef.current = setTimeout(() => {
          onClose();
        }, autoClose);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, showConfirmButton, autoClose, onClose]);

  const handleModalClick = (e: React.MouseEvent) => {
    // Chỉ đóng khi click vào overlay, không đóng khi click vào modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.17 21H20.83A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="notification-overlay" onClick={handleModalClick}>
      <div ref={modalRef} className={`notification-modal notification-${type}`}>
        <div className="notification-header">
          <div className="notification-icon-wrapper">
            {getIcon()}
          </div>
          <div className="notification-content">
            <h3 className="notification-title">{title}</h3>
            <p className="notification-message">{message}</p>
          </div>
          <button className="notification-close" onClick={onClose} aria-label="Đóng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {showConfirmButton && (
          <div className="notification-footer">
            <button className="notification-confirm-btn" onClick={handleConfirm}>
              {confirmText}
            </button>
            <button className="notification-cancel-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        )}
        
        {/* Progress bar cho auto close */}
        {!showConfirmButton && autoClose > 0 && (
          <div className="notification-progress">
            <div className="notification-progress-bar" style={{ animationDuration: `${autoClose}ms` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal; 