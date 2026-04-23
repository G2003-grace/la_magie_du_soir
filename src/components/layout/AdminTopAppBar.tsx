import { Link } from 'react-router-dom';

export default function AdminTopAppBar() {
  return (
    <header className="admin-appbar">
      <nav className="admin-appbar__inner">
        <Link to="/admin/login" className="admin-appbar__brand">
          <img src="/images/admin-logo-header.jpg" alt="" className="admin-appbar__logo" />
          <span className="admin-appbar__title">La Magie du Soir</span>
        </Link>

        <div className="admin-appbar__actions">
          <button type="button" className="admin-appbar__action" aria-label="Statut sécurité">
            <img src="/images/icon-admin-lock.svg" alt="" />
          </button>
          <button type="button" className="admin-appbar__action" aria-label="Aide">
            <img src="/images/icon-admin-other.svg" alt="" />
          </button>
        </div>
      </nav>
    </header>
  );
}
