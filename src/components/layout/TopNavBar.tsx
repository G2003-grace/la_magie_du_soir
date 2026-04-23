import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',            label: 'Accueil' },
  { path: '/a-propos',    label: 'À propos' },
  { path: '/programme',   label: 'Programme' },
  { path: '/billetterie', label: 'Billetterie' },
  { path: '/presse',      label: 'Presse' },
  { path: '/contact',     label: 'Contact' },
];

export default function TopNavBar() {
  const { pathname } = useLocation();

  return (
    <header className="topnav">
      <div className="topnav__inner">
        <Link to="/" className="topnav__brand">La Magie du Soir 2026</Link>

        <nav className="topnav__links">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`topnav__link${pathname === item.path ? ' topnav__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topnav__cta">
          <Link to="/admin/login" className="topnav__admin">Admin</Link>
          <Link to="/billetterie" className="btn-primary">Réserver</Link>
        </div>
      </div>
      <div className="topnav__divider" />
    </header>
  );
}
