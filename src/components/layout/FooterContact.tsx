import { NavLink } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Mentions Légales', to: '/mentions-legales' },
  { label: 'Confidentialité',  to: '/confidentialite'  },
  { label: 'Partenaires',      to: '/partenaires'      },
  { label: 'Accès Presse',     to: '/presse'           },
];

export default function FooterContact() {
  return (
    <footer className="footer footer--contact">
      <div className="footer__brand">La Magie du Soir</div>

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

      <div className="footer__copyright">
        © 2026 La Magie du Soir. L'excellence d'une nuit éternelle.
      </div>
    </footer>
  );
}
