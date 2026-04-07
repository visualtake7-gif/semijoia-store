import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <p className="footer__logo">AURUM</p>
          <p className="footer__tagline">Semijoias para mulheres<br />que sabem o que querem.</p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Pinterest">PT</a>
            <a href="#" aria-label="TikTok">TK</a>
          </div>
        </div>

        <div className="footer__nav">
          <div className="footer__col">
            <h4>Coleção</h4>
            <Link to="/produtos?categoria=brincos">Brincos</Link>
            <Link to="/produtos?categoria=colares">Colares</Link>
            <Link to="/produtos?categoria=aneis">Anéis</Link>
            <Link to="/produtos?categoria=pulseiras">Pulseiras</Link>
          </div>
          <div className="footer__col">
            <h4>Ajuda</h4>
            <a href="#">Minha conta</a>
            <a href="#">Trocas e devoluções</a>
            <a href="#">Rastrear pedido</a>
            <a href="#">Contato</a>
          </div>
          <div className="footer__col">
            <h4>Informações</h4>
            <a href="#">Sobre nós</a>
            <a href="#">Cuidados com a peça</a>
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de uso</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} AURUM Semijoias. Todos os direitos reservados.</p>
        <p>Feito com ✦ no Brasil</p>
      </div>
    </footer>
  );
}