import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from '../components/widgets/NotificationModal';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface NotificationContextType {
  showNotification: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideNotification: () => void;
  showConfirmDialog: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    resolve?: (result: boolean) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    resolve: undefined,
  });

  const showNotification = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setNotification({
      isOpen: true,
      title,
      message,
      type,
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showConfirmDialog = (options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        resolve,
      });
    });
  };

  const handleConfirm = (result: boolean) => {
    if (confirmDialog.resolve) confirmDialog.resolve(result);
    setConfirmDialog((c) => ({ ...c, isOpen: false, resolve: undefined }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, showConfirmDialog }}>
      {children}
      <NotificationToast
        isOpen={notification.isOpen}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type === 'warning' ? 'info' : notification.type}
      />
      {confirmDialog.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{confirmDialog.title}</div>
            <div style={{ fontSize: 15, marginBottom: 20 }}>{confirmDialog.message}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>{confirmDialog.cancelText}</button>
              <button className="btn btn-danger" onClick={() => handleConfirm(true)}>{confirmDialog.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}; 