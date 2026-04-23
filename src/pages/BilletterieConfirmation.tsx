import { useLocation, Navigate, Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

interface OrderState {
  ticket: { key: string; label: string; name: string; price: number };
  payment: { key: string; label: string };
  customer: { prenom: string; nom: string; email: string; telephone: string };
  total: number;
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#f7bd48" fillOpacity="0.12" stroke="#f7bd48" strokeWidth="1.5" />
      <path d="M8 12.5l3 3 5-6" stroke="#f7bd48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QRPlaceholder({ seed }: { seed: string }) {
  const finderPositions: Array<[number, number]> = [
    [0, 0],
    [14, 0],
    [0, 14],
  ];

  const seedValue = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const inFinder =
        (x < 8 && y < 8) ||
        (x >= 13 && y < 8) ||
        (x < 8 && y >= 13);
      if (inFinder) continue;
      if ((x * 7 + y * 13 + seedValue) % 3 === 0) {
        cells.push({ x, y });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 21 21"
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Billet électronique"
      className="confirmation__qr-svg"
    >
      <rect width="21" height="21" fill="#fff" />
      {finderPositions.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} transform={`translate(${fx},${fy})`} fill="#131313">
          <rect x="0" y="0" width="7" height="1" />
          <rect x="0" y="6" width="7" height="1" />
          <rect x="0" y="0" width="1" height="7" />
          <rect x="6" y="0" width="1" height="7" />
          <rect x="2" y="2" width="3" height="3" />
        </g>
      ))}
      {cells.map(c => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="1" height="1" fill="#131313" />
      ))}
    </svg>
  );
}

export default function BilletterieConfirmation() {
  const location = useLocation();
  const state = location.state as OrderState | null;

  if (!state || !state.ticket) {
    return <Navigate to="/billetterie" replace />;
  }

  const { ticket, payment, customer, total } = state;
  const ticketId = `LMDS-2026-${(
    Math.abs(
      [...customer.email + customer.prenom].reduce((a, c) => a + c.charCodeAt(0), 0),
    ) % 900000 + 100000
  )}`;

  return (
    <>
      <TopNavBar />

      <main className="confirmation">
        <header className="confirmation__header">
          <SuccessIcon />
          <h1 className="confirmation__title">
            Merci {customer.prenom}, votre réservation est confirmée !
          </h1>
          <p className="confirmation__subtitle">
            Un email de confirmation a été envoyé à <strong>{customer.email}</strong>.
            Conservez précieusement votre billet électronique ci-dessous.
          </p>
        </header>

        <div className="confirmation__body">
          <section className="confirmation__recap">
            <h2 className="confirmation__section-title">Récapitulatif</h2>

            <dl className="confirmation__list">
              <div className="confirmation__item">
                <dt>Billet</dt>
                <dd>{ticket.name} — {ticket.label}</dd>
              </div>
              <div className="confirmation__item">
                <dt>Titulaire</dt>
                <dd>{customer.prenom} {customer.nom}</dd>
              </div>
              <div className="confirmation__item">
                <dt>Téléphone</dt>
                <dd>{customer.telephone}</dd>
              </div>
              <div className="confirmation__item">
                <dt>Paiement</dt>
                <dd>{payment.label}</dd>
              </div>
              <div className="confirmation__item confirmation__item--total">
                <dt>Montant payé</dt>
                <dd>{total.toLocaleString('fr-FR')} FCFA</dd>
              </div>
            </dl>
          </section>

          <section className="confirmation__qr-section">
            <h2 className="confirmation__section-title">Votre billet</h2>
            <div className="confirmation__qr-wrap">
              <QRPlaceholder seed={ticketId} />
              <span className="confirmation__qr-caption">N° {ticketId}</span>
            </div>
            <p className="confirmation__hint">
              Présentez ce QR Code à l'entrée de l'événement.
            </p>
          </section>
        </div>

        <div className="confirmation__actions">
          <button type="button" className="confirmation__btn confirmation__btn--ghost" disabled>
            Télécharger mon billet (PDF)
          </button>
          <Link to="/" className="confirmation__btn confirmation__btn--primary">
            Retour à l'accueil
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
