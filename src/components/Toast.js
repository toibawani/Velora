import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/Toast.css';

function Toast({ message, type = 'info', duration = 3000, onClose = () => {} }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role={type === 'error' ? 'alert' : 'status'} aria-live={type === 'error' ? 'assertive' : 'polite'}>
      <span>{message}</span>
      <button data-testid="toast" className="toast-close" onClick={onClose} aria-label="Dismiss notification">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default Toast;
