import { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import QRCode from 'qrcode';
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

// Vrai QR code (scannable) encodant le code du billet. Le motif est généré par
// la librairie `qrcode` sous forme de SVG, puis injecté. La classe
// `confirmation__qr-svg` est conservée pour la génération du PDF.
function TicketQR({ value }: { value: string }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#131313', light: '#ffffff' },
    })
      .then((str) => {
        if (!cancelled) setSvg(str);
      })
      .catch(() => {
        if (!cancelled) setSvg('');
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div
      className="confirmation__qr-svg"
      aria-label={`Billet électronique ${value}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
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

  const handleDownload = () => {
    const qrSvg = document.querySelector('.confirmation__qr-svg')?.outerHTML ?? '';
    const rows: Array<[string, string]> = [
      ['Billet', `${ticket.name} — ${ticket.label}`],
      ['Titulaire', `${customer.prenom} ${customer.nom}`],
      ['Téléphone', customer.telephone],
      ['Paiement', order.payment?.label ?? 'FedaPay'],
    ];
    if (order.reference) rows.push(['Référence', order.reference]);
    rows.push(['Montant payé', `${total.toLocaleString('fr-FR')} FCFA`]);

    const rowsHtml = rows
      .map(
        ([k, v]) =>
          `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`,
      )
      .join('');

    const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Billet ${ticketCode} — La Magie du Soir</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Georgia, 'Times New Roman', serif; color: #131313; background: #fff; }
  .ticket { max-width: 640px; margin: 32px auto; border: 2px solid #f7bd48; border-radius: 14px; overflow: hidden; }
  .ticket__head { background: #131313; color: #f7bd48; text-align: center; padding: 24px 20px; }
  .ticket__brand { font-size: 22px; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
  .ticket__sub { color: #e5e2e1; font-size: 13px; margin: 6px 0 0; letter-spacing: 1px; }
  .ticket__body { display: flex; gap: 24px; padding: 24px; align-items: center; flex-wrap: wrap; }
  .ticket__info { flex: 1 1 300px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 7px 0; font-size: 14px; vertical-align: top; }
  td.k { color: #6b6b6b; width: 42%; }
  td.v { font-weight: bold; text-align: right; }
  .ticket__qr { flex: 0 0 auto; text-align: center; }
  .ticket__qr svg { width: 170px; height: 170px; border: 1px solid #eee; }
  .ticket__code { margin-top: 8px; font-size: 12px; letter-spacing: 1px; }
  .ticket__foot { border-top: 1px dashed #d8b25a; padding: 16px 24px; font-size: 12px; color: #6b6b6b; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .ticket { margin: 0 auto; } }
</style>
</head>
<body onload="window.print()">
  <div class="ticket">
    <div class="ticket__head">
      <h1 class="ticket__brand">La Magie du Soir</h1>
      <p class="ticket__sub">Billet électronique — Édition 2026</p>
    </div>
    <div class="ticket__body">
      <div class="ticket__info"><table><tbody>${rowsHtml}</tbody></table></div>
      <div class="ticket__qr">
        ${qrSvg}
        <div class="ticket__code">N° ${ticketCode}</div>
      </div>
    </div>
    <div class="ticket__foot">Présentez ce QR Code à l'entrée de l'événement. Ce billet est nominatif.</div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=760,height=900');
    if (!win) {
      alert("Veuillez autoriser les fenêtres pop-up pour télécharger votre billet.");
      return;
    }
    win.document.write(html);
    win.document.close();
  };

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
              <TicketQR value={ticketCode} />
              <span className="confirmation__qr-caption">N° {ticketCode}</span>
            </div>
            <p className="confirmation__hint">
              Présentez ce QR Code à l'entrée de l'événement.
            </p>
          </section>
        </div>

        <div className="confirmation__actions">
          <button
            type="button"
            className="confirmation__btn confirmation__btn--ghost"
            onClick={handleDownload}
          >
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
