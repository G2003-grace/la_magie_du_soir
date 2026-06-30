import TopNavBar from '../components/layout/TopNavBar';
import FooterContact from '../components/layout/FooterContact';

const CONTACT_CARDS = [
  {
    icon: '/images/icon-phone-card.svg',
    title: 'Relations Publiques',
    value: '+229 97 50 96 42',
    note: 'Disponible 10h — 19h',
    href: 'tel:+22997509642',
  },
  {
    icon: '/images/icon-mail-card.svg',
    title: 'Secrétariat Général',
    value: 'invitations@lamagiedusoir.fr',
    note: 'Réponse sous 24 heures',
    href: 'mailto:invitations@lamagiedusoir.fr',
  },
  {
    icon: '/images/icon-chat-card.svg',
    title: 'WhatsApp Concierge',
    value: 'Canal Exclusif VIP',
    note: 'Service Premium 24/7',
    href: '#',
  },
];

const SUBJECTS = [
  'Réservation VIP',
  "Demande d'interview",
  'Partenariat',
  'Conciergerie',
  'Autre demande',
];

export default function Contact() {
  return (
    <>
      <TopNavBar />

      <main className="contact">
        {/* ─── HERO ─── */}
        <section className="contact__hero">
          <span className="contact__kicker">Entrez dans la légende</span>
          <h1 className="contact__title">
            Conciergerie <span className="contact__title-accent">&amp;</span> Contact
          </h1>
          <p className="contact__subtitle">
            Chaque requête est une promesse d'exception. Notre service de conciergerie
            et nos équipes se tiennent à votre disposition pour sublimer votre
            expérience.
          </p>
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="contact__grid">
          {/* ─── LEFT ─── */}
          <aside className="contact__left">
            <div className="contact__cards">
              {CONTACT_CARDS.map(c => (
                <a key={c.title} href={c.href} className="contact-card">
                  <img src={c.icon} alt="" className="contact-card__icon" />
                  <div className="contact-card__body">
                    <h3 className="contact-card__title">{c.title}</h3>
                    <span className="contact-card__value">{c.value}</span>
                    <span className="contact-card__note">{c.note}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="contact-map">
              <header className="contact-map__head">
                <h3 className="contact-map__venue">Le Palais des Beaux-Arts</h3>
                <span className="contact-map__city">Lille, France</span>
              </header>
              <div className="contact-map__image">
                <img src="/images/contact-map.png" alt="Carte du Palais des Beaux-Arts à Lille" />
              </div>
              <p className="contact-map__address">Place de la République, 59000 Lille</p>
            </div>

            <div className="contact-social">
              <span className="contact-social__label">Suivez l'événement</span>
              <div className="contact-social__divider" />
              <div className="contact-social__links">
                <a href="#" className="contact-social__btn" aria-label="Partager">
                  <img src="/images/icon-share-card.svg" alt="" />
                </a>
                <a href="#" className="contact-social__btn" aria-label="Plus">
                  <img src="/images/icon-sparkle.svg" alt="" />
                </a>
              </div>
            </div>
          </aside>

          {/* ─── RIGHT ─── */}
          <section className="contact__right">
            <form
              onSubmit={e => e.preventDefault()}
              className="contact-form"
            >
              <span className="contact-form__corner-v" aria-hidden="true" />
              <span className="contact-form__corner-h" aria-hidden="true" />

              <header className="contact-form__header">
                <h2 className="contact-form__title">Demande de Renseignements</h2>
                <p className="contact-form__desc">
                  Veuillez renseigner vos coordonnées pour une prise en charge
                  personnalisée par nos hôtes.
                </p>
              </header>

              <div className="contact-form__body">
                <div className="contact-form__row">
                  <div className="contact-field">
                    <label className="contact-field__label">Nom complet</label>
                    <input type="text" placeholder="Ex. Jean de Beaumont" className="contact-field__input" />
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Adresse email</label>
                    <input type="email" placeholder="contact@prestige.com" className="contact-field__input" />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="contact-field">
                    <label className="contact-field__label">Objet de la demande</label>
                    <div className="contact-select">
                      <select className="contact-field__select" defaultValue="Réservation VIP">
                        {SUBJECTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <img src="/images/icon-chevron-down.svg" alt="" className="contact-select__chevron" />
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-field__label">Téléphone</label>
                    <input type="tel" placeholder="+33 6 ..." className="contact-field__input" />
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-field__label">Votre message</label>
                  <textarea
                    placeholder="Comment pouvons-nous rendre votre soirée inoubliable ?"
                    className="contact-field__textarea"
                    rows={5}
                  />
                </div>

                <label className="contact-checkbox">
                  <input type="checkbox" className="contact-checkbox__input" />
                  <span className="contact-checkbox__box" aria-hidden="true" />
                  <span className="contact-checkbox__label">
                    Je souhaite bénéficier du programme de conciergerie privée pour
                    les membres Gold.
                  </span>
                </label>

                <button type="submit" className="contact-form__submit">
                  Envoyer la requête
                </button>
              </div>
            </form>

            <article className="contact-vip">
              <img src="/images/contact-vip-spotlight.png" alt="" className="contact-vip__bg" />
              <div className="contact-vip__gradient" aria-hidden="true" />
              <div className="contact-vip__content">
                <div className="contact-vip__heading">
                  <img src="/images/icon-star.svg" alt="" className="contact-vip__icon" />
                  <h3 className="contact-vip__title">L'Exclusivité à votre service</h3>
                </div>
                <p className="contact-vip__desc">
                  Nos membres bénéficient d'un accès direct à notre maître de cérémonie
                  pour toute demande particulière (héliport, voiturier privé, suite impériale).
                </p>
              </div>
            </article>
          </section>
        </div>
      </main>

      <FooterContact />
    </>
  );
}
