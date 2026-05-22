import { NavLink } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Legal Notice',     to: '/mentions-legales' },
  { label: 'Privacy Policy',   to: '/confidentialite'  },
  { label: 'Terms of Service', to: '/cgu'              },
  { label: 'Press Kit',        to: '/presse-kit'       },
];

export default function FooterAccueil() {
  return (
    <footer className="footer footer--accueil">
      <div className="footer__left">
        <div className="footer__brand">La Magie du Soir</div>
        <div className="footer__copyright">
          © 2026 La Magie du Soir. Celebrating African Excellence.
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
        <a href="mailto:contact@lamagiedusoir.fr" className="footer__social" aria-label="Contact email">
          <img src="/images/icon-mail.svg" alt="" />
        </a>
      </div>
    </footer>
  );
}
