import { useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useCms } from '../context/CmsContext';

type FilterKey = 'all' | 'edition' | 'videos';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all',     label: 'Tout voir' },
  { key: 'edition', label: 'Édition 2025' },
];

const GALERIE_IMAGES = [
  '/images/imgal.jpg', '/images/imgal2.jpg', '/images/imgal3.jpg', '/images/imgal4.jpg',
  '/images/imgal5.jpg', '/images/imgal6.jpg', '/images/imgal7.jpg', '/images/imgal8.jpg',
];

export default function Galerie() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { medias } = useCms();
  const userMedias = medias.filter((m) => !m.id.startsWith('seed-'));

  // « Édition 2025 » n'affiche que les nouvelles images ajoutées ; « Tout voir »
  // affiche l'ensemble de la galerie.
  const showAll = activeFilter === 'all';

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
            {showAll && (
              <>
                {/* Standard — Cocktails */}
                <figure
                  className="galerie-item galerie-item--cocktails"
                  onClick={() => setLightbox('/images/gallery-cocktails.png')}
                >
                  <img src="/images/gallery-cocktails.png" alt="Cocktails de prestige" />
                  <div className="galerie-item__hover-overlay" aria-hidden="true">
                    <span>Voir plus</span>
                  </div>
                </figure>

                {/* Standard — Instrument */}
                <figure
                  className="galerie-item galerie-item--instrument"
                  onClick={() => setLightbox('/images/gallery-instrument.png')}
                >
                  <img src="/images/gallery-instrument.png" alt="Performance musicale" />
                  <div className="galerie-item__hover-overlay" aria-hidden="true">
                    <span>Voir plus</span>
                  </div>
                </figure>

                {/* Standard — Table */}
                <figure
                  className="galerie-item galerie-item--table"
                  onClick={() => setLightbox('/images/gallery-table.png')}
                >
                  <img src="/images/gallery-table.png" alt="Table dressée" />
                  <div className="galerie-item__hover-overlay" aria-hidden="true">
                    <span>Voir plus</span>
                  </div>
                </figure>
              </>
            )}

            {GALERIE_IMAGES.map((src, i) => (
              <figure
                key={`imgal-${i}`}
                className="galerie-item galerie-item--user"
                onClick={() => setLightbox(src)}
              >
                <img src={src} alt={`Galerie ${i + 1}`} />
                <div className="galerie-item__hover-overlay" aria-hidden="true">
                  <span>Voir plus</span>
                </div>
              </figure>
            ))}

            {showAll && userMedias.map((m) => (
              <figure
                key={m.id}
                className="galerie-item galerie-item--user"
                onClick={() => setLightbox(m.src)}
              >
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

        {/* ─── LIGHTBOX ─── */}
        {lightbox && (
          <div
            className="galerie-lightbox"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="galerie-lightbox__close"
              aria-label="Fermer"
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
            <img
              className="galerie-lightbox__img"
              src={lightbox}
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
