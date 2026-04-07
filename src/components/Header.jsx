import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner container">
          {/* Left nav */}
          <nav className="header__nav header__nav--left">
            <Link to="/produtos">Coleção</Link>
            <Link to="/produtos?categoria=brincos">Brincos</Link>
            <Link to="/produtos?categoria=colares">Colares</Link>
          </nav>

          {/* Logo */}
          <Link to="/" className="header__logo">
            <span className="header__logo-text">AURUM</span>
            <span className="header__logo-sub">Semijoias</span>
          </Link>

          {/* Right nav */}
          <nav className="header__nav header__nav--right">
            <Link to="/produtos?categoria=aneis">Anéis</Link>
            <Link to="/produtos?categoria=pulseiras">Pulseiras</Link>
            {user ? (
              <button onClick={handleSignOut} className="header__user-btn">Sair</button>
            ) : (
              <Link to="/auth">Conta</Link>
            )}
            <Link to="/carrinho" className="header__cart">
              Carrinho
              {count > 0 && <span className="header__cart-badge">{count}</span>}
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            className={`header__burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__nav">
          <Link to="/produtos" onClick={() => setMenuOpen(false)}>Coleção</Link>
          <Link to="/produtos?categoria=brincos" onClick={() => setMenuOpen(false)}>Brincos</Link>
          <Link to="/produtos?categoria=colares" onClick={() => setMenuOpen(false)}>Colares</Link>
          <Link to="/produtos?categoria=aneis" onClick={() => setMenuOpen(false)}>Anéis</Link>
          <Link to="/produtos?categoria=pulseiras" onClick={() => setMenuOpen(false)}>Pulseiras</Link>
          <Link to="/carrinho" onClick={() => setMenuOpen(false)}>Carrinho {count > 0 && `(${count})`}</Link>
          {user
            ? <button onClick={() => { handleSignOut(); setMenuOpen(false); }}>Sair</button>
            : <Link to="/auth" onClick={() => setMenuOpen(false)}>Minha Conta</Link>
          }
        </nav>
      </div>
    </>
  );
}