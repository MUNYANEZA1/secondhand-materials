import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a notification
  const addNotification = (message, type = 'info', timeout = 5000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type, // 'info', 'success', 'warning', 'error'
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after timeout
    if (timeout) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  };

  // Remove a notification by id
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
