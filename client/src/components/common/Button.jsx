import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) {
  const sizeStyles = {
    sm: {
      padding: '0.45rem 0.95rem',
      fontSize: '0.82rem',
      borderRadius: '10px',
      gap: '0.4rem',
    },
    md: {
      padding: '0.75rem 1.45rem',
      fontSize: '0.92rem',
      borderRadius: '12px',
      gap: '0.55rem',
    },
    lg: {
      padding: '0.95rem 2rem',
      fontSize: '1.05rem',
      borderRadius: '16px',
      gap: '0.65rem',
    },
  }[size] || {
    padding: '0.75rem 1.45rem',
    fontSize: '0.92rem',
    borderRadius: '12px',
    gap: '0.55rem',
  };

  const variantStyles = {
    primary: {
      background: 'var(--gradient-purple)',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 4px 18px rgba(139, 92, 246, 0.45), 0 0 25px rgba(99, 102, 241, 0.25)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#FFFFFF',
      border: '1px solid rgba(139, 92, 246, 0.35)',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#A78BFA',
      border: '1.5px solid #8B5CF6',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#FCA5A5',
      border: '1px solid rgba(239, 68, 68, 0.4)',
    },
    success: {
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#6EE7B7',
      border: '1px solid rgba(16, 185, 129, 0.4)',
    },
  }[variant] || {
    background: 'var(--gradient-purple)',
    color: '#FFFFFF',
    border: 'none',
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
    userSelect: 'none',
    textDecoration: 'none',
    ...sizeStyles,
    ...variantStyles,
    ...style,
  };

  return (
    <button
      className={`sonora-btn-modern ${className}`}
      style={baseStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
