import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', height: '100vh' }}>
        <div className="container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
