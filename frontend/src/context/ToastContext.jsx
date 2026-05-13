import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const { type = 'success', timeout = 4000, action } = options;
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, action }]);

    if (timeout > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
