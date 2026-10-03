import React, { useEffect, useState, useContext } from 'react';
import { Layout } from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { BookCard } from '../components/BookCard';
import { ProgressBar } from '../components/ProgressBar';
import { Pagination } from '../components/Pagination';
import api from '../services/api';
import { Book, Target, Award } from 'lucide-react';

export default function MyShelf() {
  const { user, refreshUser } = useContext(AuthContext);
  const [shelfItems, setShelfItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await refreshUser(); // Atualiza os dados de gamificação silenciosamente
        const response = await api.get('/users/me/shelf/', {
          params: {
            page: currentPage,
            size: 12,
            status: filter === 'ALL' ? undefined : filter
          }
        });
        setShelfItems(response.data.content || []);
        setTotalPages(response.data.totalPages ?? response.data.page?.totalPages ?? 1);
      } catch (error) {
        console.error("Erro ao carregar estante:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentPage, filter]);

  function handleFilterChange(newFilter) {
    if (filter !== newFilter) {
      setFilter(newFilter);
      setCurrentPage(0); // Reset page to 0 when filter changes
    }
  }

  // Use total pages read and experience from backend
  const pagesRead = user?.pagesRead || 0;
  const currentXP = user?.experience || 0;
  // requiredXp = 10 + (level - 1) * 2 (matches backend logic)
  const nextLevelXP = 10 + ((user?.level || 1) - 1) * 2;
  
  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Gamification Dashboard Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Award size={32} />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Seu Nível Atual</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>Nível {user?.level || 1}</h3>
            </div>
          </div>
          
          <div style={{ flex: '2 1 300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '500' }}><Target size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Progresso do Nível (XP)</span>
              <span style={{ color: 'var(--text-muted)' }}>{currentXP} / {nextLevelXP} XP</span>
            </div>
            <ProgressBar current={currentXP} total={nextLevelXP} height="10px" />
          </div>

          <div style={{ flex: '1 1 150px', textAlign: 'center', paddingLeft: '24px', borderLeft: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Paginômetro</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{pagesRead}</div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>páginas lidas no total</p>
          </div>
        </div>

        {/* Shelf Tabs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Book size={24} /> Minha Estante
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['ALL', 'READING', 'WANT_TO_READ', 'COMPLETED', 'ABANDONED'].map((status) => {
                const labels = {
                  'ALL': 'Todos',
                  'READING': 'Lendo',
                  'WANT_TO_READ': 'Quero Ler',
                  'COMPLETED': 'Lidos',
                  'ABANDONED': 'Abandonados'
                };
                
                const colors = {
                  'READING': '#f59e0b',
                  'WANT_TO_READ': '#3b82f6',
                  'COMPLETED': '#10b981',
                  'ABANDONED': '#ef4444'
                };

                return (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: filter === status ? 'var(--primary-color)' : 'transparent',
                      color: filter === status ? '#fff' : 'var(--text-muted)',
                      padding: '6px 16px',
                      borderRadius: '999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    {status !== 'ALL' && (
                      <div style={{
                        width: '10px',
                        height: '14px',
                        backgroundColor: colors[status],
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                      }} />
                    )}
                    {labels[status]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Book Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Carregando estante...</div>
          ) : shelfItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: 'var(--text-muted)' }}>Você ainda não tem livros nesta categoria.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '24px' 
            }}>
              {shelfItems.map(item => (
                <BookCard key={item.id} item={item} />
              ))}
            </div>
          )}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </Layout>
  );
}
