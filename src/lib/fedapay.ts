// ─────────────────────────────────────────────────────────────────────────
//  Paiement FedaPay — flux hybride.
//  1) La transaction est créée CÔTÉ SERVEUR (Edge Function fedapay-initiate),
//     qui seule détient la clé secrète marchande.
//  2) Le navigateur ouvre la fenêtre de paiement via checkout.js (clé publique)
//     sur la transaction déjà créée.
//  3) Le statut réel est re-vérifié CÔTÉ SERVEUR (fedapay-status) avant
//     d'émettre le billet. On ne fait jamais confiance au résultat client.
// ─────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const PUBLIC_KEY = import.meta.env.VITE_FEDAPAY_PUBLIC_KEY;
const ENVIRONMENT = import.meta.env.VITE_FEDAPAY_ENVIRONMENT ?? 'sandbox';

/** Message d'erreur renvoyé lorsque l'utilisateur ferme la fenêtre sans payer. */
export const FEDAPAY_CANCELLED = 'FEDAPAY_CANCELLED';

function functionsBase(): string {
  if (!SUPABASE_URL) {
    throw new Error(
      "VITE_SUPABASE_URL n'est pas défini. Copiez .env.example vers .env et renseignez vos variables.",
    );
  }
  return `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1`;
}

function authHeaders(): Record<string, string> {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("VITE_SUPABASE_ANON_KEY n'est pas défini.");
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    apikey: SUPABASE_ANON_KEY,
  };
}

export interface InitiatePaymentInput {
  ticketKey: string;
  ticketName: string;
  ticketLabel: string;
  amount: number; // FCFA (XOF)
  customer: { prenom: string; nom: string; email: string; telephone: string };
  /** URL de retour après paiement (callback FedaPay). */
  returnUrl: string;
}

export interface InitiatePaymentResult {
  /** Référence interne (clé de la ligne `payments`, suivie côté confirmation). */
  transactionId: string;
  /** Id FedaPay à ouvrir avec checkout.js. */
  fedapayId: string;
}

/** Crée la transaction côté serveur et renvoie les identifiants nécessaires. */
export async function initiatePayment(
  input: InitiatePaymentInput,
): Promise<InitiatePaymentResult> {
  const res = await fetch(`${functionsBase()}/fedapay-initiate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.fedapayId) {
    throw new Error(data?.error || "Échec de l'initialisation du paiement.");
  }
  return { transactionId: data.transactionId, fedapayId: String(data.fedapayId) };
}

/**
 * Ouvre la fenêtre FedaPay (checkout.js) sur une transaction déjà créée.
 * Résout quand l'utilisateur termine le parcours, rejette avec FEDAPAY_CANCELLED
 * s'il ferme la fenêtre. Le résultat n'est PAS la preuve du paiement : le statut
 * réel est vérifié ensuite côté serveur.
 */
export function openCheckout(fedapayId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const FedaPay = window.FedaPay;

    if (!FedaPay) {
      reject(
        new Error(
          "Le module de paiement FedaPay n'a pas pu être chargé. Vérifiez votre connexion puis réessayez.",
        ),
      );
      return;
    }
    if (!PUBLIC_KEY) {
      reject(new Error('Configuration de paiement manquante (VITE_FEDAPAY_PUBLIC_KEY).'));
      return;
    }

    try {
      const widget = FedaPay.init({
        public_key: PUBLIC_KEY,
        environment: ENVIRONMENT,
        locale: 'fr',
        transaction: { id: Number(fedapayId) },
        onComplete: (response: { reason?: number }) => {
          if (response.reason === FedaPay.DIALOG_DISMISSED) {
            reject(new Error(FEDAPAY_CANCELLED));
            return;
          }
          resolve();
        },
      });
      widget.open();
    } catch (error) {
      reject(
        error instanceof Error
          ? error
          : new Error("Erreur lors de l'ouverture du paiement FedaPay."),
      );
    }
  });
}

export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'REFUSED' | 'UNKNOWN';

export interface PaymentStatusResult {
  status: PaymentStatus;
  ticketCode?: string;
  reference?: string;
  ticket?: { key: string; label: string; name: string; price: number };
  payment?: { key: string; label: string };
  customer?: { prenom: string; nom: string; email: string; telephone: string };
  total?: number;
}

/**
 * Vérifie côté serveur le statut réel d'une transaction. Le billet n'est émis
 * que si le statut est ACCEPTED (re-vérifié auprès de FedaPay).
 */
export async function checkPayment(transactionId: string): Promise<PaymentStatusResult> {
  const res = await fetch(`${functionsBase()}/fedapay-status`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ transactionId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Vérification du paiement impossible.');
  }
  return data as PaymentStatusResult;
}
