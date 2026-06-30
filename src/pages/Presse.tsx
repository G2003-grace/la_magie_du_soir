import TopNavBar from '../components/layout/TopNavBar';
import FooterPresse from '../components/layout/FooterPresse';

const THUMBNAILS: Array<{ image: string; title: string; subtitle: string; url?: string }> = [
  { image: '/images/press-thumb-backstage.jpg', title: "Highlights de l'édition 2025",    subtitle: 'Atmosphère & Public', url: 'https://www.facebook.com/share/v/1DkmTk28fm/' },
  { image: '/images/press-thumb-interview.jpg', title: 'Les coulisses de la création',    subtitle: 'Scénographie & Décors' },
  { image: '/images/press-thumb-live.jpg',      title: 'Dévoilement du Line-up',          subtitle: 'Annonces Officielles' },
];

const RELEASES = [
  {
    date: '15 mars 2026',
    title: "Lancement de la billetterie \"Carré d'Or\" : une demande record pour 2026.",
    text: "Le comité d'organisation annonce une ouverture exceptionnelle des réservations. Face à l'engouement suscité par le nouveau thème nocturne, les places limitées s'envolent...",
  },
  {
    date: '02 janv 2026',
    title: 'Annonce du partenariat exclusif avec la Maison de Joaillerie Royale.',
    text: "Une alliance sous le signe de l'éclat : découvrez comment l'artisanat traditionnel rencontrera la technologie de pointe lors de la soirée inaugurale...",
  },
];

const PHOTOS = [
  { image: '/images/press-photo-fashion.png',   name: 'Éclat Doré',        id: '882', offset: false },
 
  { image: '/images/press-photo-orchestra.png', name: 'Symphonie du Soir', id: '115', offset: true  },
];

export default function Presse() {
  return (
    <>
      <TopNavBar />

      <main className="presse">
        {/* ─── HERO ─── */}
        <section className="presse__hero">
          <span className="presse__kicker">Espace journalistes</span>
          <h1 className="presse__title">
            Salle de <span className="presse__title-accent">Presse</span>
          </h1>
          <p className="presse__subtitle">
            Accédez à l'univers exclusif de La Magie du Soir 2026. Retrouvez ici
            nos derniers communiqués, ressources visuelles et entretiens officiels.
          </p>
        </section>

        {/* ─── VIDEO FEATURE ─── */}
        <section className="presse-video">
          <div className="presse-video__main">
            <img
              src="/images/press-video-main.png"
              alt="Entretien avec le promoteur"
              className="presse-video__bg"
            />
            <div className="presse-video__gradient" aria-hidden="true" />
            <button type="button" className="presse-video__play" aria-label="Lire la vidéo">
              <img src="/images/icon-play.svg" alt="" />
            </button>
            <div className="presse-video__footer">
              <div className="presse-video__meta">
                <span className="presse-video__badge">Exclusif</span>
                <h2 className="presse-video__title">
                  Vision &amp; Héritage : Entretien avec le Promoteur
                </h2>
              </div>
              <span className="presse-video__duration">Durée : 04:22</span>
            </div>
          </div>

          <div className="presse-video__thumbs">
            {THUMBNAILS.map(t => {
              const inner = (
                <>
                  <div className="video-thumb__img">
                    <img src={t.image} alt="" />
                    <div className="video-thumb__overlay" aria-hidden="true">
                      <img src="/images/icon-play-small.svg" alt="" />
                    </div>
                  </div>
                  <div className="video-thumb__body">
                    <h4>{t.title}</h4>
                    <p>{t.subtitle}</p>
                  </div>
                </>
              );
              return t.url ? (
                <a
                  key={t.title}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-thumb"
                >
                  {inner}
                </a>
              ) : (
                <button type="button" key={t.title} className="video-thumb">
                  {inner}
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── RESOURCES BENTO ─── */}
        <section className="presse-resources">
          <article className="resource resource--mediakit">
            <div className="resource__watermark" aria-hidden="true">
              <img src="/images/icon-mediakit.svg" alt="" />
            </div>
            <h3 className="resource__mediakit-title">Media Kit 2026</h3>
            <p className="resource__mediakit-desc">
              Pack complet : logos, chartes graphiques, fiches techniques et
              biographies des artistes.
            </p>
            <a href="#" className="resource__download">
              <img src="/images/icon-download.svg" alt="" />
              <span>Télécharger (48 MB)</span>
            </a>
          </article>

          {RELEASES.map((r, i) => (
            <article key={i} className="resource resource--release">
              <header className="resource__head">
                <span className="resource__date">{r.date}</span>
                <img src="/images/icon-doc.svg" alt="" className="resource__icon" />
              </header>
              <h3 className="resource__release-title">{r.title}</h3>
              <p className="resource__release-text">{r.text}</p>
              <a href="#" className="resource__link">
                <span>Lire le communiqué</span>
                <img src="/images/icon-arrow-right-small.svg" alt="" />
              </a>
            </article>
          ))}

          <article className="resource resource--accred">
            <div>
              <h3 className="resource__accred-title">Demande d'Accréditation</h3>
              <p className="resource__accred-desc">
                Les demandes pour la soirée de gala du 24 Juin sont désormais
                ouvertes pour les photographes et journalistes certifiés.
              </p>
            </div>
            <a href="#contact-medias" className="resource__accred-btn">
              Formulaire de presse
            </a>
          </article>
        </section>

        {/* ─── PHOTOTHÈQUE ─── */}
        <section className="presse-gallery">
          <header className="presse-gallery__header">
            <div>
              <h2 className="presse-gallery__title">
                Photothèque <span className="presse-gallery__title-accent">Haute Définition</span>
              </h2>
              <p className="presse-gallery__desc">
                Libre de droits pour un usage éditorial uniquement.
              </p>
            </div>
            <nav className="presse-gallery__filters">
              <button type="button" className="gallery-filter gallery-filter--active">
                Tout voir
              </button>
              <button type="button" className="gallery-filter">Ambiances</button>
              <button type="button" className="gallery-filter">Portraits</button>
            </nav>
          </header>

          <div className="presse-gallery__grid">
            {PHOTOS.map(p => (
              <figure
                key={p.id}
                className={`gallery-photo ${p.offset ? 'gallery-photo--offset' : ''}`}
              >
                <img src={p.image} alt={p.name} />
                <figcaption className="gallery-photo__caption">
                  <span className="gallery-photo__name">{p.name} | {p.id}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ─── CONTACT MÉDIAS ─── */}
        <section className="presse-contact" id="contact-medias">
          <div className="presse-contact__left">
            <h2 className="presse-contact__title">
              Contact <span className="presse-contact__title-accent">Médias</span>
            </h2>
            <p className="presse-contact__desc">
              Notre équipe est à votre disposition pour toute demande d'interview,
              de reportage ou pour obtenir des informations complémentaires sur
              l'édition 2026.
            </p>
            <ul className="presse-contact__items">
              <li>
                <span className="presse-contact__icon">
                  <img src="/images/icon-mail.svg" alt="" />
                </span>
                <div>
                  <span className="presse-contact__label">Relations presse</span>
                  <a href="mailto:presse@lamagiedusoir.fr" className="presse-contact__value">
                    presse@lamagiedusoir.fr
                  </a>
                </div>
              </li>
              <li>
                <span className="presse-contact__icon">
                  <img src="/images/icon-phone.svg" alt="" />
                </span>
                <div>
                  <span className="presse-contact__label">Ligne directe</span>
                  <a href="tel:+22997509642" className="presse-contact__value">
                    +229 97 50 96 42
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <form className="presse-contact__form" onSubmit={e => e.preventDefault()}>
            <div className="presse-field">
              <label className="presse-field__label">Nom complet</label>
              <input type="text" placeholder="Jean Dupont" className="presse-field__input" />
            </div>
            <div className="presse-field">
              <label className="presse-field__label">Média / Publication</label>
              <input type="text" placeholder="The Paris Times" className="presse-field__input" />
            </div>
            <div className="presse-field">
              <label className="presse-field__label">Votre message</label>
              <textarea
                placeholder="Décrivez votre demande ici..."
                className="presse-field__textarea"
                rows={5}
              />
            </div>
            <button type="submit" className="presse-field__submit">
              Envoyer la demande
            </button>
          </form>
        </section>
      </main>

      <FooterPresse />
    </>
  );
}
