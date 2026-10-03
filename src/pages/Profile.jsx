import React, { useState, useContext, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../services/api';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // Profile Edit State
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Edit State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setNickname(user.nickname || '');
      setEmail(user.email || '');
    }
  }, [user]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const response = await api.put('/users/me', { name, nickname, email });
      setUser(response.data);
      localStorage.setItem('@VirtualBookshelf:user', JSON.stringify(response.data));
      setProfileSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      await api.put('/users/me/change-password', { currentPassword, newPassword });
      setPasswordSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Meu Perfil</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Gerencie suas informações pessoais e senha de acesso.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Sessão de Dados Pessoais */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Dados Pessoais</h2>
            
            {profileSuccess && <div style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{profileSuccess}</div>}
            {profileError && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{profileError}</div>}
            
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input 
                  label="Nome completo" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
                <Input 
                  label="Apelido / Username" 
                  value={nickname} 
                  onChange={e => setNickname(e.target.value)} 
                  required 
                />
              </div>
              <Input 
                label="E-mail" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              <div style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                <Button type="submit" loading={profileLoading}>Salvar Alterações</Button>
              </div>
            </form>
          </div>

          {/* Sessão de Senha */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Segurança</h2>
            
            {passwordSuccess && <div style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{passwordSuccess}</div>}
            {passwordError && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{passwordError}</div>}
            
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <Input 
                label="Senha Atual" 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required 
              />
              <Input 
                label="Nova Senha" 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
              />
              <div style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                <Button type="submit" variant="outline" loading={passwordLoading}>Alterar Senha</Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}
