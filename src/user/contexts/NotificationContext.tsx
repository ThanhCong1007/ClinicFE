import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationModal from '../../user/components/widgets/NotificationModal';

interface NotificationContextType {
  showNotification: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void) => void;
  hideNotification: () => void;
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
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showNotification = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    onConfirm?: () => void
  ) => {
    setNotification({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        onConfirm={notification.onConfirm}
        showConfirmButton={!!notification.onConfirm}
      />
    </NotificationContext.Provider>
  );
}; 