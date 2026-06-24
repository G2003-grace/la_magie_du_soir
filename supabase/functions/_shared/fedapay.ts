// Logique partagée FedaPay : interroge l'API FedaPay sur le statut réel d'une
// transaction et met à jour la table `payments` en conséquence.
// Source de vérité = FedaPay (jamais le contenu d'un webhook ou d'un callback).
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export function fedapayApiBase(): string {
  const env = (Deno.env.get('FEDAPAY_ENVIRONMENT') ?? 'sandbox').toLowerCase();
  return env === 'live'
    ? 'https://api.fedapay.com/v1'
    : 'https://sandbox-api.fedapay.com/v1';
}

export function fedapayHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${Deno.env.get('FEDAPAY_SECRET_KEY') ?? ''}`,
    'Content-Type': 'application/json',
  };
}

export function admin(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

export interface PaymentRow {
  transaction_id: string;
  provider: string | null;
  provider_transaction_id: string | null;
  ticket_key: string;
  ticket_label: string | null;
  ticket_name: string | null;
  amount: number;
  channel: string | null;
  customer_prenom: string | null;
  customer_nom: string | null;
  customer_email: string | null;
  customer_telephone: string | null;
  status: string;
  payment_method: string | null;
  ticket_code: string | null;
}

/** Lit l'objet transaction quelle que soit l'enveloppe renvoyée par FedaPay. */
export function unwrapTransaction(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object') return null;
  const obj = body as Record<string, unknown>;
  const wrapped = obj['v1/transaction'] ?? obj['transaction'] ?? obj;
  return wrapped && typeof wrapped === 'object'
    ? (wrapped as Record<string, unknown>)
    : null;
}

/** Traduit un statut FedaPay vers le vocabulaire interne. */
export function mapStatus(fedapayStatus: string | undefined): string {
  switch (fedapayStatus) {
    case 'approved':
    case 'transferred':
      return 'ACCEPTED';
    case 'declined':
    case 'canceled':
    case 'expired':
      return 'REFUSED';
    default:
      return 'PENDING';
  }
}

function ticketCodeFor(transactionId: string): string {
  const sum = Array.from(transactionId).reduce((a, c) => a + c.charCodeAt(0), 0);
  return `LMDS-2026-${(Math.abs(sum) % 900000) + 100000}`;
}

/**
 * Récupère le statut réel auprès de FedaPay (via provider_transaction_id),
 * met à jour la ligne et la renvoie. Ne ré-interroge pas si déjà finalisée.
 */
export async function refreshStatus(
  supabase: SupabaseClient,
  transactionId: string,
): Promise<PaymentRow | null> {
  const { data: row } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', transactionId)
    .maybeSingle();

  if (!row) return null;
  if (row.status === 'ACCEPTED' || row.status === 'REFUSED') return row as PaymentRow;
  if (!row.provider_transaction_id) return row as PaymentRow;
  if (!Deno.env.get('FEDAPAY_SECRET_KEY')) return row as PaymentRow;

  let tx: Record<string, unknown> | null;
  try {
    const res = await fetch(
      `${fedapayApiBase()}/transactions/${row.provider_transaction_id}`,
      { method: 'GET', headers: fedapayHeaders() },
    );
    tx = unwrapTransaction(await res.json());
  } catch {
    return row as PaymentRow;
  }
  if (!tx) return row as PaymentRow;

  const newStatus = mapStatus(tx.status as string | undefined);
  if (newStatus === row.status) return row as PaymentRow;

  const update: Record<string, unknown> = {
    status: newStatus,
    payment_method: (tx.mode as string | undefined) ?? row.payment_method ?? null,
    updated_at: new Date().toISOString(),
  };
  if (newStatus === 'ACCEPTED' && !row.ticket_code) {
    update.ticket_code = ticketCodeFor(transactionId);
  }

  const { data: updated } = await supabase
    .from('payments')
    .update(update)
    .eq('transaction_id', transactionId)
    .select('*')
    .maybeSingle();

  return (updated ?? row) as PaymentRow;
}
