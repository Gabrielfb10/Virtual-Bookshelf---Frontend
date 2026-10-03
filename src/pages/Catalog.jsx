import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { BookCard } from '../components/BookCard';
import { Input } from '../components/Input';
import { Search } from 'lucide-react';
import { Pagination } from '../components/Pagination';
import api from '../services/api';

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const response = await api.get('/books/', {
          params: {
            page: currentPage,
            size: 12,
            name: debouncedTerm || undefined
          }
        });
        setBooks(response.data.content || []);
        setTotalPages(response.data.totalPages ?? response.data.page?.totalPages ?? 1);
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [currentPage, debouncedTerm]);

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page on new search
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0' }}>Catálogo Global</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Explore novos títulos e adicione à sua estante.</p>
          </div>
          
          <div style={{ width: '300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Pesquisar por título..." 
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Carregando catálogo...</div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum livro encontrado.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '32px' 
          }}>
            {books.map(book => (
              <BookCard key={book.id} item={book} isCatalog={true} />
            ))}
          </div>
        )}

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}
