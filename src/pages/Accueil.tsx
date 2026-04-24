import { Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useCms } from '../context/CmsContext';

export default function Accueil() {
  const { slogan } = useCms();
  return (
    <>
      <TopNavBar />

      <main>
        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <div className="hero__gradient" aria-hidden="true" />

          <div className="hero__content">
            <img src="/images/hero-badge.jpg" alt="" className="hero__badge" />

            <h1 className="hero__title">
              La Magie du Soir :<br />
              Célébrer l'Excellence
            </h1>

            <p className="hero__subtitle">
              {slogan}
            </p>

            <a href="#idee" className="hero__cta">Découvrir la vision</a>
          </div>

          <a href="#idee" className="hero__scroll" aria-label="Défiler vers le bas">
            <img src="/images/icon-scroll.svg" alt="" />
          </a>
        </section>

        {/* ─── L'IDÉE ───────────────────────────────────────── */}
        <section className="idee" id="idee">
          <div className="idee__frame">
            <span className="idee__corner idee__corner--tl" aria-hidden="true" />
            <span className="idee__corner idee__corner--tr" aria-hidden="true" />
            <span className="idee__corner idee__corner--bl" aria-hidden="true" />
            <span className="idee__corner idee__corner--br" aria-hidden="true" />

            <div className="idee__grid">
              <div className="idee__text">
                <h2 className="idee__title">
                  L'Idée :<br />
                  Une Alchimie<br />
                  Culturelle
                </h2>
                <p>
                  La Magie du Soir n'est pas seulement un événement ; c'est un
                  manifeste. Une fusion audacieuse entre les{' '}
                  <span className="idee__accent">traditions ancestrales</span> et
                  la modernité la plus tranchante.
                </p>
                <p>
                  Notre mission est de briser les plafonds de verre, en offrant à
                  la <span className="idee__accent">jeunesse africaine</span> une
                  plateforme où leur excellence n'est pas seulement reconnue, mais
                  célébrée comme le nouveau standard mondial.
                </p>
              </div>

              <figure className="idee__image-wrap">
                <img src="/images/idea-statue.png" alt="Œuvre d'art africaine" />
              </figure>
            </div>
          </div>
        </section>

        {/* ─── LE BUT ───────────────────────────────────────── */}
        <section className="but">
          <div className="but__container">
            <header className="but__header">
              <h2 className="section-title but__title">Le But</h2>
              <div className="section-divider" />
            </header>

            <div className="but__cards">
              <article className="but__card">
                <img src="/images/icon-rayonnement.svg" alt="" className="but__icon" />
                <h3 className="but__card-title">Rayonnement</h3>
                <p className="but__card-text">
                  Propulser les arts africains sur la scène internationale à travers
                  des collaborations prestigieuses et une diffusion mondiale sans
                  précédent.
                </p>
              </article>

              <article className="but__card">
                <img src="/images/icon-transmission.svg" alt="" className="but__icon" />
                <h3 className="but__card-title">Transmission</h3>
                <p className="but__card-text">
                  Encadrer la prochaine génération d'artistes par des programmes de
                  mentorat dirigés par les plus grandes figures de l'excellence
                  contemporaine.
                </p>
              </article>

              <article className="but__card">
                <img src="/images/icon-excellence.svg" alt="" className="but__icon" />
                <h3 className="but__card-title">Excellence</h3>
                <p className="but__card-text">
                  Maintenir un standard de qualité absolue dans chaque performance,
                  chaque scénographie et chaque interaction, définissant le luxe de
                  demain.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── SOUVENIRS D'EXCELLENCE ───────────────────────── */}
        <section className="souvenirs">
          <div className="souvenirs__bg" aria-hidden="true" />

          <div className="souvenirs__container">
            <header className="souvenirs__header">
              <h2 className="section-title souvenirs__title">Souvenirs d'Excellence</h2>
              <div className="section-divider" />
            </header>

            <div className="souvenirs__grid">
              <figure className="souvenirs__frame">
                <div className="souvenirs__frame-inner">
                  <img src="/images/gallery-scene.png" alt="Scène de gala" />
                </div>
              </figure>
              <figure className="souvenirs__frame">
                <div className="souvenirs__frame-inner">
                  <img src="/images/idea-statue.png" alt="Portrait artiste" />
                </div>
              </figure>
            </div>

            <div className="souvenirs__cta">
              <Link to="/galerie" className="btn-ghost">Voir plus la galerie</Link>
            </div>
          </div>
        </section>

        {/* ─── CASTING CTA ─── */}
        <section className="casting-cta">
          <div className="casting-cta__inner">
            <span className="casting-cta__eyebrow">Casting 2026</span>
            <h2 className="casting-cta__title">
              Aimeriez-vous participer au casting ?
            </h2>
            <p className="casting-cta__text">
              Danser, chanter, slamer — partagez votre art avec la scène de
              La Magie du Soir.
            </p>
            <a
              href="https://www.lamagiedusoir.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="casting-cta__btn"
            >
              Soumettez votre candidature
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
