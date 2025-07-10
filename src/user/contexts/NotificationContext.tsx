import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from '../../dashboard/components/NotificationModal';

interface NotificationContextType {
  showNotification: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
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
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
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

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationToast
        show={notification.isOpen}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type === 'warning' ? 'info' : notification.type}
      />
    </NotificationContext.Provider>
  );
}; 