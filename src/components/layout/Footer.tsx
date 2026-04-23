import { Link } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Mentions légales',             to: '/mentions-legales' },
  { label: 'Politique de confidentialité', to: '/confidentialite' },
  { label: 'Conditions générales',         to: '/cgu' },
  { label: 'Dossier de presse',            to: '/presse-kit' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <div className="footer__brand">La Magie du Soir</div>
        <div className="footer__copyright">
          © 2026 La Magie du Soir. Célébrer l'excellence africaine.
        </div>
      </div>

      <nav className="footer__links">
        {LEGAL_LINKS.map(link => (
          <Link key={link.to} to={link.to} className="footer__link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="footer__socials">
        <a href="#" className="footer__social" aria-label="Partager">
          <img src="/images/icon-share.svg" alt="" />
        </a>
        <a href="#" className="footer__social" aria-label="Site web">
          <img src="/images/icon-globe.svg" alt="" />
        </a>
      </div>
    </footer>
  );
}
