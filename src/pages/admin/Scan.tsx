import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import AdminLayout from '../../components/layout/AdminLayout';
import { verifyTicket } from '../../lib/verifyTicket';
import type { VerifyResult } from '../../lib/verifyTicket';

const SCANNER_ID = 'ticket-scanner';

type Phase = 'scanning' | 'checking' | 'result';

const REJECT_REASONS: Record<string, string> = {
  not_found: 'Billet introuvable dans le système.',
  not_paid: "Le paiement de ce billet n'est pas confirmé.",
  empty: 'Aucun code lisible.',
  invalid_request: 'Code illisible ou invalide.',
};

export default function Scan() {
  const [phase, setPhase] = useState<Phase>('scanning');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lockRef = useRef(false);

  const stopScanner = async () => {
    const s = scannerRef.current;
    scannerRef.current = null;
    if (s) {
      try {
        await s.stop();
        s.clear();
      } catch {
        /* déjà arrêté */
      }
    }
  };

  const handleCode = async (code: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    await stopScanner();
    setPhase('checking');
    setError(null);
    try {
      const res = await verifyTicket(code);
      setResult(res);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : String(e));
    }
    setPhase('result');
  };

  // Démarre la caméra dès qu'on entre en phase de scan.
  useEffect(() => {
    if (phase !== 'scanning') return;
    if (!document.getElementById(SCANNER_ID)) return;

    lockRef.current = false;
    setError(null);
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          void handleCode(decoded);
        },
        () => {
          /* erreurs de décodage par image ignorées */
        },
      )
      .catch(() => {
        setError(
          "Impossible d'accéder à la caméra. Autorisez l'accès dans le navigateur ou utilisez la saisie manuelle ci-dessous.",
        );
      });

    return () => {
      void stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const reset = () => {
    setResult(null);
    setError(null);
    setManualCode('');
    setPhase('scanning');
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) void handleCode(manualCode.trim());
  };

  return (
    <AdminLayout>
      <div className="admin-scan">
        <header className="admin-scan__header">
          <h1 className="admin-scan__title">Contrôle des billets</h1>
          <p className="admin-scan__subtitle">
            Scannez le QR code d'un billet pour vérifier son authenticité à l'entrée.
          </p>
        </header>

        {phase === 'scanning' && (
          <div className="admin-scan__stage">
            <div id={SCANNER_ID} className="admin-scan__reader" />
            {error && <p className="admin-scan__error">{error}</p>}

            <form className="admin-scan__manual" onSubmit={submitManual}>
              <label className="admin-scan__manual-label" htmlFor="manual-code">
                Ou saisir le numéro de billet manuellement
              </label>
              <div className="admin-scan__manual-row">
                <input
                  id="manual-code"
                  type="text"
                  className="admin-scan__manual-input"
                  placeholder="LMDS-2026-XXXXXX"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <button type="submit" className="admin-scan__btn admin-scan__btn--primary">
                  Vérifier
                </button>
              </div>
            </form>
          </div>
        )}

        {phase === 'checking' && (
          <div className="admin-scan__stage admin-scan__stage--center">
            <p className="admin-scan__checking">Vérification en cours…</p>
          </div>
        )}

        {phase === 'result' && (
          <div className="admin-scan__stage admin-scan__stage--center">
            {error ? (
              <div className="admin-scan__verdict admin-scan__verdict--neutral">
                <span className="admin-scan__verdict-title">Vérification impossible</span>
                <span className="admin-scan__verdict-detail">{error}</span>
              </div>
            ) : result?.valid ? (
              <div className="admin-scan__verdict admin-scan__verdict--ok">
                <span className="admin-scan__verdict-icon" aria-hidden="true">✓</span>
                <span className="admin-scan__verdict-title">Billet authentique</span>
                {result.holder && (
                  <span className="admin-scan__verdict-detail">Titulaire : {result.holder}</span>
                )}
                {result.ticket && (
                  <span className="admin-scan__verdict-detail">{result.ticket}</span>
                )}
                {result.ticketCode && (
                  <span className="admin-scan__verdict-code">N° {result.ticketCode}</span>
                )}
              </div>
            ) : (
              <div className="admin-scan__verdict admin-scan__verdict--ko">
                <span className="admin-scan__verdict-icon" aria-hidden="true">✕</span>
                <span className="admin-scan__verdict-title">Billet rejeté</span>
                <span className="admin-scan__verdict-detail">
                  {REJECT_REASONS[result?.reason ?? ''] ?? 'Billet non valide.'}
                </span>
              </div>
            )}

            <button
              type="button"
              className="admin-scan__btn admin-scan__btn--primary"
              onClick={reset}
            >
              Scanner un autre billet
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
