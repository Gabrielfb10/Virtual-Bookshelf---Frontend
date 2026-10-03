import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Container de Toasts flutuante */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 10000,
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => {
          
          let Icon = Info;
          let color = '#3b82f6';
          let bgColor = '#eff6ff';
          let borderColor = '#bfdbfe';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            color = '#10b981';
            bgColor = '#f0fdf4';
            borderColor = '#bbf7d0';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            color = '#ef4444';
            bgColor = '#fef2f2';
            borderColor = '#fecaca';
          }

          return (
            <div key={toast.id} style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderLeft: `4px solid ${color}`,
              borderTop: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`,
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '300px',
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}>
              <div style={{ color: color }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1, color: 'var(--text-main)', fontWeight: '500', fontSize: '0.95rem' }}>
                {toast.message}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
