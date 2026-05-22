import { NavLink } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Mentions Légales', to: '/mentions-legales' },
  { label: 'Confidentialité',  to: '/confidentialite'  },
  { label: 'Partenaires',      to: '/partenaires'      },
  { label: 'Accès Presse',     to: '/presse'           },
];

export default function FooterPresse() {
  return (
    <footer className="footer footer--presse">
      <div className="footer__left">
        <div className="footer__brand">LA MAGIE DU SOIR</div>
        <div className="footer__copyright">
          © 2026 La Magie du Soir. L'excellence d'une nuit éternelle.
        </div>
      </div>

      <nav className="footer__links">
        {LEGAL_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `footer__link${isActive ? ' footer__link--active' : ''}`
            }
          >
            {link.label}
          </NavLink>
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
