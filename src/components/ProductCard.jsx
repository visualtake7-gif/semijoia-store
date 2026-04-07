import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ produto, onAddFeedback }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    addItem(produto);
    if (onAddFeedback) onAddFeedback(produto.nome);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={produto.imagem_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'}
          alt={produto.nome}
          className="product-card__image"
          loading="lazy"
        />
        <div className="product-card__overlay">
          <button
            className={`product-card__add-btn ${adding ? 'adding' : ''}`}
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? '✓ Adicionado' : 'Adicionar ao Carrinho'}
          </button>
        </div>
        {produto.destaque && (
          <span className="product-card__badge">Destaque</span>
        )}
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{produto.categoria}</p>
        <h3 className="product-card__name">{produto.nome}</h3>
        <p className="product-card__price">
          {Number(produto.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>
    </article>
  );
}