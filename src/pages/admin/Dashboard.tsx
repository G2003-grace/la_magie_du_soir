import AdminLayout from '../../components/layout/AdminLayout';

const KPI_REVENUE = {
  label: 'Total Revenu',
  value: '142.850€',
  change: '+12.4%',
  changeType: 'positive' as const,
  progress: 71.4,
  note: 'Objectif : 200.000€ (Saison 2026)',
};

const KPI_TICKETS = {
  label: 'Billets Vendus',
  value: '2.418',
  change: '+5.2%',
  changeType: 'positive' as const,
  bars: [0.2, 0.4, 0.6, 0.8, 1],
  barHeights: [8, 16, 12, 24, 32],
  note: 'Ventes flash en cours : Catégorie Diamant',
};

const KPI_CANDIDATES = {
  label: 'Candidatures Artistes',
  value: '432',
  change: '+28',
  changeType: 'amber' as const,
  avatars: [
    '/images/avatar-candidat-1.jpg',
    '/images/avatar-candidat-2.jpg',
    '/images/avatar-candidat-3.jpg',
  ],
  extraCount: 429,
  note: 'Dernière audition : Demain 14:00',
};

const SALES_DATA = [
  { month: 'Jan',  height: 96 },
  { month: 'Fév',  height: 160 },
  { month: 'Mar',  height: 128 },
  { month: 'Avr',  height: 224 },
  { month: 'Mai',  height: 256, active: true },
  { month: 'Juin', height: 192 },
];

const ORDERS = [
  { initials: 'AM', name: 'Adrien Malot', event: "Gala d'Ouverture", status: 'paid',    amount: '450€' },
  { initials: 'CD', name: 'Clara Dupont', event: 'Nuit Masquée',    status: 'pending', amount: '120€' },
  { initials: 'BL', name: 'Benoit L.',    event: 'Dîner de Presse', status: 'paid',    amount: '850€' },
];

const DISTRIBUTION = [
  { label: 'Standard', value: 1840, color: '#f7bd48' },
  { label: 'VIP/Gold', value: 578,  color: '#e2c28c' },
  { label: 'Restant',  value: 320,  color: '#353534' },
];

const CMS_LINKS = [
  { icon: '/images/icon-cms-program.svg',  label: 'Modifier le Programme', lines: 2, large: true },
  { icon: '/images/icon-cms-gallery.svg',  label: 'Galerie Presse',        lines: 1 },
  { icon: '/images/icon-cms-announce.svg', label: 'Annonce Flash',         lines: 1 },
];

function DonutChart() {
  const total = DISTRIBUTION.reduce((s, d) => s + d.value, 0);
  const sold = DISTRIBUTION.filter(d => d.label !== 'Restant').reduce((s, d) => s + d.value, 0);
  const percentSold = Math.round((sold / total) * 100);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = DISTRIBUTION.map(d => {
    const len = (d.value / total) * circumference;
    const offset = cumulative;
    cumulative += len;
    return { color: d.color, len, offset };
  });

  return (
    <div className="donut">
      <svg viewBox="0 0 200 200" width="192" height="192" className="donut__svg" aria-hidden="true">
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={`${s.len} ${circumference - s.len}`}
            strokeDashoffset={-s.offset}
            transform="rotate(-90 100 100)"
          />
        ))}
      </svg>
      <div className="donut__center">
        <span className="donut__value">{percentSold}%</span>
        <span className="donut__label">Vendus</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AdminLayout>
      {/* ─── HEADER ─── */}
      <header className="dashboard__header">
        <div className="dashboard__title-block">
          <h1 className="dashboard__title">Tableau de Bord</h1>
          <p className="dashboard__subtitle">
            Surveillez l'excellence de votre événement en temps réel.
          </p>
        </div>
        <div className="dashboard__actions">
          <button type="button" className="dashboard__btn dashboard__btn--secondary">
            <img src="/images/icon-export.svg" alt="" />
            <span>Exporter les rapports</span>
          </button>
          <button type="button" className="dashboard__btn dashboard__btn--primary">
            <img src="/images/icon-plus.svg" alt="" />
            <span>Nouvel Événement</span>
          </button>
        </div>
      </header>

      {/* ─── KPI CARDS ─── */}
      <section className="kpi-grid">
        {/* KPI 1 — Revenue */}
        <article className="kpi">
          <span className="kpi__decor" aria-hidden="true" />
          <span className="kpi__label">{KPI_REVENUE.label}</span>
          <div className="kpi__value-row">
            <span className="kpi__value">{KPI_REVENUE.value}</span>
            <span className={`kpi__change kpi__change--${KPI_REVENUE.changeType}`}>
              {KPI_REVENUE.change}
            </span>
          </div>
          <div className="kpi__progress">
            <div
              className="kpi__progress-fill"
              style={{ width: `${KPI_REVENUE.progress}%` }}
            />
          </div>
          <span className="kpi__note">{KPI_REVENUE.note}</span>
        </article>

        {/* KPI 2 — Tickets */}
        <article className="kpi">
          <span className="kpi__label">{KPI_TICKETS.label}</span>
          <div className="kpi__value-row">
            <span className="kpi__value">{KPI_TICKETS.value}</span>
            <span className={`kpi__change kpi__change--${KPI_TICKETS.changeType}`}>
              {KPI_TICKETS.change}
            </span>
          </div>
          <div className="kpi__minibars">
            {KPI_TICKETS.barHeights.map((h, i) => (
              <span
                key={i}
                className="kpi__minibar"
                style={{
                  height: `${h}px`,
                  background: `rgba(247, 189, 72, ${KPI_TICKETS.bars[i]})`,
                }}
              />
            ))}
          </div>
          <span className="kpi__note">{KPI_TICKETS.note}</span>
        </article>

        {/* KPI 3 — Candidates */}
        <article className="kpi">
          <span className="kpi__label">{KPI_CANDIDATES.label}</span>
          <div className="kpi__value-row">
            <span className="kpi__value">{KPI_CANDIDATES.value}</span>
            <span className={`kpi__change kpi__change--${KPI_CANDIDATES.changeType}`}>
              {KPI_CANDIDATES.change}
            </span>
          </div>
          <div className="kpi__avatars">
            {KPI_CANDIDATES.avatars.map((a, i) => (
              <img key={i} src={a} alt="" className="kpi__avatar" />
            ))}
            <span className="kpi__avatar kpi__avatar--extra">+{KPI_CANDIDATES.extraCount}</span>
          </div>
          <span className="kpi__note">{KPI_CANDIDATES.note}</span>
        </article>
      </section>

      {/* ─── MAIN GRID ─── */}
      <section className="dashboard-main">
        {/* Left column */}
        <div className="dashboard-main__left">
          <article className="panel">
            <header className="panel__header">
              <h3 className="panel__title">Évolution des Ventes</h3>
              <div className="panel__tabs">
                <button type="button" className="panel__tab panel__tab--active">Mensuel</button>
                <button type="button" className="panel__tab">Hebdo</button>
              </div>
            </header>
            <div className="sales-chart">
              {SALES_DATA.map(s => (
                <div key={s.month} className="sales-bar">
                  <div
                    className={`sales-bar__fill ${s.active ? 'sales-bar__fill--active' : ''}`}
                    style={{ height: `${s.height}px` }}
                  >
                    <span className="sales-bar__glow" />
                  </div>
                  <span className={`sales-bar__label ${s.active ? 'sales-bar__label--active' : ''}`}>
                    {s.month}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <header className="panel__header">
              <h3 className="panel__title">Dernières Commandes</h3>
            </header>
            <div className="orders">
              <div className="orders__row orders__row--head">
                <span>Client</span>
                <span>Événement</span>
                <span>Statut</span>
                <span className="orders__col-right">Montant</span>
              </div>
              {ORDERS.map(o => (
                <div key={o.name} className="orders__row">
                  <div className="orders__client">
                    <span className="orders__avatar">{o.initials}</span>
                    <span className="orders__name">{o.name}</span>
                  </div>
                  <span className="orders__event">{o.event}</span>
                  <span className={`orders__status orders__status--${o.status}`}>
                    {o.status === 'paid' ? 'Payé' : 'En cours'}
                  </span>
                  <span className="orders__amount">{o.amount}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Right column */}
        <div className="dashboard-main__right">
          <article className="panel panel--padded">
            <h3 className="panel__title">Répartition Billets</h3>
            <DonutChart />
            <ul className="distribution">
              {DISTRIBUTION.map(d => (
                <li key={d.label}>
                  <span className="distribution__dot" style={{ background: d.color }} />
                  <span className="distribution__label">{d.label}</span>
                  <span className="distribution__value">{d.value.toLocaleString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel panel--padded">
            <h3 className="panel__title">Action Rapides CMS</h3>
            <div className="cms-links">
              {CMS_LINKS.map(l => (
                <a
                  key={l.label}
                  href="#"
                  className={`cms-link ${l.large ? 'cms-link--large' : ''}`}
                >
                  <div className="cms-link__inner">
                    <img src={l.icon} alt="" className="cms-link__icon" />
                    <span className="cms-link__label">{l.label}</span>
                  </div>
                  <img src="/images/icon-chevron-right.svg" alt="" className="cms-link__chevron" />
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </AdminLayout>
  );
}
