import { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { checkPayment } from '../lib/fedapay';
import type { PaymentStatusResult } from '../lib/fedapay';

type Phase = 'checking' | 'accepted' | 'pending' | 'failed' | 'error';

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
  const transactionId = (location.state as { transactionId?: string } | null)?.transactionId;

  const [phase, setPhase] = useState<Phase>('checking');
  const [order, setOrder] = useState<PaymentStatusResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!transactionId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await checkPayment(transactionId);
        if (cancelled) return;

        if (res.status === 'ACCEPTED') {
          setOrder(res);
          setPhase('accepted');
          return;
        }
        if (res.status === 'REFUSED') {
          setPhase('failed');
          return;
        }
        // PENDING / UNKNOWN : le webhook peut tarder, on réessaie quelques fois.
        attempts += 1;
        if (attempts >= 6) {
          setPhase(res.status === 'UNKNOWN' ? 'error' : 'pending');
          return;
        }
        timer = setTimeout(poll, 3000);
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(e instanceof Error ? e.message : String(e));
        setPhase('error');
      }
    };

    setPhase('checking');
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [transactionId, reloadKey]);

  // Accès direct à la page sans commande en cours.
  if (!transactionId) {
    return <Navigate to="/billetterie" replace />;
  }

  if (phase === 'checking') {
    return (
      <>
        <TopNavBar />
        <main className="confirmation">
          <header className="confirmation__header">
            <h1 className="confirmation__title">Vérification de votre paiement…</h1>
            <p className="confirmation__subtitle">
              Merci de patienter quelques instants pendant la confirmation auprès de FedaPay.
            </p>
          </header>
        </main>
        <Footer />
      </>
    );
  }

  if (phase !== 'accepted' || !order) {
    const messages: Record<string, { title: string; subtitle: string }> = {
      pending: {
        title: 'Paiement en cours de validation',
        subtitle:
          "Votre paiement n'est pas encore confirmé. Si vous venez de valider sur votre téléphone, la confirmation peut prendre quelques instants.",
      },
      failed: {
        title: 'Paiement non abouti',
        subtitle:
          "La transaction n'a pas été confirmée. Aucun montant validé n'a été retenu. Vous pouvez réessayer.",
      },
      error: {
        title: 'Vérification impossible',
        subtitle: errorMsg || "Nous n'avons pas pu vérifier votre paiement pour le moment.",
      },
    };
    const m = messages[phase] ?? messages.error;

    return (
      <>
        <TopNavBar />
        <main className="confirmation">
          <header className="confirmation__header">
            <h1 className="confirmation__title">{m.title}</h1>
            <p className="confirmation__subtitle">{m.subtitle}</p>
          </header>
          <div className="confirmation__actions">
            {phase === 'pending' || phase === 'error' ? (
              <button
                type="button"
                className="confirmation__btn confirmation__btn--primary"
                onClick={() => setReloadKey(k => k + 1)}
              >
                Vérifier à nouveau
              </button>
            ) : (
              <Link to="/billetterie" className="confirmation__btn confirmation__btn--primary">
                Réessayer le paiement
              </Link>
            )}
            <Link to="/" className="confirmation__btn confirmation__btn--ghost">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const ticket = order.ticket!;
  const customer = order.customer!;
  const total = order.total ?? ticket.price;
  const ticketCode = order.ticketCode ?? order.reference ?? transactionId;

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
                <dd>{order.payment?.label ?? 'FedaPay'}</dd>
              </div>
              {order.reference && (
                <div className="confirmation__item">
                  <dt>Référence</dt>
                  <dd>{order.reference}</dd>
                </div>
              )}
              <div className="confirmation__item confirmation__item--total">
                <dt>Montant payé</dt>
                <dd>{total.toLocaleString('fr-FR')} FCFA</dd>
              </div>
            </dl>
          </section>

          <section className="confirmation__qr-section">
            <h2 className="confirmation__section-title">Votre billet</h2>
            <div className="confirmation__qr-wrap">
              <QRPlaceholder seed={ticketCode} />
              <span className="confirmation__qr-caption">N° {ticketCode}</span>
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
