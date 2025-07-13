import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import NotificationToast from '../../dashboard/components/NotificationModal';

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  showConfirmDialog: (options: ConfirmDialogOptions) => Promise<boolean>;
}

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
  }>({ show: false, title: '', message: '', type: 'info', duration: 4000 });

  // Confirm dialog state
  const [confirm, setConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    resolve?: (result: boolean) => void;
  }>({ show: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No' });

  // Show notification toast
  const showNotification = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
    setToast({ show: true, title, message, type, duration });
  }, []);

  // Show confirm dialog
  const showConfirmDialog = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirm({
        show: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'No',
        resolve,
      });
    });
  }, []);

  // Handle confirm dialog actions
  const handleConfirm = (result: boolean) => {
    if (confirm.resolve) confirm.resolve(result);
    setConfirm((c) => ({ ...c, show: false, resolve: undefined }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showConfirmDialog }}>
      {children}
      <NotificationToast
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
      />
      {confirm.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{confirm.title}</div>
            <div style={{ fontSize: 15, marginBottom: 20 }}>{confirm.message}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>{confirm.cancelText}</button>
              <button className="btn btn-danger" onClick={() => handleConfirm(true)}>{confirm.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 