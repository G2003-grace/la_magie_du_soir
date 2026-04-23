import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useCandidats, type CandidateStatus } from '../../context/CandidatsContext';
import {
  buildStatusEmail,
  sendStatusEmail,
  STATUS_LABELS_FOR_EMAIL,
} from '../../lib/emailNotifications';

type FilterKey = 'tous' | 'chanteurs' | 'danseurs' | 'musiciens';
type StatusKey = CandidateStatus;

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'tous',       label: 'Tous' },
  { key: 'chanteurs',  label: 'Chanteurs' },
  { key: 'danseurs',   label: 'Danseurs' },
  { key: 'musiciens',  label: 'Musiciens' },
];

const STATUS_LABELS: Record<StatusKey, string> = {
  'pre-selected': 'Pré-sélectionné',
  'pending':      'En attente',
  'selected':     'Sélectionné',
  'interview':    'Entretien prévu',
  'rejected':     'Rejeté',
};

const STATUS_CHOICES: StatusKey[] = ['pending', 'pre-selected', 'selected', 'rejected'];

function matchesFilter(category: string, filter: FilterKey): boolean {
  if (filter === 'tous') return true;
  const c = category.toLowerCase();
  if (filter === 'chanteurs') return c.includes('chant') || c.includes('voc');
  if (filter === 'danseurs')  return c.includes('dans');
  return !c.includes('chant') && !c.includes('voc') && !c.includes('dans');
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill={filled ? '#f7bd48' : 'none'}
      stroke={filled ? '#f7bd48' : '#4b5563'}
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
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
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function Candidats() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('tous');
  const [search, setSearch] = useState('');
  const { candidates, updateStatus } = useCandidats();
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openStatusId) return;
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpenStatusId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openStatusId]);

  const query = search.trim().toLowerCase();
  const visibleCandidates = candidates
    .filter((c) => matchesFilter(c.category, activeFilter))
    .filter((c) => {
      if (!query) return true;
      return `${c.firstName} ${c.lastName}`.toLowerCase().includes(query);
    });
  const total = candidates.length;
  const visibleCount = visibleCandidates.length;
  const pendingCount = candidates.filter((c) => c.status === 'pending').length;
  const preSelectedCount = candidates.filter((c) => c.status === 'pre-selected').length;

  const stats = [
    { label: 'Total Candidats',  value: total.toLocaleString('fr-FR'),          variant: 'neutral' as const, decor: '/images/icon-stat-decor-1.svg' },
    { label: 'À évaluer',        value: pendingCount.toString(),                 variant: 'gold'    as const, decor: '/images/icon-stat-decor-2.svg' },
    { label: 'Pré-sélectionnés', value: preSelectedCount.toString(),             variant: 'amber'   as const, decor: '/images/icon-stat-decor-3.svg' },
    { label: 'Média reçus',      value: '94%',                                    variant: 'neutral' as const, decor: '/images/icon-stat-decor-4.svg' },
  ];

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleStatusClick = async (id: string, next: StatusKey) => {
    setOpenStatusId(null);
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;
    if (candidate.status === next) return;

    const email = buildStatusEmail(candidate, next);

    if (email) {
      const statusLabel = STATUS_LABELS_FOR_EMAIL[next];
      const ok = window.confirm(
        `Changer le statut de ${candidate.firstName} ${candidate.lastName} en « ${statusLabel} » et lui envoyer un email à ${email.to} ?`
      );
      if (!ok) return;
      updateStatus(id, next);
      try {
        await sendStatusEmail(email);
        setToast(`Email envoyé à ${email.to}`);
      } catch {
        setToast(`Échec de l'envoi de l'email à ${email.to}`);
      }
      return;
    }

    updateStatus(id, next);
  };

  return (
    <AdminLayout
      topBar
      searchPlaceholder="Rechercher un candidat..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      {/* ─── HEADER ─── */}
      <header className="candidats__header">
        <div className="candidats__title-block">
          <h1 className="candidats__title">
            Gestion du <span className="candidats__title-accent">Casting</span>
          </h1>
          <p className="candidats__subtitle">
            Gérez les talents de la saison 2026. Filtrez par discipline et validez
            les prochaines étoiles de notre gala.
          </p>
        </div>

        <div className="candidats__actions">
          <div className="candidats__filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`candidats__filter ${activeFilter === f.key ? 'candidats__filter--active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" className="candidats__export">
            <DownloadIcon />
            <span>Exporter</span>
          </button>
        </div>
      </header>

      {/* ─── STATS ─── */}
      <section className="candidats-stats">
        {stats.map(s => (
          <article key={s.label} className="candidat-stat">
            <span className="candidat-stat__label">{s.label}</span>
            <span className={`candidat-stat__value candidat-stat__value--${s.variant}`}>
              {s.value}
            </span>
            <img src={s.decor} alt="" className="candidat-stat__decor" />
          </article>
        ))}
      </section>

      {/* ─── TABLE ─── */}
      <section className="candidats-table">
        <div className="candidats-table__scroll">
          <div className="candidats-table__row candidats-table__row--head">
            <span>Candidat</span>
            <span>Catégorie</span>
            <span>Date de soumission</span>
            <span>Statut</span>
            <span>Score jury</span>
            <span className="candidats-table__col-right">Actions</span>
          </div>

          {visibleCandidates.length === 0 && (
            <div className="candidats-table__empty">
              {query
                ? `Aucun candidat ne correspond à « ${search} ».`
                : 'Aucun candidat pour ce filtre.'}
            </div>
          )}

          {visibleCandidates.map(c => (
            <div key={c.id} className="candidats-table__row">
              <div className="candidat-profile">
                <img src={c.avatar} alt="" className="candidat-profile__avatar" />
                <div>
                  <span className="candidat-profile__name">
                    {c.firstName} {c.lastName}
                  </span>
                  <span className="candidat-profile__city">{c.city}</span>
                </div>
              </div>
              <span className="candidat-cell-text">{c.category}</span>
              <span className="candidat-cell-muted">{c.date}</span>
              <div
                className="candidat-status-wrap"
                ref={openStatusId === c.id ? dropdownRef : null}
              >
                <button
                  type="button"
                  className={`candidat-badge candidat-badge--${c.status} candidat-badge--clickable`}
                  onClick={() => setOpenStatusId(openStatusId === c.id ? null : c.id)}
                  aria-haspopup="listbox"
                  aria-expanded={openStatusId === c.id}
                >
                  {STATUS_LABELS[c.status]}
                  <span className="candidat-badge__caret" aria-hidden="true">▾</span>
                </button>
                {openStatusId === c.id && (
                  <ul className="candidat-status-menu" role="listbox">
                    {STATUS_CHOICES.map(choice => (
                      <li key={choice}>
                        <button
                          type="button"
                          className={`candidat-status-menu__item ${c.status === choice ? 'candidat-status-menu__item--active' : ''}`}
                          onClick={() => handleStatusClick(c.id, choice)}
                          role="option"
                          aria-selected={c.status === choice}
                        >
                          <span className={`candidat-status-menu__dot candidat-status-menu__dot--${choice}`} />
                          {STATUS_LABELS[choice]}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {c.stars === null ? (
                <span className="candidat-pending-text">En attente</span>
              ) : (
                <div className="candidat-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} filled={i <= (c.stars ?? 0)} />
                  ))}
                </div>
              )}
              <div className="candidats-table__col-right">
                <button type="button" className="candidat-eye-btn" aria-label="Voir le profil">
                  <EyeIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="candidats-pagination">
          <span className="candidats-pagination__info">
            {visibleCount === 0
              ? `0 candidat sur ${total.toLocaleString('fr-FR')}`
              : `Affichage de 1 à ${visibleCount} sur ${total.toLocaleString('fr-FR')} candidats`}
          </span>
          <div className="candidats-pagination__controls">
            <button type="button" className="candidats-pagination__btn" aria-label="Précédent">
              <ChevronLeft />
            </button>
            <button type="button" className="candidats-pagination__btn candidats-pagination__btn--active">1</button>
            <button type="button" className="candidats-pagination__btn">2</button>
            <button type="button" className="candidats-pagination__btn">3</button>
            <button type="button" className="candidats-pagination__btn" aria-label="Suivant">
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* ─── SPOTLIGHT ─── */}
      <section className="candidats-spotlight">
        <img src="/images/candidat-spotlight.png" alt="" className="candidats-spotlight__bg" />
        <div className="candidats-spotlight__gradient" aria-hidden="true" />
        <img src="/images/icon-sparkle.svg" alt="" className="candidats-spotlight__sparkle" />
        <div className="candidats-spotlight__content">
          <div>
            <h3 className="candidats-spotlight__title">
              Événement de casting{' '}
              <span className="candidats-spotlight__title-accent">live</span>
            </h3>
            <p className="candidats-spotlight__desc">
              Le premier tour d'auditions en direct aura lieu à l'Opéra Garnier le
              15 novembre. Préparez les dossiers prioritaires.
            </p>
          </div>
          <button type="button" className="candidats-spotlight__btn">
            Gérer le calendrier
          </button>
        </div>
      </section>

      {/* ─── FAB ─── */}
      <button type="button" className="candidats-fab" aria-label="Ajouter un candidat">
        <PlusIcon />
      </button>

      {toast && (
        <div className="admin-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
