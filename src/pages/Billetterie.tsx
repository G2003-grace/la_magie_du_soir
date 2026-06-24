import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import FooterBilletterie from '../components/layout/FooterBilletterie';
import { initiatePayment, openCheckout, FEDAPAY_CANCELLED } from '../lib/fedapay';

type TicketKey = 'standard' | 'vip' | 'prestige';

interface Ticket {
  key: TicketKey;
  label: string;
  name: string;
  desc: string;
  features: string[];
  price: number;
  featured?: boolean;
}

const TICKETS: Ticket[] = [
  {
    key: 'standard',
    label: 'Classique',
    name: 'Tribune Standard',
    desc: 'Une immersion complète au cœur du spectacle avec une visibilité optimale sur la scène principale.',
    features: ['Accès cérémonie', 'Placement libre', ],
    price: 2000,
  },
  {
    key: 'vip',
    label: 'Prestige',
    name: 'Tribune VIP',
    desc: "Le luxe du confort et une vue imprenable.",
    features: ['Cocktail de bienvenue', 'Placement pres du podium', ],
    price: 8000,
    featured: true,
  },
  {
    key: 'prestige',
    label: 'Ultime',
    name: 'Table Prestige',
    desc: "L'expérience ultime pour les groupes.",
    features: [],
    price: 20000,
  },
];

// Moyens de paiement acceptés dans la fenêtre FedaPay (affichage uniquement).
const ACCEPTED_METHODS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'mtn',  label: 'MTN Money',  icon: '/images/icon-mtn.svg' },
  { key: 'moov', label: 'Moov Money', icon: '/images/icon-moov.svg' },
  { key: 'visa', label: 'Carte',      icon: '/images/icon-visa.svg' },
];

export default function Billetterie() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<TicketKey | null>(null);
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', telephone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const total = selectedTicket ? TICKETS.find(t => t.key === selectedTicket)!.price : 0;

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSelectTicket = (key: TicketKey) => {
    setSelectedTicket(key);
    clearError('ticket');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPayError(null);

    const errs: Record<string, string> = {};
    if (!selectedTicket) errs.ticket = 'Veuillez sélectionner un billet.';
    if (!formData.prenom.trim()) errs.prenom = 'Prénom requis';
    if (!formData.nom.trim()) errs.nom = 'Nom requis';
    if (!formData.email.trim()) errs.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Email invalide';
    if (!formData.telephone.trim()) errs.telephone = 'Téléphone requis';
    else if (formData.telephone.replace(/\D/g, '').length < 8) errs.telephone = 'Téléphone invalide';

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      if (errs.ticket) {
        document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const ticket = TICKETS.find(t => t.key === selectedTicket)!;

    setProcessing(true);
    try {
      // 1) Création de la transaction côté serveur (clé secrète protégée).
      const { transactionId, fedapayId } = await initiatePayment({
        ticketKey: ticket.key,
        ticketName: ticket.name,
        ticketLabel: ticket.label,
        amount: total,
        customer: formData,
        returnUrl: `${window.location.origin}/billetterie/confirmation`,
      });

      // 2) Ouverture de la fenêtre de paiement FedaPay (clé publique).
      await openCheckout(fedapayId);

      // 3) La page de confirmation re-vérifie le statut réel avant d'émettre le billet.
      navigate('/billetterie/confirmation', { state: { transactionId } });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // L'utilisateur a simplement fermé la fenêtre de paiement : pas d'erreur affichée.
      if (message !== FEDAPAY_CANCELLED) {
        setPayError(message);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <TopNavBar />

      <main className="billetterie">
        {/* ─── HERO ─── */}
        <section className="billetterie__hero">
          <span className="billetterie__kicker">Accès exclusif</span>
          <h1 className="billetterie__title">
            Réservez Votre <span className="billetterie__title-accent">Nuit Éternelle</span>
          </h1>
          <p className="billetterie__subtitle">
            Vivez l'excellence d'un gala où chaque détail est une œuvre d'art.
            Sélectionnez votre privilège pour l'édition 2026.
          </p>
        </section>

        {/* ─── TICKETS ─── */}
        <section className="tickets" id="tickets">
          {errors.ticket && <div className="tickets__error">{errors.ticket}</div>}

          <div className="tickets__grid">
            {TICKETS.map(ticket => {
              const isSelected = selectedTicket === ticket.key;
              return (
                <article
                  key={ticket.key}
                  className={[
                    'ticket',
                    ticket.featured ? 'ticket--featured' : '',
                    isSelected ? 'ticket--selected' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {ticket.featured && <span className="ticket__badge">Recommandé</span>}

                  <div className="ticket__header">
                    <span className={`ticket__kicker ${ticket.featured ? 'ticket__kicker--featured' : ''}`}>
                      {ticket.label}
                    </span>
                    <h3 className="ticket__name">{ticket.name}</h3>
                  </div>

                  <div className="ticket__body">
                    <p className="ticket__desc">{ticket.desc}</p>
                    <ul className="ticket__features">
                      {ticket.features.map(f => (
                        <li key={f}>
                          <img src="/images/icon-check-gold.svg" alt="" aria-hidden="true" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="ticket__footer">
                    <div className={`ticket__price ${ticket.featured ? 'ticket__price--featured' : ''}`}>
                      <span className="ticket__amount">{ticket.price.toLocaleString('fr-FR')}</span>
                      <span className="ticket__currency">FCFA</span>
                    </div>

                    {isSelected && <div className="ticket__selected-label">✓ Sélectionné</div>}

                    <button
                      type="button"
                      onClick={() => handleSelectTicket(ticket.key)}
                      className={`ticket__btn ${ticket.featured ? 'ticket__btn--featured' : ''} ${isSelected ? 'ticket__btn--active' : ''}`}
                    >
                      {ticket.featured ? 'Réserver VIP' : 'Sélectionner'}
                    </button>
                  </div>

                  {ticket.featured && (
                    <img
                      src="/images/vip-watermark.svg"
                      alt=""
                      className="ticket__watermark"
                      aria-hidden="true"
                    />
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── JOURNEY (info + form) ─── */}
        <section className="journey">
          <div className="journey__left">
            <h2 className="journey__title">Informations de Réservation</h2>
            <p className="journey__subtitle">
              Veuillez remplir les informations requises pour valider votre présence.
              Vos billets électroniques seront envoyés instantanément après confirmation
              du paiement.
            </p>

            <ul className="journey__features">
              <li>
                <img src="/images/icon-secure.svg" alt="" aria-hidden="true" />
                <div>
                  <h4>Sécurisé</h4>
                  <p>Protocoles de cryptage de bout en bout pour vos transactions.</p>
                </div>
              </li>
              <li>
                <img src="/images/icon-digital.svg" alt="" aria-hidden="true" />
                <div>
                  <h4>Numérisé</h4>
                  <p>Accès rapide par QR Code à l'entrée de l'événement.</p>
                </div>
              </li>
            </ul>

            <figure className="journey__decorative">
              <img src="/images/billetterie-chandeliers.png" alt="Ambiance chandeliers" />
              <div className="journey__decorative-gradient" aria-hidden="true" />
            </figure>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate>
            <fieldset className="form__section">
              <legend className="form__legend">Détails personnels</legend>

              <div className="form__row-2">
                <div className="form__field">
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`form__input ${errors.prenom ? 'form__input--error' : ''}`}
                    autoComplete="given-name"
                  />
                  {errors.prenom && <span className="form__error">{errors.prenom}</span>}
                </div>
                <div className="form__field">
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`form__input ${errors.nom ? 'form__input--error' : ''}`}
                    autoComplete="family-name"
                  />
                  {errors.nom && <span className="form__error">{errors.nom}</span>}
                </div>
              </div>

              <div className="form__field">
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form__input ${errors.email ? 'form__input--error' : ''}`}
                  autoComplete="email"
                />
                {errors.email && <span className="form__error">{errors.email}</span>}
              </div>

              <div className="form__field">
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Numéro de Téléphone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`form__input ${errors.telephone ? 'form__input--error' : ''}`}
                  autoComplete="tel"
                />
                {errors.telephone && <span className="form__error">{errors.telephone}</span>}
              </div>
            </fieldset>

            <fieldset className="form__section">
              <legend className="form__legend">Paiement sécurisé via FedaPay</legend>
              <p className="form__payments-note">
                Le règlement s'effectue dans la fenêtre sécurisée FedaPay. Choisissez
                MTN Money, Moov Money ou votre carte bancaire à l'étape suivante.
              </p>
              <div className="form__payments">
                {ACCEPTED_METHODS.map(p => (
                  <div key={p.key} className="payment">
                    <img src={p.icon} alt="" className="payment__icon" />
                    <span className="payment__label">{p.label}</span>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="form__summary">
              <div className="form__total">
                <span className="form__total-label">Total à payer</span>
                <span className="form__total-value">
                  {total.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {payError && <p className="form__error form__error--submit">{payError}</p>}

              <button type="submit" className="form__submit" disabled={processing}>
                {processing ? 'Paiement en cours…' : 'Payer avec FedaPay'}
              </button>

              <p className="form__terms">
                En confirmant, vous acceptez nos conditions générales de vente.
              </p>
            </div>
          </form>
        </section>
      </main>

      <FooterBilletterie />
    </>
  );
}
