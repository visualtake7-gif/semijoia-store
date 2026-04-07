import { Link, useLocation } from 'react-router-dom';
import './CheckoutStatus.css';

const STATUS_CONFIG = {
  sucesso: {
    icon: '✦',
    title: 'Pagamento Confirmado!',
    subtitle: 'Seu pedido foi recebido com sucesso.',
    message: 'Você receberá um e-mail com os detalhes do seu pedido em breve. Obrigada pela compra!',
    color: '#2ecc71',
    cta: 'Continuar Comprando',
    ctaLink: '/produtos',
  },
  falha: {
    icon: '◈',
    title: 'Pagamento não concluído',
    subtitle: 'Houve um problema com seu pagamento.',
    message: 'Não se preocupe, nenhum valor foi cobrado. Você pode tentar novamente ou escolher outra forma de pagamento.',
    color: '#e74c3c',
    cta: 'Tentar Novamente',
    ctaLink: '/checkout',
  },
  pendente: {
    icon: '◇',
    title: 'Pagamento Pendente',
    subtitle: 'Aguardando confirmação do pagamento.',
    message: 'Seu pagamento está sendo processado. Você receberá um e-mail assim que for confirmado. Isso pode levar alguns minutos.',
    color: '#f39c12',
    cta: 'Voltar para a Loja',
    ctaLink: '/produtos',
  },
};

export default function CheckoutStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.falha;

  return (
    <main className="status-page container">
      <div className="status-card fade-up">
        <div className="status-icon" style={{ color: config.color }}>
          {config.icon}
        </div>
        <h1 className="status-title">{config.title}</h1>
        <p className="status-subtitle">{config.subtitle}</p>
        <p className="status-message">{config.message}</p>
        <div className="status-actions">
          <Link to={config.ctaLink} className="btn-primary">{config.cta}</Link>
          <Link to="/" className="btn-ghost">Início</Link>
        </div>
      </div>
    </main>
  );
}