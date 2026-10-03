import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ChevronLeft, Trash2, Save } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ShelfBookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function loadItem() {
      try {
        const response = await api.get(`/users/me/shelf/${id}`);
        setItem(response.data);
        setStatus(response.data.status);
        setCurrentPage(response.data.currentPage || 0);
        setRating(response.data.rating || 0);
      } catch (error) {
        console.error("Erro ao carregar item da estante:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/users/me/shelf/${id}`, { status });
      await api.put(`/users/me/shelf/${id}/progress`, { currentPage: Number(currentPage) });
      if (rating > 0) {
        await api.put(`/users/me/shelf/${id}/rating`, { note: Number(rating) });
      }
      addToast('Alterações salvas com sucesso!', 'success');
      navigate('/my-shelf');
    } catch (error) {
      addToast('Erro ao salvar alterações.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (window.confirm("Deseja remover este livro da sua estante? O progresso será perdido.")) {
      try {
        await api.delete(`/users/me/shelf/${id}`);
        navigate('/my-shelf');
      } catch (error) {
        alert("Erro ao remover livro.");
      }
    }
  }

  if (loading) return <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Carregando detalhes...</div></Layout>;
  if (!item) return <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Livro não encontrado na sua estante.</div></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Link to="/my-shelf" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> Voltar à minha estante
        </Link>
        
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Left Column - Book Info */}
          <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                {item.book?.cover ? (
                  <img src={`http://localhost:8080${item.book.cover}`} alt={item.book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Sem Capa</div>
                )}
              </div>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0' }}>{item.book?.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{item.book?.author}</p>
              </div>
             </div>
          </div>
          
          {/* Right Column - User Progress */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                Minha Experiência de Leitura
              </h2>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Status da Obra</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    <option value="WANT_TO_READ">Quero Ler</option>
                    <option value="READING">Lendo</option>
                    <option value="PAUSED">Pausado</option>
                    <option value="COMPLETED">Lido</option>
                    <option value="ABANDONED">Abandonado</option>
                    <option value="RE_READING">Relendo</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Minha Nota (1 a 5)</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    <option value="0">Sem nota</option>
                    <option value="1">1 Estrela</option>
                    <option value="2">2 Estrelas</option>
                    <option value="3">3 Estrelas</option>
                    <option value="4">4 Estrelas</option>
                    <option value="5">5 Estrelas</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <Input 
                  label={`Página Atual (de ${item.book?.numberOfPages || '?'})`} 
                  type="number" 
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <button onClick={handleRemove} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-color)', backgroundColor: 'transparent', fontWeight: '500', padding: '8px 12px', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Trash2 size={18} /> Remover da Estante
                </button>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  <Save size={18} /> Salvar Alterações
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
