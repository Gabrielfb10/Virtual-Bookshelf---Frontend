import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Left Side - Visual */}
      <div style={{ 
        flex: 1, 
        background: 'var(--gradient-hero)', 
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
          Sua estante de livros,<br/> com progresso e níveis.
        </h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '500px' }}>
          Adicione livros do catálogo, anote até onde leu, dê sua nota e veja seu nível subir a cada página.
        </p>
      </div>

      {/* Right Side - Form */}
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
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Bem-vindo de volta</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Entre para continuar suas leituras.</p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                Entrar
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
            Ainda não tenho conta — <Link to="/register" style={{ fontWeight: '600' }}>quero me cadastrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
