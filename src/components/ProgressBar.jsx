import React from 'react';

export function ProgressBar({ current, total, color = 'var(--primary-color)', height = '8px' }) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  
  return (
    <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', height }}>
      <div 
        style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          backgroundColor: color,
          transition: 'width 0.5s ease-out'
        }} 
      />
    </div>
  );
}
