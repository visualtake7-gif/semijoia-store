import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Carrinho.css';

export default function Carrinho() {
  const { cart, total, removeItem, updateQty, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="carrinho-page container">
        <div className="carrinho-empty">
          <p className="carrinho-empty__icon">◈</p>
          <h2>Seu carrinho está vazio</h2>
          <p>Explore nossa coleção e adicione peças que te encantam.</p>
          <Link to="/produtos" className="btn-primary">Explorar Coleção</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="carrinho-page container">
      <div className="carrinho-header">
        <div>
          <p className="section-label">Seu carrinho</p>
          <h1 className="section-title">Itens <em>Selecionados</em></h1>
        </div>
        <button className="carrinho-clear" onClick={clearCart}>Limpar carrinho</button>
      </div>

      <div className="carrinho-layout">
        {/* Items list */}
        <div className="carrinho-items">
          {cart.map((item) => (
            <div key={item.id} className="carrinho-item fade-up">
              <div className="carrinho-item__image">
                <img
                  src={item.imagem_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300'}
                  alt={item.nome}
                />
              </div>
              <div className="carrinho-item__info">
                <p className="carrinho-item__cat">{item.categoria}</p>
                <h3 className="carrinho-item__name">{item.nome}</h3>
                <p className="carrinho-item__price">
                  {Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="carrinho-item__controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.quantidade - 1)}
                  >−</button>
                  <span className="qty-value">{item.quantidade}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.quantidade + 1)}
                  >+</button>
                </div>
                <p className="carrinho-item__subtotal">
                  {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <button className="carrinho-item__remove" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="carrinho-summary">
          <h2 className="carrinho-summary__title">Resumo</h2>
          <div className="carrinho-summary__lines">
            {cart.map((item) => (
              <div key={item.id} className="summary-line">
                <span>{item.nome} × {item.quantidade}</span>
                <span>{(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            ))}
          </div>
          <div className="carrinho-summary__divider" />
          <div className="carrinho-summary__total">
            <span>Total</span>
            <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </div>
          {total >= 200 && (
            <p className="carrinho-summary__frete">✦ Frete grátis incluído</p>
          )}
          <Link to="/checkout" className="btn-primary carrinho-summary__cta">
            Finalizar Compra
          </Link>
          <Link to="/produtos" className="carrinho-summary__continue">
            ← Continuar comprando
          </Link>
        </aside>
      </div>
    </main>
  );
}