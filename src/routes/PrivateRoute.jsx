import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function PrivateRoute({ requireAdmin }) {
  const { signed, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  // Se requerer admin e o usuário não for admin
  if (requireAdmin && user?.role !== 'ROLE_ADMIN' && user?.role !== 'ROLE_HOST' && user?.role !== 'ADMIN') {
    return <Navigate to="/my-shelf" replace />;
  }

  return <Outlet />;
}
