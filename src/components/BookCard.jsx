import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const statusConfig = {
  'READING': { label: 'Lendo', color: '#f59e0b', bg: '#fef3c7' },
  'WANT_TO_READ': { label: 'Quero Ler', color: '#3b82f6', bg: '#dbeafe' },
  'COMPLETED': { label: 'Lido', color: '#10b981', bg: '#d1fae5' },
  'ABANDONED': { label: 'Abandonado', color: '#ef4444', bg: '#fee2e2' },
  'PAUSED': { label: 'Pausado', color: '#64748b', bg: '#f1f5f9' },
  'RE_READING': { label: 'Relendo', color: '#8b5cf6', bg: '#ede9fe' }
};

export function BookCard({ item, isCatalog = false }) {
  // Se for catálogo, o objeto será o book direto. Se for shelf, o item tem o book dentro (ou infos chatas)
  const book = isCatalog ? item : item.book;
  const statusInfo = !isCatalog && item.status ? statusConfig[item.status] : null;

  return (
    <Link 
      to={isCatalog ? `/catalog/${book?.id}` : `/my-shelf/${item?.id}`}
      style={{
        display: 'block',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        color: 'inherit'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Ribbon/Bookmark indicator for Shelf */}
      {statusInfo && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12px',
          width: '24px',
          height: '32px',
          backgroundColor: statusInfo.color,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
          zIndex: 10
        }} title={statusInfo.label} />
      )}

      {/* Capa */}
      <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#e2e8f0', position: 'relative' }}>
        {book?.cover ? (
          <img src={`http://localhost:8080${book.cover}`} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Sem Capa</div>
        )}
      </div>

      {/* Detalhes */}
      <div style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {book?.name || 'Livro Desconhecido'}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {book?.author || 'Autor Desconhecido'}
        </p>

        {!isCatalog && item.status === 'READING' && item.currentPage !== undefined && book?.numberOfPages && (
          <div style={{ marginTop: '8px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px', color: 'var(--text-muted)' }}>
               <span>{Math.round((item.currentPage / book.numberOfPages) * 100)}%</span>
               <span>{item.currentPage} / {book.numberOfPages}</span>
             </div>
             <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${(item.currentPage / book.numberOfPages) * 100}%`, backgroundColor: '#3b82f6' }} />
             </div>
          </div>
        )}

        {!isCatalog && item.note > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '8px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                size={14} 
                color={star <= item.note ? '#f59e0b' : '#e2e8f0'} 
                fill={star <= item.note ? '#f59e0b' : 'none'} 
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
