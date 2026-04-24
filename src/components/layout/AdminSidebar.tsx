import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  external?: boolean;
}

const NAV: NavItem[] = [
  { path: '/admin/dashboard',                     label: "Vue d'ensemble", icon: '/images/sidebar-icon-dashboard.svg' },
  { path: '/admin/billetterie',                   label: 'Billetterie',    icon: '/images/sidebar-icon-billetterie.svg' },
  { path: 'https://www.lamagiedusoir.com/admin',  label: 'Candidats',      icon: '/images/sidebar-icon-candidats.svg', external: true },
  { path: '/admin/cms',                           label: 'Contenu CMS',    icon: '/images/sidebar-icon-cms.svg' },
  { path: '/admin/config',                        label: 'Configuration',  icon: '/images/sidebar-icon-config.svg' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <header className="admin-sidebar__head">
        <div className="admin-sidebar__head-row">
          <img src="/images/logo-seal-admin.jpg" alt="" className="admin-sidebar__seal" />
          <h2 className="admin-sidebar__brand">Tableau de Bord</h2>
        </div>
        <span className="admin-sidebar__kicker">Édition 2026</span>
      </header>

      <nav className="admin-sidebar__nav">
        {NAV.map(item => {
          if (item.external) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-sidebar__link"
              >
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
              </a>
            );
          }
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__link ${active ? 'admin-sidebar__link--active' : ''}`}
            >
              <img src={item.icon} alt="" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar__bottom">
        <Link to="/" className="admin-sidebar__cta">
          Accéder au gala
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="admin-sidebar__logout"
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
