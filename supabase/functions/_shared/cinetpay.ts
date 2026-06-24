// Logique partagée : interroge CinetPay sur le statut réel d'une transaction
// et met à jour la table payments en conséquence (source de vérité = CinetPay).
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const CINETPAY_CHECK_URL = 'https://api-checkout.cinetpay.com/v2/payment/check';

export function admin(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

export interface PaymentRow {
  transaction_id: string;
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
  ticket_code: string | null;
}

function ticketCodeFor(transactionId: string): string {
  const sum = Array.from(transactionId).reduce((a, c) => a + c.charCodeAt(0), 0);
  return `LMDS-2026-${(Math.abs(sum) % 900000) + 100000}`;
}

/**
 * Récupère le statut réel auprès de CinetPay, met à jour la ligne et la renvoie.
 * Ne ré-interroge pas si la transaction est déjà finalisée.
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

  const APIKEY = Deno.env.get('CINETPAY_APIKEY');
  const SITE_ID = Deno.env.get('CINETPAY_SITE_ID');
  if (!APIKEY || !SITE_ID) return row as PaymentRow;

  let cp: {
    code?: string;
    data?: { status?: string; payment_method?: string; cpm_trans_id?: string; operator_id?: string };
  };
  try {
    const res = await fetch(CINETPAY_CHECK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apikey: APIKEY, site_id: SITE_ID, transaction_id: transactionId }),
    });
    cp = await res.json();
  } catch {
    return row as PaymentRow;
  }

  // code "00" = succès de la requête de vérification ; data.status = statut paiement.
  const cpStatus = cp.data?.status;
  let newStatus = row.status;
  if (cpStatus === 'ACCEPTED') newStatus = 'ACCEPTED';
  else if (cpStatus === 'REFUSED') newStatus = 'REFUSED';

  if (newStatus === row.status && !cp.data?.cpm_trans_id) return row as PaymentRow;

  const update: Record<string, unknown> = {
    status: newStatus,
    payment_method: cp.data?.payment_method ?? null,
    cpm_trans_id: cp.data?.operator_id ?? null,
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
