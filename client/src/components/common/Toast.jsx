import React from 'react';
import { useToastStore } from '../../store/toastStore.js';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-rose-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-400" />;
      default:
        return <Info size={20} className="text-indigo-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(244, 63, 94, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      default:
        return 'rgba(99, 102, 241, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 3rem)',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-in glass-panel"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            padding: '1rem 1.25rem',
            borderColor: getBorderColor(toast.type),
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1 }}>
            {toast.title && (
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.15rem',
                }}
              >
                {toast.title}
              </h4>
            )}
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
