import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { criarPedido } from '../services/supabase';
import './Checkout.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cart.length === 0) {
    return (
      <main className="checkout-page container">
        <div className="checkout-empty">
          <h2>Carrinho vazio</h2>
          <Link to="/produtos" className="btn-primary">Voltar para a loja</Link>
        </div>
      </main>
    );
  }

  const handleFinalizarCompra = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Criar pedido no Supabase (se logada)
      let pedidoId = null;
      if (user) {
        const pedido = await criarPedido({
          usuario_id: user.id,
          total,
          items: cart,
        });
        pedidoId = pedido.id;
      }

      // 2. Criar preferência no Mercado Pago via backend
      const res = await fetch(`${BACKEND_URL}/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({
            id: i.id,
            nome: i.nome,
            preco: i.preco,
            quantidade: i.quantidade,
          })),
          usuario_id: user?.id || null,
          pedido_id: pedidoId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar pagamento.');
      }

      const { init_point, sandbox_init_point } = await res.json();

      // 3. Redirecionar para Mercado Pago
      // Em produção usa init_point, em sandbox usa sandbox_init_point
      const paymentUrl = import.meta.env.DEV ? sandbox_init_point : init_point;
      clearCart();
      window.location.href = paymentUrl;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page container">
      <div className="checkout-header">
        <p className="section-label">Finalizar</p>
        <h1 className="section-title">Resumo do <em>Pedido</em></h1>
      </div>

      <div className="checkout-layout">
        {/* Order summary */}
        <div className="checkout-items">
          <h2 className="checkout-section-title">Seus itens</h2>
          {cart.map((item) => (
            <div key={item.id} className="checkout-item fade-up">
              <div className="checkout-item__image">
                <img
                  src={item.imagem_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200'}
                  alt={item.nome}
                />
              </div>
              <div className="checkout-item__info">
                <p className="checkout-item__cat">{item.categoria}</p>
                <h3 className="checkout-item__name">{item.nome}</h3>
                <p className="checkout-item__qty">Qty: {item.quantidade}</p>
              </div>
              <p className="checkout-item__price">
                {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          ))}

          {!user && (
            <div className="checkout-login-notice">
              <p>
                <Link to="/auth?redirect=/checkout">Faça login</Link> para salvar seu histórico de pedidos.
              </p>
            </div>
          )}
        </div>

        {/* Payment panel */}
        <aside className="checkout-panel">
          <h2 className="checkout-section-title">Pagamento</h2>

          <div className="checkout-totals">
            <div className="checkout-totals__row">
              <span>Subtotal</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="checkout-totals__row">
              <span>Frete</span>
              <span>{total >= 200 ? 'Grátis' : 'R$ 15,00'}</span>
            </div>
            <div className="checkout-totals__divider" />
            <div className="checkout-totals__row checkout-totals__row--total">
              <strong>Total</strong>
              <strong>
                {(total >= 200 ? total : total + 15).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          </div>

          {error && (
            <div className="checkout-error">
              <p>⚠ {error}</p>
            </div>
          )}

          <button
            className={`btn-primary checkout-pay-btn ${loading ? 'loading' : ''}`}
            onClick={handleFinalizarCompra}
            disabled={loading}
          >
            {loading ? (
              <span className="checkout-spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Pagar com Mercado Pago
              </>
            )}
          </button>

          <div className="checkout-security">
            <p>🔒 Ambiente seguro — SSL 256 bits</p>
            <p>Parcelamento em até 12× sem juros</p>
          </div>

          <div className="checkout-payment-icons">
            <span>Visa</span>
            <span>Master</span>
            <span>Pix</span>
            <span>Boleto</span>
          </div>

          <Link to="/carrinho" className="checkout-back">
            ← Editar carrinho
          </Link>
        </aside>
      </div>
    </main>
  );
}