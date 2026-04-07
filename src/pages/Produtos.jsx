import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProdutos } from '../services/supabase';
import ProductCard from '../components/ProductCard';
import { ToastContainer, useToast } from '../components/Toast';
import './Produtos.css';

const CATEGORIAS = [
  { slug: 'todos', label: 'Todos' },
  { slug: 'brincos', label: 'Brincos' },
  { slug: 'colares', label: 'Colares' },
  { slug: 'aneis', label: 'Anéis' },
  { slug: 'pulseiras', label: 'Pulseiras' },
];

const MOCK = [
  { id: '1', nome: 'Brinco Argola Dourada', preco: 89.90, imagem_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600', categoria: 'brincos', destaque: true },
  { id: '2', nome: 'Colar Pérola Minimalista', preco: 149.90, imagem_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', categoria: 'colares', destaque: true },
  { id: '3', nome: 'Anel Solitário Crystal', preco: 79.90, imagem_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', categoria: 'aneis', destaque: true },
  { id: '4', nome: 'Pulseira Elos Finos', preco: 119.90, imagem_url: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600', categoria: 'pulseiras', destaque: true },
  { id: '5', nome: 'Brinco Ear Cuff Folha', preco: 65.90, imagem_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600', categoria: 'brincos', destaque: false },
  { id: '6', nome: 'Colar Choker Corrente', preco: 99.90, imagem_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', categoria: 'colares', destaque: false },
  { id: '7', nome: 'Anel Stackable Rose', preco: 59.90, imagem_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', categoria: 'aneis', destaque: false },
  { id: '8', nome: 'Pulseira Pingente Coração', preco: 89.90, imagem_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600', categoria: 'pulseiras', destaque: false },
];

export default function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || 'todos';

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(categoriaParam);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    setCategoria(categoriaParam);
  }, [categoriaParam]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetchProdutos({ categoria: categoria === 'todos' ? null : categoria, busca })
        .then((data) => {
          if (data?.length) {
            setProdutos(data);
          } else {
            // Fallback mock filtrado
            let filtered = MOCK;
            if (categoria !== 'todos') filtered = filtered.filter(p => p.categoria === categoria);
            if (busca) filtered = filtered.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
            setProdutos(filtered);
          }
        })
        .catch(() => {
          let filtered = MOCK;
          if (categoria !== 'todos') filtered = filtered.filter(p => p.categoria === categoria);
          if (busca) filtered = filtered.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
          setProdutos(filtered);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [categoria, busca]);

  const handleCategoria = (slug) => {
    setCategoria(slug);
    setSearchParams(slug !== 'todos' ? { categoria: slug } : {});
  };

  return (
    <main className="produtos-page">
      {/* Page header */}
      <section className="produtos-hero container">
        <div className="produtos-hero__inner">
          <p className="section-label">Nossa Coleção</p>
          <h1 className="section-title">
            {categoria === 'todos' ? <>Todas as <em>Peças</em></> : <em>{CATEGORIAS.find(c => c.slug === categoria)?.label}</em>}
          </h1>
          <p className="produtos-hero__count">
            {loading ? '...' : `${produtos.length} ${produtos.length === 1 ? 'peça' : 'peças'}`}
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* Filters */}
      <section className="produtos-filters container">
        <div className="produtos-filters__cats">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.slug}
              className={`filter-btn ${categoria === cat.slug ? 'filter-btn--active' : ''}`}
              onClick={() => handleCategoria(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="produtos-filters__search">
          <input
            type="text"
            placeholder="Buscar peças..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
          {busca && (
            <button className="search-clear" onClick={() => setBusca('')}>✕</button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="produtos-grid-section container">
        {loading ? (
          <div className="produtos-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="produtos-empty">
            <p className="produtos-empty__icon">◈</p>
            <h3>Nenhuma peça encontrada</h3>
            <p>Tente outros filtros ou termos de busca.</p>
            <button className="btn-ghost" onClick={() => { setBusca(''); handleCategoria('todos'); }}>
              Ver todas as peças
            </button>
          </div>
        ) : (
          <div className="produtos-grid">
            {produtos.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay: `${(i % 8) * 0.06}s` }}>
                <ProductCard
                  produto={p}
                  onAddFeedback={(nome) => addToast(`${nome} adicionado ao carrinho`)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <ToastContainer toasts={toasts} />
    </main>
  );
}   