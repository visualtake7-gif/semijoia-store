import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProdutosDestaque } from '../services/supabase';
import ProductCard from '../components/ProductCard';
import { ToastContainer, useToast } from '../components/Toast';
import './Home.css';

const MOCK_PRODUTOS = [
  { id: '1', nome: 'Brinco Argola Dourada', preco: 89.90, imagem_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600', categoria: 'brincos', destaque: true },
  { id: '2', nome: 'Colar Pérola Minimalista', preco: 149.90, imagem_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', categoria: 'colares', destaque: true },
  { id: '3', nome: 'Anel Solitário Crystal', preco: 79.90, imagem_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', categoria: 'aneis', destaque: true },
  { id: '4', nome: 'Pulseira Elos Finos', preco: 119.90, imagem_url: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600', categoria: 'pulseiras', destaque: true },
];

const CATEGORIAS = [
  { slug: 'brincos', label: 'Brincos', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800', desc: 'Do minimalismo ao statement' },
  { slug: 'colares', label: 'Colares', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', desc: 'Elegância no pescoço' },
  { slug: 'aneis', label: 'Anéis', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', desc: 'Para cada dedo, uma história' },
  { slug: 'pulseiras', label: 'Pulseiras', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800', desc: 'Empilhe com estilo' },
];

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutosDestaque()
      .then((data) => setProdutos(data?.length ? data : MOCK_PRODUTOS))
      .catch(() => setProdutos(MOCK_PRODUTOS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1800&q=80"
            alt="Hero"
          />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content container">
          <p className="hero__eyebrow fade-up">Nova Coleção 2025</p>
          <h1 className="hero__title fade-up" style={{ animationDelay: '0.1s' }}>
            Beleza que<br /><em>transforma</em>
          </h1>
          <p className="hero__subtitle fade-up" style={{ animationDelay: '0.2s' }}>
            Semijoias premium banhadas a ouro 18k.<br />
            Para mulheres que sabem o que querem.
          </p>
          <div className="hero__actions fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/produtos" className="btn-primary">Explorar Coleção</Link>
            <Link to="/produtos?categoria=brincos" className="btn-ghost hero__ghost-btn">Ver Brincos</Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span />
        </div>
      </section>

      {/* ── Manifesto ────────────────────────────── */}
      <section className="manifesto container">
        <div className="manifesto__line" />
        <blockquote className="manifesto__quote fade-up">
          "Cada peça é uma expressão silenciosa de quem você é."
        </blockquote>
        <div className="manifesto__line" />
      </section>

      {/* ── Categorias ───────────────────────────── */}
      <section className="categorias">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Navegue por</p>
            <h2 className="section-title">Nossas <em>Categorias</em></h2>
          </div>
        </div>
        <div className="categorias__grid">
          {CATEGORIAS.map((cat, i) => (
            <Link
              to={`/produtos?categoria=${cat.slug}`}
              key={cat.slug}
              className="categoria-card fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="categoria-card__image-wrap">
                <img src={cat.img} alt={cat.label} />
                <div className="categoria-card__overlay" />
              </div>
              <div className="categoria-card__info">
                <h3>{cat.label}</h3>
                <p>{cat.desc}</p>
                <span className="categoria-card__cta">Ver tudo →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Produtos em Destaque ─────────────────── */}
      <section className="destaques container">
        <div className="section-header">
          <p className="section-label">Selecionados</p>
          <h2 className="section-title">Peças em <em>Destaque</em></h2>
          <Link to="/produtos" className="destaques__ver-mais">Ver tudo →</Link>
        </div>

        {loading ? (
          <div className="destaques__skeleton">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : (
          <div className="destaques__grid">
            {produtos.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard
                  produto={p}
                  onAddFeedback={(nome) => addToast(`${nome} adicionado ao carrinho`)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Banner Médio ─────────────────────────── */}
      <section className="mid-banner">
        <div className="mid-banner__image">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80"
            alt="Banner"
          />
          <div className="mid-banner__overlay" />
        </div>
        <div className="mid-banner__content container">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Qualidade garantida</p>
          <h2 className="mid-banner__title">Banho de ouro<br /><em>18 quilates</em></h2>
          <p className="mid-banner__text">
            Peças hipoalergênicas, duráveis e com acabamento premium.<br />
            Cada detalhe pensado para durar.
          </p>
          <Link to="/produtos" className="btn-ghost" style={{ borderColor: 'white', color: 'white' }}>
            Descobrir
          </Link>
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────── */}
      <section className="diferenciais container">
        <div className="diferenciais__grid">
          {[
            { icon: '✦', title: 'Ouro 18k', desc: 'Banho premium de alta durabilidade' },
            { icon: '◈', title: 'Frete Grátis', desc: 'Para compras acima de R$ 200' },
            { icon: '◇', title: 'Troca Fácil', desc: '30 dias para trocar sem custo' },
            { icon: '◎', title: 'Pagamento Seguro', desc: 'Mercado Pago com proteção total' },
          ].map((d, i) => (
            <div key={i} className="diferencial-item fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="diferencial-item__icon">{d.icon}</span>
              <h4 className="diferencial-item__title">{d.title}</h4>
              <p className="diferencial-item__desc">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────── */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter__inner">
            <div className="newsletter__text">
              <p className="section-label">Fique por dentro</p>
              <h2 className="section-title">Novidades &<br /><em>Exclusividades</em></h2>
            </div>
            <form className="newsletter__form" onSubmit={(e) => {
              e.preventDefault();
              addToast('Obrigada! Você receberá nossas novidades.');
              e.target.reset();
            }}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                required
                className="newsletter__input"
              />
              <button type="submit" className="btn-primary">Inscrever</button>
            </form>
          </div>
        </div>
      </section>

      <ToastContainer toasts={toasts} />
    </main>
  );
}