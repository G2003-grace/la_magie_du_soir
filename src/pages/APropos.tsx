import { Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import SiteFooter from '../components/layout/SiteFooter';
import { useCms } from '../context/CmsContext';

const VALUES = [
  {
    icon: '/images/icon-value-excellence.svg',
    title: 'Excellence',
    text: 'Nous ne sélectionnons que le sommet de la création contemporaine.',
  },
  {
    icon: '/images/icon-value-rayonnement.svg',
    title: 'Rayonnement',
    text: "Exporter l'élégance africaine sur les plus grandes scènes mondiales.",
  },
  {
    icon: '/images/icon-value-transmission.svg',
    title: 'Transmission',
    text: 'Favoriser les échanges entre les maîtres et la nouvelle garde.',
  },
  {
    icon: '/images/icon-value-prestige.svg',
    title: 'Prestige',
    text: "Une scénographie où chaque détail est une œuvre d'art.",
  },
];

const TEAM = [
  { photo: '/images/team-amara.png',    name: 'Amara Diop',       role: 'Directrice de la création' },
  { photo: '/images/team-jeanmarc.png', name: 'Jean-Marc Koffi',  role: "Commissaire d'exposition" },
  { photo: '/images/team-sara.png',     name: 'Sara Belkacem',    role: 'Responsable relations publiques' },
  { photo: '/images/team-david.png',    name: 'David Mensah',     role: 'Directeur de production' },
];

const STATS = [
  { value: '12',    label: 'Éditions prévues' },
  { value: '2500+', label: "Invités d'honneur" },
  { value: '45',    label: 'Artistes récompensés' },
];

export default function APropos() {
  const { aboutDescription } = useCms();
  return (
    <>
      <TopNavBar />

      <main>
        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="about-hero">
          <div className="about-hero__bg" aria-hidden="true" />
          <div className="about-hero__gradient" aria-hidden="true" />

          <div className="about-hero__content">
            <span className="about-hero__badge">Notre héritage</span>
            <h1 className="about-hero__title">La Magie du Soir</h1>
            <p className="about-hero__subtitle">
              {aboutDescription}
            </p>
          </div>
        </section>

        {/* ─── GENÈSE D'UNE VISION ─────────────────────────── */}
        <section className="genese">
          <div className="genese__grid">
            <div className="genese__text">
              <h2 className="genese__title">Genèse d'une Vision</h2>

              <p>
                Né de la volonté de créer un écrin à la démesure du talent africain,{' '}
                <span className="genese__highlight">La Magie du Soir</span> a vu le
                jour en 2018. Ce qui n'était alors qu'un rêve d'union entre tradition
                et modernité est devenu le rendez-vous incontournable de l'élite
                artistique et culturelle du continent.
              </p>
              <p>
                Notre mission est claire : offrir une plateforme de rayonnement
                international aux créateurs, musiciens et plasticiens qui façonnent
                l'imaginaire africain d'aujourd'hui et de demain.
              </p>

              <blockquote className="genese__quote">
                « L'excellence n'est pas un acte, c'est une habitude que nous
                célébrons chaque année sous les étoiles. »
              </blockquote>
            </div>

            <figure className="genese__portrait">
              <div className="genese__portrait-frame">
                <img src="/images/founder-portrait.png" alt="Portrait du fondateur" />
              </div>
              <figcaption className="genese__overlay">
                <span className="genese__overlay-label">Inspiration</span>
                <p className="genese__overlay-text">
                  L'art de l'Afrique ne se regarde pas, il se vit avec ferveur.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ─── IMPACT EN CHIFFRES ──────────────────────────── */}
        <section className="stats">
          <div className="stats__container">
            <header className="stats__header">
              <h2 className="stats__title">L'Impact en Chiffres</h2>
              <div className="stats__divider" />
            </header>

            <div className="stats__grid">
              {STATS.map(s => (
                <article key={s.label} className="stats__card">
                  <div className="stats__value">{s.value}</div>
                  <div className="stats__label">{s.label}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MISSION & VALEURS ───────────────────────────── */}
        <section className="values">
          <div className="values__grid">
            {VALUES.map(v => (
              <article key={v.title} className="values__card">
                <img src={v.icon} alt="" className="values__icon" />
                <h3 className="values__card-title">{v.title}</h3>
                <p className="values__card-text">{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── L'ÉQUIPE ─────────────────────────────────────── */}
        <section className="team">
          <div className="team__container">
            <header className="team__header">
              <div className="team__intro">
                <h2 className="team__title">L'Équipe Organisatrice</h2>
                <p className="team__desc">
                  Les esprits créatifs et les mains expertes qui façonnent chaque
                  détail de cette expérience sensorielle unique.
                </p>
              </div>
              <div className="team__rule" aria-hidden="true" />
            </header>

            <div className="team__grid">
              {TEAM.map(m => (
                <article key={m.name} className="team__member">
                  <div className="team__photo">
                    <img src={m.photo} alt={m.name} />
                  </div>
                  <h3 className="team__name">{m.name}</h3>
                  <span className="team__role">{m.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA FINAL ────────────────────────────────────── */}
        <section className="cta-final">
          <h2 className="cta-final__title">
            Rejoignez-nous pour une nuit où l'imaginaire ne connaît plus de limites.
          </h2>
          <Link to="/billetterie" className="cta-final__btn">
            Obtenir mon invitation
            <img src="/images/icon-arrow.svg" alt="" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
