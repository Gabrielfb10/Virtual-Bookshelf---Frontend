import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { BookOpen } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register(name, nickname, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ 
        flex: 1, 
        background: 'var(--gradient-primary)', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        padding: '60px',
        color: '#fff',
        display: window.innerWidth < 768 ? 'none' : 'flex'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <BookOpen size={40} />
          <h1 style={{ color: '#fff' }}>VirtualBookshelf</h1>
        </div>
        <h2 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '24px', color: '#fff' }}>
          Comece sua jornada literária.
        </h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '500px' }}>
          Crie sua conta gratuitamente e passe a gerenciar suas leituras, acompanhar seu progresso diário e subir de nível.
        </p>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Criar conta</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Preencha os dados abaixo para se cadastrar.</p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input 
              label="Nome completo" 
              type="text" 
              id="name" 
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Apelido / Username" 
              type="text" 
              id="nickname" 
              placeholder="Como quer ser chamado?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <Input 
              label="E-mail" 
              type="email" 
              id="email" 
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Senha" 
              type="password" 
              id="password" 
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div style={{ marginTop: '16px' }}>
              <Button type="submit" loading={loading} fullWidth>
                Cadastrar
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
            Já tem uma conta? <Link to="/login" style={{ fontWeight: '600' }}>Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

