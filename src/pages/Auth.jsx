import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(redirect);
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__split">
        {/* Left visual */}
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=80"
            alt="Semijoias"
          />
          <div className="auth-visual__overlay" />
          <div className="auth-visual__text">
            <p className="auth-visual__brand">AURUM</p>
            <p className="auth-visual__tagline">Elegância que<br /><em>você merece</em></p>
          </div>
        </div>

        {/* Right form */}
        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
                onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              >
                Entrar
              </button>
              <button
                className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
                onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
              >
                Cadastrar
              </button>
            </div>

            <h1 className="auth-title">
              {mode === 'login' ? <>Bem-vinda <em>de volta</em></> : <>Crie sua <em>conta</em></>}
            </h1>

            {success ? (
              <div className="auth-success">
                <p>{success}</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Ir para a loja</button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                    required
                    minLength={6}
                  />
                </div>

                {error && <div className="auth-error"><p>{error}</p></div>}

                <button
                  type="submit"
                  className={`btn-primary auth-submit ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading
                    ? <span className="checkout-spinner" />
                    : mode === 'login' ? 'Entrar' : 'Criar conta'
                  }
                </button>
              </form>
            )}

            <p className="auth-footer">
              {mode === 'login'
                ? <>Não tem conta?{' '}<button onClick={() => setMode('signup')}>Cadastre-se</button></>
                : <>Já tem conta?{' '}<button onClick={() => setMode('login')}>Entrar</button></>
              }
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}