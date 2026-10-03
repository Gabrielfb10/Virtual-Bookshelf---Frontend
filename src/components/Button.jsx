import React from 'react';

export function Button({ children, type = 'button', onClick, variant = 'primary', loading, fullWidth }) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  let specificStyle = {};
  if (isPrimary) {
    specificStyle = {
      backgroundColor: 'var(--primary-color)',
      color: '#fff',
    };
  } else if (isDanger) {
    specificStyle = {
      backgroundColor: 'var(--danger-color)',
      color: '#fff',
    };
  } else if (isGhost) {
    specificStyle = {
      backgroundColor: 'transparent',
      color: 'var(--primary-color)',
      border: '1px solid var(--primary-color)',
    };
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{ ...baseStyle, ...specificStyle }}
      onMouseOver={(e) => {
        if (!loading && isPrimary) e.target.style.backgroundColor = 'var(--primary-hover)';
      }}
      onMouseOut={(e) => {
        if (!loading && isPrimary) e.target.style.backgroundColor = 'var(--primary-color)';
      }}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
