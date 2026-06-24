import { useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useCms } from '../context/CmsContext';

type FilterKey = 'all' | 'edition' | 'videos';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all',     label: 'Tout voir' },
  { key: 'edition', label: 'Édition 2025' },
  { key: 'videos',  label: 'Vidéos' },
];

export default function Galerie() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { medias } = useCms();
  const userMedias = medias.filter((m) => !m.id.startsWith('seed-'));

  return (
    <>
      <TopNavBar />

      <main className="galerie">
        <div className="galerie__bg" aria-hidden="true">
          <img src="/images/gallery-bg-blur.png" alt="" />
          <div className="galerie__bg-overlay" />
        </div>

        {/* ─── HERO ─── */}
        <section className="galerie__hero">
          <div className="galerie__hero-gradient" aria-hidden="true" />
          <div className="galerie__hero-content">
            <h1 className="galerie__title">Archives de l'Élégance</h1>
            <p className="galerie__subtitle">
              Revivez les instants suspendus de nos galas prestigieux
            </p>
            <div className="galerie__divider" />
          </div>
        </section>

        {/* ─── FILTRES ─── */}
        <section className="galerie-filters">
          {FILTERS.map(f => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`galerie-filter ${active ? 'galerie-filter--active' : ''}`}
              >
                <span className="galerie-filter__label">{f.label}</span>
                <span className="galerie-filter__dot" aria-hidden="true" />
              </button>
            );
          })}
        </section>

        {/* ─── BENTO GRID ─── */}
        <section className="galerie-grid-wrap">
          <div className="galerie-grid">
            {/* Standard — Instrument */}
            <figure className="galerie-item galerie-item--instrument">
              <img src="/images/gallery-instrument.png" alt="Performance musicale" />
              <div className="galerie-item__hover-overlay" aria-hidden="true">
                <span>Voir plus</span>
              </div>
            </figure>

            {/* Standard — Table */}
            <figure className="galerie-item galerie-item--table">
              <img src="/images/gallery-table.png" alt="Table dressée" />
              <div className="galerie-item__hover-overlay" aria-hidden="true">
                <span>Voir plus</span>
              </div>
            </figure>

            {userMedias.map((m) => (
              <figure key={m.id} className="galerie-item galerie-item--user">
                <img src={m.src} alt="" />
                <div className="galerie-item__hover-overlay" aria-hidden="true">
                  <span>Voir plus</span>
                </div>
              </figure>
            ))}
          </div>

          {/* Load more */}
          <div className="galerie-loadmore">
            <button type="button" className="galerie-loadmore__btn">
              <span className="galerie-loadmore__label">
                Découvrir d'autres souvenirs
              </span>
              <span className="galerie-loadmore__arrow">
                <img src="/images/icon-arrow-down.svg" alt="" />
              </span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
