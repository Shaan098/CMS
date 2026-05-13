import React from 'react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-wrapper">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-message">{t.message}</div>
          {t.action && (
            <button
              className="toast-action"
              onClick={() => {
                try {
                  t.action.callback && t.action.callback();
                } catch (e) {}
                removeToast(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
