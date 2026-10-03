import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Library, Search, Settings, LogOut, User as UserIcon } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HOST' || user?.role === 'ADMIN';

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'rgba(5, 150, 105, 0.1)' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    textDecoration: 'none',
    transition: 'all 0.2s',
  });

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--surface-color)',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '40px' }}>
        <Library size={28} color="var(--primary-color)" />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>VirtualBookshelf</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink to="/my-shelf" style={navLinkStyle}>
          <UserIcon size={20} />
          Minha Estante
        </NavLink>
        <NavLink to="/catalog" style={navLinkStyle}>
          <Search size={20} />
          Catálogo Global
        </NavLink>
        
        {isAdmin && (
          <>
            <div style={{ margin: '16px 0 8px 8px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Administração
            </div>
            <NavLink to="/admin/books" style={navLinkStyle}>
              <Settings size={20} />
              Gestão de Acervo
            </NavLink>
            <NavLink to="/admin/users" style={navLinkStyle}>
              <UserIcon size={20} />
              Gestão de Usuários
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
        <NavLink 
          to="/profile" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '8px', 
            marginBottom: '16px',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: 'var(--radius-md)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.05)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '600', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Nível {user?.level || 1}</p>
          </div>
        </NavLink>
        
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-color)',
            backgroundColor: 'transparent',
            fontWeight: '500',
            textAlign: 'left'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}
