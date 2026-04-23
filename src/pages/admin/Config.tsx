import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const ADMINS = [
  { avatar: '/images/config-admin-1.jpg', name: 'Jean-Pierre Lefebvre', role: 'Gestionnaire billetterie' },
  { avatar: '/images/config-admin-2.jpg', name: 'Sophie Morel',         role: 'Directrice artistique' },
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9.5V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5z" />
      <line x1="13" y1="5" x2="13" y2="19" strokeDasharray="2 2" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function Config() {
  const [eventDate,     setEventDate]     = useState('2026-11-15');
  const [doorsOpen,     setDoorsOpen]     = useState('19:00');
  const [venue,         setVenue]         = useState('Palais des Congrès, Bénin');

  const [vipQuota,      setVipQuota]      = useState('150');
  const [vipPrice,      setVipPrice]      = useState('450');
  const [standardQuota, setStandardQuota] = useState('800');
  const [standardPrice, setStandardPrice] = useState('120');

  const [supportEmail,  setSupportEmail]  = useState('contact@lamagiedusoir.fr');
  const [supportPhone,  setSupportPhone]  = useState('+33 1 45 67 89 00');

  return (
    <AdminLayout
      topBar
      showSearch={false}
      adminLabel={{
        name: 'Admin Principal',
        subtitle: 'Haute surveillance',
        avatar: '/images/admin-topbar-avatar-v3.jpg',
      }}
      footer={false}
    >
      {/* ─── HEADER ─── */}
      <header className="config__header">
        <div className="config__title-block">
          <span className="config__kicker">Architecture du système</span>
          <h1 className="config__title">Configuration Générale</h1>
        </div>
        <div className="config__actions">
          <button type="button" className="config__btn config__btn--secondary">
            Réinitialiser
          </button>
          <button type="button" className="config__btn config__btn--primary">
            Enregistrer les modifications
          </button>
        </div>
      </header>

      {/* ─── MAIN GRID ─── */}
      <section className="config-grid">
        {/* LEFT COLUMN */}
        <div className="config-col config-col--left">
          {/* Paramètres de l'Événement */}
          <article className="config-card config-card--glass">
            <div className="config-card__decor" aria-hidden="true" />
            <header className="config-card__head">
              <span className="config-card__icon"><CalendarIcon /></span>
              <h3>Paramètres de l'Événement</h3>
            </header>
            <div className="config-card__body config-card__body--grid">
              <div className="config-field">
                <label>Date de cérémonie</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                />
              </div>
              <div className="config-field">
                <label>Ouverture des portes</label>
                <input
                  type="time"
                  value={doorsOpen}
                  onChange={e => setDoorsOpen(e.target.value)}
                />
              </div>
              <div className="config-field config-field--full">
                <label>Lieu de réception</label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                />
              </div>
            </div>
          </article>

          {/* Quotas & Tarifs */}
          <article className="config-card config-card--glass">
            <header className="config-card__head">
              <span className="config-card__icon"><TicketIcon /></span>
              <h3>Gestion des Quotas &amp; Tarifs</h3>
            </header>
            <div className="config-card__body">
              <div className="config-quota">
                <div className="config-quota__info">
                  <span className="config-quota__name">Pass Prestige (VIP)</span>
                  <span className="config-quota__desc">Accès loge et dîner gastronomique</span>
                </div>
                <div className="config-quota__inputs">
                  <div className="config-quota-field">
                    <label>Quota</label>
                    <input
                      type="number"
                      value={vipQuota}
                      onChange={e => setVipQuota(e.target.value)}
                    />
                  </div>
                  <div className="config-quota-field config-quota-field--price">
                    <label>Prix (€)</label>
                    <input
                      type="number"
                      value={vipPrice}
                      onChange={e => setVipPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="config-quota">
                <div className="config-quota__info">
                  <span className="config-quota__name">Accès Standard</span>
                  <span className="config-quota__desc">Accès gala et cocktail dînatoire</span>
                </div>
                <div className="config-quota__inputs">
                  <div className="config-quota-field">
                    <label>Quota</label>
                    <input
                      type="number"
                      value={standardQuota}
                      onChange={e => setStandardQuota(e.target.value)}
                    />
                  </div>
                  <div className="config-quota-field config-quota-field--price">
                    <label>Prix (€)</label>
                    <input
                      type="number"
                      value={standardPrice}
                      onChange={e => setStandardPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN */}
        <div className="config-col config-col--right">
          {/* Administrateurs */}
          <article className="config-card config-card--accent">
            <header className="config-card__head">
              <span className="config-card__icon config-card__icon--gold"><UserIcon /></span>
              <h3>Administrateurs</h3>
            </header>
            <div className="config-card__body">
              <ul className="config-admins">
                {ADMINS.map(a => (
                  <li key={a.name} className="config-admin">
                    <img src={a.avatar} alt="" />
                    <div>
                      <span className="config-admin__name">{a.name}</span>
                      <span className="config-admin__role">{a.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className="config-invite">
                <PlusIcon />
                <span>Inviter un administrateur</span>
              </button>
            </div>
          </article>

          {/* Contact Public */}
          <article className="config-card config-card--glass">
            <header className="config-card__head">
              <span className="config-card__icon"><HelpIcon /></span>
              <h3>Contact Public</h3>
            </header>
            <div className="config-card__body">
              <div className="config-field">
                <label>Email support</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                />
              </div>
              <div className="config-field">
                <label>Téléphone conciergerie</label>
                <input
                  type="tel"
                  value={supportPhone}
                  onChange={e => setSupportPhone(e.target.value)}
                />
              </div>
            </div>
          </article>

          {/* Zone Critique */}
          <article className="config-card config-card--danger">
            <header className="config-danger__head">
              <WarningIcon />
              <span>Zone critique</span>
            </header>
            <p className="config-danger__desc">
              Suspendre l'ensemble des ventes de billets ou réinitialiser le système
              vers l'édition 2027.
            </p>
            <button type="button" className="config-danger__btn">
              Mode maintenance
            </button>
          </article>
        </div>
      </section>

      {/* ─── FOOTER INLINE ─── */}
      <footer className="config-footer">
        <div className="config-footer__left">
          <span>© 2026 La Magie du Soir</span>
          <span className="config-footer__dot" aria-hidden="true" />
          <span>Système d'exploitation v4.2.1</span>
        </div>
        <nav className="config-footer__links">
          <a href="#">Audit logs</a>
          <a href="#">Sécurité SSL</a>
          <a href="#">Politique admin</a>
        </nav>
      </footer>
    </AdminLayout>
  );
}
