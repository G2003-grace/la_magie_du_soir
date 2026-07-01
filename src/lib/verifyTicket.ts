// Vérification d'un billet scanné (côté admin). Passe par l'Edge Function
// `verify-ticket`, qui seule peut lire la table `payments` (RLS activé).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export interface VerifyResult {
  valid: boolean;
  /** Raison de rejet : not_found | not_paid | empty | invalid_request */
  reason?: string;
  ticketCode?: string;
  holder?: string;
  ticket?: string;
}

export async function verifyTicket(code: string): Promise<VerifyResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Configuration Supabase manquante.');
  }
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/verify-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json().catch(() => ({ valid: false, reason: 'invalid_request' }));
  return data as VerifyResult;
}
