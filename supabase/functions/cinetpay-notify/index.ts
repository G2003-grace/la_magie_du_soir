// Edge Function : webhook appelé par CinetPay (notify_url) après un paiement.
// On ne fait jamais confiance au contenu du POST : on re-vérifie le statut
// auprès de CinetPay. Déployer avec verify_jwt = false (CinetPay n'envoie pas de JWT).
import { corsHeaders } from '../_shared/cors.ts';
import { admin, refreshStatus } from '../_shared/cinetpay.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let transactionId: string | null = null;
  try {
    const ct = req.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      transactionId = body.cpm_trans_id ?? body.transaction_id ?? null;
    } else {
      const form = await req.formData();
      transactionId =
        (form.get('cpm_trans_id') as string | null) ??
        (form.get('transaction_id') as string | null);
    }
  } catch {
    // ignore : on répond 200 pour éviter les retries en boucle.
  }

  if (transactionId) {
    try {
      await refreshStatus(admin(), transactionId);
    } catch {
      // log silencieux ; CinetPay réessaiera.
    }
  }

  // CinetPay attend un HTTP 200.
  return new Response('OK', { status: 200, headers: corsHeaders });
});
