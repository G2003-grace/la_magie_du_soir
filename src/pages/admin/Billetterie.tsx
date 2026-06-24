import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

type CategoryKey = 'all' | 'standard' | 'vip' | 'prestige';
type PeriodKey = 'day' | 'week' | 'month' | 'year';

const REVENUE_CARDS = [
  {
    key: 'standard',
    label: 'Revenus Standard',
    amount: '42,850 €',
    trend: '+12% vs 2025',
    trendType: 'up' as const,
    decor: '/images/decor-standard.svg',
    featured: false,
  },
  {
    key: 'vip',
    label: 'Accès VIP',
    amount: '78,200 €',
    trend: 'Vente Rapide',
    trendType: 'star' as const,
    decor: '/images/decor-vip.svg',
    featured: true,
  },
  {
    key: 'prestige',
    label: 'Tables Prestige',
    amount: '124,000 €',
    trend: '92% de remplissage',
    trendType: 'chart' as const,
    decor: '/images/decor-prestige.svg',
    featured: false,
  },
];

type SaleCategory = 'table-prestige' | 'vip-access' | 'standard';
type SaleStatus = 'confirmed' | 'pending';

interface Sale {
  initials: string;
  gradient: 'gold' | 'amber' | 'beige';
  name: string;
  email: string;
  orderId: string;
  category: SaleCategory;
  status: SaleStatus;
  amount: string;
}

const SALES: Sale[] = [
  { initials: 'JL', gradient: 'gold',  name: 'Julien Lefebvre',   email: 'julien.l@example.com',      orderId: '#MS-2026-9841', category: 'table-prestige', status: 'confirmed', amount: '1,200.00 €' },
  { initials: 'AM', gradient: 'amber', name: 'Alice Moreau',      email: 'a.moreau@corporate.fr',     orderId: '#MS-2026-9839', category: 'vip-access',     status: 'confirmed', amount: '450.00 €'   },
  { initials: 'DR', gradient: 'beige', name: 'David Rossi',       email: 'david.rossi@web.it',        orderId: '#MS-2026-9835', category: 'standard',       status: 'pending',   amount: '150.00 €'   },
  { initials: 'SC', gradient: 'gold',  name: 'Sophie Chevalier',  email: 'sophie.chev@outlook.com',   orderId: '#MS-2026-9830', category: 'table-prestige', status: 'confirmed', amount: '1,200.00 €' },
];

const CATEGORY_LABELS: Record<SaleCategory, string> = {
  'table-prestige': 'Table Prestige',
  'vip-access':     'VIP Access',
  'standard':       'Standard',
};

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
  
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function ArrowRightSmall() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Billetterie() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryKey>('all');
  const [period, setPeriod] = useState<PeriodKey>('day');

  return (
    <AdminLayout topBar searchPlaceholder="Rechercher une commande..." footer={false}>
      <div className="billetterie-bg" aria-hidden="true">
        <img src="/images/bg-texture-admin.png" alt="" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="billetterie__header">
        <div className="billetterie__title-block">
          <h1 className="billetterie__title">Billetterie &amp; Commandes</h1>
          <p className="billetterie__subtitle">
            Gestion des revenus et suivi des réservations en temps réel.
          </p>
        </div>
        <div className="billetterie__actions">
          <button type="button" className="billetterie__btn billetterie__btn--secondary">
            <DownloadIcon />
            <span>Exporter Rapport</span>
          </button>
          <button type="button" className="billetterie__btn billetterie__btn--primary">
            <PlusIcon />
            <span>Nouvelle Vente</span>
          </button>
        </div>
      </header>

      {/* ─── REVENUE CARDS ─── */}
      <section className="revenue-cards">
        {REVENUE_CARDS.map(c => (
          <article
            key={c.key}
            className={`revenue-card ${c.featured ? 'revenue-card--featured' : ''}`}
          >
            <span className={`revenue-card__label ${c.featured ? 'revenue-card__label--featured' : ''}`}>
              {c.label}
            </span>
            <span className="revenue-card__amount">{c.amount}</span>
            <div className={`revenue-card__trend revenue-card__trend--${c.trendType}`}>
              {c.trendType === 'up'    && <ArrowUpIcon />}
              {c.trendType === 'star'  && <StarIcon />}
              {c.trendType === 'chart' && <ChartIcon />}
              <span>{c.trend}</span>
            </div>
            <img src={c.decor} alt="" className="revenue-card__decor" />
          </article>
        ))}
      </section>

      {/* ─── FILTERS ─── */}
      <section className="billetterie-filters">
        <div className="billetterie-filters__search">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom, email ou N° de commande..."
          />
        </div>

        <div className="billetterie-filters__dropdowns">
          <label className="billetterie-filters__select">
            <select value={category} onChange={e => setCategory(e.target.value as CategoryKey)}>
              <option value="all">Toutes les catégories</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
              <option value="prestige">Prestige</option>
            </select>
            <ChevronDown />
          </label>

          <label className="billetterie-filters__select">
            <select value={period} onChange={e => setPeriod(e.target.value as PeriodKey)}>
              <option value="day">Dernières 24h</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            <ChevronDown />
          </label>
        </div>
      </section>

      {/* ─── RECENT SALES ─── */}
      <section className="recent-sales">
        <header className="recent-sales__header">
          <h3 className="recent-sales__title">Ventes Récentes</h3>
          <a href="#" className="recent-sales__link">
            <span>Voir tout</span>
            <ArrowRightSmall />
          </a>
        </header>

        <div className="recent-sales__table">
          <div className="sales-row sales-row--head">
            <span>Client</span>
            <span>Commande</span>
            <span>Catégorie</span>
            <span>Statut</span>
            <span className="sales-row__col-right">Montant</span>
          </div>

          {SALES.map(s => (
            <div key={s.orderId} className="sales-row">
              <div className="sale-client">
                <span className={`sale-avatar sale-avatar--${s.gradient}`}>{s.initials}</span>
                <div>
                  <span className="sale-client__name">{s.name}</span>
                  <span className="sale-client__email">{s.email}</span>
                </div>
              </div>
              <span className="sale-order-id">{s.orderId}</span>
              <span className={`sale-category sale-category--${s.category}`}>
                {CATEGORY_LABELS[s.category]}
              </span>
              <span className={`sale-status sale-status--${s.status}`}>
                <span className="sale-status__dot" />
                <span>{s.status === 'confirmed' ? 'Confirmé' : 'En attente'}</span>
              </span>
              <span className="sale-amount">{s.amount}</span>
            </div>
          ))}
        </div>
      </section>

      
      <footer className="billetterie-footer">
        <span>© 2026 La Magie du Soir — Système de gestion de billetterie</span>
        <nav>
          <a href="#">Support technique</a>
          <a href="#">Journal d'audit</a>
        </nav>
      </footer>
    </AdminLayout>
  );
}
