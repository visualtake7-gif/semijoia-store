import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Produtos = lazy(() => import('./pages/Produtos'));
const Carrinho = lazy(() => import('./pages/Carrinho'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Auth = lazy(() => import('./pages/Auth'));
const CheckoutStatus = lazy(() => import('./pages/CheckoutStatus'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: '1.5rem',
      fontWeight: 300,
      fontStyle: 'italic',
      color: 'var(--gray-light)',
      letterSpacing: '0.1em',
    }}>
      AURUM
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout/sucesso" element={<CheckoutStatus status="sucesso" />} />
          <Route path="/checkout/falha" element={<CheckoutStatus status="falha" />} />
          <Route path="/checkout/pendente" element={<CheckoutStatus status="pendente" />} />
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', paddingTop: '6rem' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 300 }}>404</h1>
              <p style={{ color: 'var(--gray)' }}>Página não encontrada.</p>
              <a href="/" className="btn-primary">Ir para o início</a>
            </div>
          } />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}