import { Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import SiteFooter from '../components/layout/SiteFooter';

const SCHEDULE = [
  {
    time: '19:30',
    title: 'Accueil & tapis rouge',
    desc: "Cocktail de bienvenue servi dans le Grand Foyer, musique d'ambiance par notre quatuor à cordes résident.",
  },
  {
    time: '20:30',
    title: 'Ouverture du gala',
    desc: 'Levée de rideau et discours inaugural de la Présidence, suivi de la première performance immersive.',
  },
  {
    time: '21:15',
    title: 'Dîner de gala & remise de prix',
    desc: 'Menu gastronomique en 5 services. Interludes artistiques et dévoilement des lauréats 2026.',
  },
  {
    time: '23:45',
    title: 'Bal de clôture',
    desc: 'Soirée dansante sous la coupole de cristal avec performance exclusive de notre DJ international.',
  },
];

const CATEGORIES = [
  {
    key: 'danse',
    title: 'Danse Contemporaine',
    desc: "L'expression du mouvement pur, entre force et fragilité.",
    image: '/images/cat-danse.png',
    span: 'categories__card--wide',
  },
  {
    key: 'musique',
    title: 'Musique Classique',
    desc: "Les chefs-d'œuvre réinterprétés par la nouvelle génération.",
    image: '/images/cat-musique.png',
    span: '',
  },
  {
    key: 'lyrique',
    title: 'Art Lyrique',
    desc: 'La puissance de la voix dans toute sa splendeur théâtrale.',
    image: '/images/cat-lyrique.png',
    span: '',
  },
  {
    key: 'visuels',
    title: 'Arts Visuels & Numériques',
    desc: 'La fusion entre technologie et esthétique classique.',
    image: '/images/cat-visuels.png',
    span: 'categories__card--wide',
  },
];

const JURY = [
  { photo: '/images/jury-elena.png',   name: 'Elena Vaskova',   role: "Étoile de l'Opéra de Paris" },
  { photo: '/images/jury-julian.png',  name: 'Julian Sterling', role: 'Directeur de conservation' },
  { photo: '/images/jury-maya.png',    name: 'Maya Chen',       role: 'Metteur en scène' },
  { photo: '/images/jury-marcus.png',  name: 'Marcus Aurelius', role: "Chef d'orchestre" },
];

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

export default function Programme() {
  return (
    <>
      <TopNavBar />

      <main>
        {/* ─── HERO / AFFICHE ───────────────────────────────── */}
        <section className="programme-hero">
          <div className="programme-hero__bg" aria-hidden="true" />
          <div className="programme-hero__gradient" aria-hidden="true" />

          <div className="programme-hero__grid">
            <div className="programme-hero__text">
              <span className="programme-hero__badge">L'édition 2026</span>
              <h1 className="programme-hero__title">La Magie du Soir</h1>
              <p className="programme-hero__desc">
                Une immersion sensorielle au cœur de l'excellence artistique.
                Rejoignez-nous pour une nuit où le temps s'arrête et où l'exceptionnel
                devient la norme.
              </p>
              <div className="programme-hero__ctas">
                <Link to="/billetterie" className="programme-hero__cta-primary">
                  Réserver ma place
                </Link>
                <a href="#calendrier" className="programme-hero__cta-secondary">
                  Découvrir le calendrier
                </a>
              </div>
            </div>

            <figure className="programme-hero__poster-wrap">
              <div className="programme-hero__poster-glow" aria-hidden="true" />
              <img src="/images/poster-affiche.png" alt="Affiche officielle La Magie du Soir 2026" className="programme-hero__poster" />
            </figure>
          </div>
        </section>

        {/* ─── CALENDRIER DE LA SOIRÉE ─────────────────────── */}
        <section className="schedule" id="calendrier">
          <div className="schedule__container">
            <header className="schedule__header">
              <span className="schedule__icon"><ScheduleIcon /></span>
              <h2 className="schedule__title">Calendrier de la Soirée</h2>
              <div className="schedule__divider" />
            </header>

            <div className="schedule__list">
              {SCHEDULE.map(s => (
                <article key={s.time} className="schedule__card">
                  <div className="schedule__time">{s.time}</div>
                  <div className="schedule__body">
                    <h3 className="schedule__card-title">{s.title}</h3>
                    <p className="schedule__card-desc">{s.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATÉGORIES ARTISTIQUES ──────────────────────── */}
        <section className="categories">
          <div className="categories__container">
            <h2 className="categories__title">Catégories Artistiques</h2>
            <div className="categories__bento">
              {CATEGORIES.map(c => (
                <article key={c.key} className={`categories__card ${c.span}`}>
                  <div className="categories__image">
                    <img src={c.image} alt={c.title} />
                  </div>
                  <div className="categories__overlay" aria-hidden="true" />
                  <div className="categories__body">
                    <h3 className="categories__card-title">{c.title}</h3>
                    <p className="categories__card-desc">{c.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MEMBRES DU JURY ─────────────────────────────── */}
        <section className="jury">
          <div className="jury__container">
            <header className="jury__header">
              <div className="jury__intro">
                <h2 className="jury__title">Membres du Jury</h2>
                <p className="jury__desc">
                  Des figures emblématiques de la scène culturelle internationale,
                  réunies pour célébrer l'excellence et l'innovation.
                </p>
              </div>
            </header>

            <div className="jury__grid">
              {JURY.map(j => (
                <article key={j.name} className="jury__member">
                  <div className="jury__photo">
                    <img src={j.photo} alt={j.name} />
                  </div>
                  <h3 className="jury__name">{j.name}</h3>
                  <span className="jury__role">{j.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
