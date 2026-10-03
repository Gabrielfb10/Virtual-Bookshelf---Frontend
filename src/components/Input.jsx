import React from 'react';

export function Input({ label, type = 'text', id, value, onChange, placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', width: '100%' }}>
      {label && <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>{label}</label>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #d1d5db',
          outline: 'none',
          fontSize: '1rem',
          color: 'var(--text-main)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary-color)';
          e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
