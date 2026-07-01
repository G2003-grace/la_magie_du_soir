import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Mentions Légales', to: '/mentions-legales' },
  { label: 'Confidentialité',  to: '/confidentialite' },
  { label: 'Accès Presse',     to: '/presse' },
  { label: 'FAQ',              to: '/faq' },
];

export default function SiteFooter({
  brand = 'Gala de Prestige',
  copyright = '© 2024 Gala de Prestige. Tous droits réservés.',
}: { brand?: string; copyright?: string }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">{brand}</div>

      <nav className="site-footer__links">
        {LINKS.map(link => (
          <Link key={link.to} to={link.to} className="site-footer__link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="site-footer__copyright">
        {copyright}
      </div>
    </footer>
  );
}
