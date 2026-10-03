import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { ChevronLeft, Plus } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Erro ao carregar livro:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  async function handleAddToShelf() {
    setAdding(true);
    try {
      await api.post('/users/me/shelf/', { bookId: Number(id) });
      addToast('Livro adicionado à sua estante!', 'success');
      navigate('/catalog');
    } catch (error) {
      if (error.response?.status === 409) {
        addToast('Este livro já está na sua estante.', 'error');
      } else {
        addToast('Erro ao adicionar livro.', 'error');
      }
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Carregando detalhes...</div></Layout>;
  if (!book) return <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Livro não encontrado.</div></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> Voltar ao catálogo
        </Link>
        
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              {book.cover ? (
                <img src={`http://localhost:8080${book.cover}`} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Sem Capa</div>
              )}
            </div>
            
            <Button variant="primary" onClick={handleAddToShelf} loading={adding} fullWidth>
              <Plus size={18} /> Adicionar à Estante
            </Button>
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{book.name}</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '24px' }}>por {book.author}</p>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Páginas</p>
                <p style={{ fontWeight: '600', margin: 0 }}>{book.numberOfPages}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Categoria</p>
                <p style={{ fontWeight: '600', margin: 0 }}>{book.category}</p>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '12px' }}>Sinopse</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {book.description || 'Nenhuma descrição disponível para este livro no momento.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
