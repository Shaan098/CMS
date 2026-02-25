import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = 'info', duration = 4000) => {
        const id = Date.now();
        const notification = { id, message, type };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const success = (message, duration) => showNotification(message, 'success', duration);
    const error = (message, duration) => showNotification(message, 'error', duration);
    const info = (message, duration) => showNotification(message, 'info', duration);
    const warning = (message, duration) => showNotification(message, 'warning', duration);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, success, error, info, warning, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
