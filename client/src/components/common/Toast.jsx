import React from 'react';
import { useToastStore } from '../../store/toastStore.js';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#34D399" />;
      case 'error':
        return <AlertCircle size={20} color="#F43F5E" />;
      case 'warning':
        return <AlertTriangle size={20} color="#FBBF24" />;
      default:
        return <Info size={20} color="#818CF8" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.45)';
      case 'error':
        return 'rgba(244, 63, 94, 0.45)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.45)';
      default:
        return 'rgba(139, 92, 246, 0.45)';
    }
  };

  return (
    <div className="sonora-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="sonora-toast-card"
          style={{
            borderColor: getBorderColor(toast.type),
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
                  marginBottom: '0.2rem',
                  color: '#FFFFFF',
                }}
              >
                {toast.title}
              </h4>
            )}
            <p
              style={{
                fontSize: '0.84rem',
                color: '#CBD5E1',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '3px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
