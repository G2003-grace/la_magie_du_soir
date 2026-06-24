// Edge Function : webhook appelé par FedaPay quand une transaction change d'état.
// On ne fait jamais confiance au contenu du POST : on re-vérifie le statut réel
// auprès de l'API FedaPay. Déployer avec verify_jwt = false (FedaPay n'envoie pas de JWT).
import { corsHeaders } from '../_shared/cors.ts';
import { admin, refreshStatus, unwrapTransaction } from '../_shared/fedapay.ts';

/** Vérifie la signature X-FEDAPAY-SIGNATURE (si un secret est configuré). */
async function signatureValid(raw: string, header: string | null): Promise<boolean> {
  const secret = Deno.env.get('FEDAPAY_WEBHOOK_SECRET');
  if (!secret) return true; // vérification désactivée tant qu'aucun secret n'est défini
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=').trim()];
    }),
  );
  const timestamp = parts['t'];
  const provided = parts['s'] ?? parts['v1'];
  if (!timestamp || !provided) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${raw}`),
  );
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expected === provided;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const raw = await req.text();

  if (!(await signatureValid(raw, req.headers.get('x-fedapay-signature')))) {
    return new Response('Invalid signature', { status: 400, headers: corsHeaders });
  }

  try {
    const event = JSON.parse(raw) as Record<string, unknown>;
    const entity =
      (event.entity as Record<string, unknown> | undefined) ??
      unwrapTransaction(event.data ?? event) ??
      undefined;

    const merchantRef = entity?.['merchant_reference'] as string | undefined;
    const fedapayId = entity?.['id'];

    const supabase = admin();
    let internalRef = merchantRef;

    if (!internalRef && fedapayId != null) {
      const { data } = await supabase
        .from('payments')
        .select('transaction_id')
        .eq('provider_transaction_id', String(fedapayId))
        .maybeSingle();
      internalRef = data?.transaction_id as string | undefined;
    }

    if (internalRef) {
      await refreshStatus(supabase, internalRef);
    }
  } catch {
    // On répond tout de même 200 pour éviter les nouvelles tentatives en boucle.
  }

  // FedaPay attend une réponse 2xx.
  return new Response('OK', { status: 200, headers: corsHeaders });
});
