import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',            label: 'Accueil' },
  { path: '/a-propos',    label: 'À propos' },
  { path: '/programme',   label: 'Programme' },
  { path: '/billetterie', label: 'Billetterie' },
  { path: '/presse',      label: 'Presse' },
  { path: '/contact',     label: 'Contact' },
  { path: '/admin/login', label: 'Admin' },
];

export default function TopNavBar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <header className="topnav">
      <div className="topnav__inner">
        <Link to="/" className="topnav__brand" onClick={close}>La Magie du Soir 2026</Link>

        <button
          type="button"
          className={`topnav__toggle${isOpen ? ' topnav__toggle--open' : ''}`}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`topnav__links${isOpen ? ' topnav__links--open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={close}
              className={`topnav__link${pathname === item.path ? ' topnav__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topnav__cta">
          <Link to="/billetterie" className="btn-primary" onClick={close}>Réserver</Link>
        </div>
      </div>
      <div className="topnav__divider" />
    </header>
  );
}
