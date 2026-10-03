import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Trash2, Edit2, X } from 'lucide-react';
import { Pagination } from '../components/Pagination';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [userData, setUserData] = useState({ name: '', nickname: '', email: '', role: 'ROLE_USER' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await api.get('/users/', {
        params: {
          page: currentPage,
          size: 10
        }
      });
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages ?? response.data.page?.totalPages ?? 1);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      const errMsg = error.response ? `Erro ${error.response.status}` : error.message;
      addToast(`Erro ao carregar usuários: ${errMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente remover este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        addToast('Usuário excluído com sucesso!', 'success');
        if (users.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          loadUsers();
        }
      } catch (error) {
        addToast('Erro ao excluir usuário.', 'error');
      }
    }
  }

  function handleOpenEditModal(user) {
    setEditId(user.id);
    setUserData({
      name: user.name || '',
      nickname: user.nickname || '',
      email: user.email || '',
      role: user.role || 'ROLE_USER'
    });
    setError('');
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.put(`/users/${editId}`, userData);
      addToast('Usuário atualizado com sucesso!', 'success');
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar usuário.');
      addToast('Erro ao salvar usuário.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 4px 0' }}>Gestão de Usuários</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Controle de contas da plataforma.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden', paddingBottom: '24px' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Carregando...</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Nome</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>E-mail</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Nível / XP</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{user.role}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                         {user.email}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Lvl {user.level || 1} ({user.pagesRead || 0} pgs)
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleOpenEditModal(user)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum usuário encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </Layout>

    {/* Modal de Edição */}
    {showModal && (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative', backgroundColor: '#fff' }}>
          <button 
            onClick={handleCloseModal}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
          
          <h2 style={{ margin: '0 0 24px 0' }}>Editar Usuário</h2>
          
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input 
              label="Nome" 
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              required 
            />
            <Input 
              label="Apelido (Nickname)" 
              value={userData.nickname}
              onChange={(e) => setUserData({...userData, nickname: e.target.value})}
              required 
            />
            <Input 
              label="E-mail" 
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              required 
            />
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                Papel (Role)
              </label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({...userData, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#f8fafc'
                }}
              >
                <option value="ROLE_USER">Usuário Comum (ROLE_USER)</option>
                <option value="ROLE_ADMIN">Administrador (ROLE_ADMIN)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button type="button" onClick={handleCloseModal} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid #cbd5e1' }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  );
}
