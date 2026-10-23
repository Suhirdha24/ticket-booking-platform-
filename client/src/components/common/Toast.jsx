import React from 'react';
import { useToastStore } from '../../store/toastStore.js';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#E11D48" />;
      case 'warning':
        return <AlertTriangle size={20} color="#D97706" />;
      default:
        return <Info size={20} color="#4338CA" />;
    }
  };

  const getAccentColor = (type) => {
    switch (type) {
      case 'success':
        return '#059669';
      case 'error':
        return '#E11D48';
      case 'warning':
        return '#D97706';
      default:
        return '#4338CA';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '390px',
        width: 'calc(100% - 2.5rem)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-in"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            padding: '0.95rem 1.15rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderLeft: `4px solid ${getAccentColor(toast.type)}`,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1 }}>
            {toast.title && (
              <h4
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  marginBottom: '0.2rem',
                  lineHeight: 1.3,
                }}
              >
                {toast.title}
              </h4>
            )}
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-body)',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.06)';
              e.currentTarget.style.color = 'var(--text-heading)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-subtle)';
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
