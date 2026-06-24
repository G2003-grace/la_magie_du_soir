// ─────────────────────────────────────────────────────────────────────────
//  Intégration paiement CinetPay (MTN Money / Moov Money)
//  Le frontend ne fait JAMAIS d'appel direct à CinetPay : il passe par les
//  Edge Functions Supabase, qui détiennent seules les clés marchandes.
// ─────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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

export type Channel = 'mtn' | 'moov';

export interface InitiatePaymentInput {
  ticketKey: string;
  ticketName: string;
  ticketLabel: string;
  amount: number; // FCFA (XOF)
  channel: Channel;
  customer: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
  };
  /** URL de retour après paiement (page de confirmation). */
  returnUrl: string;
}

export interface InitiatePaymentResult {
  transactionId: string;
  paymentUrl: string;
}

/**
 * Démarre une transaction. Renvoie l'URL de paiement CinetPay vers laquelle
 * on redirige le client : il y choisit/valide MTN ou Moov et confirme sur son
 * téléphone (code PIN). Le débit réel est effectué par l'opérateur.
 */
export async function initiatePayment(
  input: InitiatePaymentInput,
): Promise<InitiatePaymentResult> {
  const res = await fetch(`${functionsBase()}/cinetpay-initiate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.paymentUrl) {
    throw new Error(data?.error || "Échec de l'initialisation du paiement.");
  }
  return { transactionId: data.transactionId, paymentUrl: data.paymentUrl };
}

export type PaymentStatus = 'PENDING' | 'ACCEPTED' | 'REFUSED' | 'UNKNOWN';

export interface PaymentStatusResult {
  status: PaymentStatus;
  ticketCode?: string;
  ticket?: { key: string; label: string; name: string; price: number };
  payment?: { key: string; label: string };
  customer?: { prenom: string; nom: string; email: string; telephone: string };
  total?: number;
}

/**
 * Vérifie côté serveur le statut réel d'une transaction. Le billet n'est
 * émis que si le statut est ACCEPTED (vérifié auprès de CinetPay).
 */
export async function checkPayment(transactionId: string): Promise<PaymentStatusResult> {
  const res = await fetch(`${functionsBase()}/cinetpay-status`, {
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

export const PAYMENT_LABELS: Record<Channel, string> = {
  mtn: 'MTN Money',
  moov: 'Moov Money',
};
