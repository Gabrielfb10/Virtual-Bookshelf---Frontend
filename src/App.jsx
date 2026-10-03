
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PrivateRoute } from './routes/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import MyShelf from './pages/MyShelf';
import ShelfBookDetails from './pages/ShelfBookDetails';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';

function RootRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HOST' || user?.role === 'ADMIN';
  return <Navigate to={isAdmin ? "/admin/books" : "/my-shelf"} replace />;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes (Authenticated) */}
          <Route element={<PrivateRoute />}>
            <Route path="/my-shelf" element={<MyShelf />} />
            <Route path="/my-shelf/:id" element={<ShelfBookDetails />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<BookDetails />} />
            <Route path="/profile" element={<Profile />} />
            {/* Redirect root based on role */}
            <Route path="/" element={<RootRedirect />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute requireAdmin={true} />}>
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
