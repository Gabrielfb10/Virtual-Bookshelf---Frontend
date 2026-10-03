import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#fff',
    border: '1px solid #cbd5e1',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
  };

  const btnDisabledStyle = {
    ...btnStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: '#f1f5f9'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
      <button 
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        style={currentPage === 0 ? btnDisabledStyle : btnStyle}
      >
        <ChevronLeft size={16} /> Anterior
      </button>
      
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Página {currentPage + 1} de {totalPages}
      </span>
      
      <button 
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        style={currentPage >= totalPages - 1 ? btnDisabledStyle : btnStyle}
      >
        Próxima <ChevronRight size={16} />
      </button>
    </div>
  );
}
