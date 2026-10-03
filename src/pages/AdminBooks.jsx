import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { Pagination } from '../components/Pagination';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminBooks() {
  const { addToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('BOOK');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfPages, setNumberOfPages] = useState('');
  const [cover, setCover] = useState(null);

  useEffect(() => {
    loadBooks();
  }, [currentPage]);

  async function loadBooks() {
    setLoading(true);
    try {
      const response = await api.get('/books/', {
        params: {
          page: currentPage,
          size: 10
        }
      });
      console.log('Books API Response:', response.data);
      setBooks(response.data.content || []);
      setTotalPages(response.data.totalPages ?? response.data.page?.totalPages ?? 1);
    } catch (error) {
      console.error("Erro ao carregar livros admin:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente remover este livro?")) {
      try {
        await api.delete(`/books/${id}`);
        addToast('Livro excluído com sucesso!', 'success');
        if (books.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          loadBooks();
        }
      } catch (error) {
        addToast('Erro ao excluir livro.', 'error');
      }
    }
  }

  function handleOpenModal(book = null) {
    if (book) {
      setEditId(book.id);
      setName(book.name);
      setAuthor(book.author);
      setCategory(book.category || 'BOOK');
      setGenre(book.genre || '');
      setDescription(book.description || '');
      setNumberOfPages(book.numberOfPages?.toString() || '');
      setCover(null);
    } else {
      setEditId(null);
      setName('');
      setAuthor('');
      setCategory('BOOK');
      setGenre('');
      setDescription('');
      setNumberOfPages('');
      setCover(null);
    }
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookData = {
        name,
        author,
        category,
        genre,
        description,
        numberOfPages: parseInt(numberOfPages, 10) || 0
      };

      if (editId) {
        // Modo Edição: O backend aceita apenas JSON (BookRequestDto) no PUT
        await api.put(`/books/${editId}`, bookData);
        addToast('Livro atualizado com sucesso!', 'success');
      } else {
        // Modo Criação: O backend aceita multipart/form-data
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(bookData)], { type: "application/json" }));
        if (cover) {
          formData.append('cover', cover);
        }
        await api.post('/books/', formData);
        addToast('Livro cadastrado com sucesso!', 'success');
      }

      setShowModal(false);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar livro. Verifique os dados.');
      addToast('Erro ao salvar livro.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 4px 0' }}>Gestão de Acervo Literário</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Gerencie os títulos do catálogo e edições.</p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Novo Livro
            </Button>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden', paddingBottom: '24px' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>Carregando...</div>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Obra & Autor</th>
                      <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Categoria</th>
                      <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Páginas</th>
                      <th style={{ padding: '16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '56px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                               {book.cover && <img src={`http://localhost:8080${book.cover}`} alt="capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600' }}>{book.name}</div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                           <span style={{ padding: '4px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>
                             {book.category || 'BOOK'}
                           </span>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {book.numberOfPages} pgs
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleOpenModal(book)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: 'var(--text-main)' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(book.id)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {books.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum livro no catálogo</td>
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

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{editId ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Título do Livro" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Autor" value={author} onChange={e => setAuthor(e.target.value)} required />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Categoria</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <option value="BOOK">Livro</option>
                    <option value="MANGA">Mangá</option>
                    <option value="MAGAZINE">Revista</option>
                    <option value="JOURNAL">Jornal</option>
                    <option value="ARTICLE">Artigo</option>
                  </select>
                </div>
                <Input label="Gênero (ex: Fantasia)" value={genre} onChange={e => setGenre(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Sinopse</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    minHeight: '100px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Escreva a sinopse do livro aqui..."
                />
              </div>

              <Input label="Número de Páginas" type="number" value={numberOfPages} onChange={e => setNumberOfPages(e.target.value)} required />

              {!editId && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Capa do Livro (Imagem)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setCover(e.target.files[0])}
                    style={{
                      padding: '10px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    required={!editId}
                  />
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" loading={submitting}>
                  {editId ? 'Salvar Alterações' : 'Cadastrar Livro'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
