// Edge Function : vérifie le statut d'une transaction (appelée par la page de
// confirmation). Le billet n'est renvoyé que si le paiement est ACCEPTED.
// Déployer avec verify_jwt = false.
import { corsHeaders, json } from '../_shared/cors.ts';
import { admin, refreshStatus } from '../_shared/cinetpay.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  let transactionId: string | undefined;
  try {
    ({ transactionId } = await req.json());
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }
  if (!transactionId) return json({ error: 'transactionId requis.' }, 400);

  const row = await refreshStatus(admin(), transactionId);
  if (!row) return json({ status: 'UNKNOWN' });

  if (row.status !== 'ACCEPTED') {
    return json({ status: row.status });
  }

  return json({
    status: 'ACCEPTED',
    ticketCode: row.ticket_code,
    ticket: {
      key: row.ticket_key,
      label: row.ticket_label,
      name: row.ticket_name,
      price: row.amount,
    },
    payment: {
      key: row.channel,
      label: row.channel === 'moov' ? 'Moov Money' : 'MTN Money',
    },
    customer: {
      prenom: row.customer_prenom,
      nom: row.customer_nom,
      email: row.customer_email,
      telephone: row.customer_telephone,
    },
    total: row.amount,
  });
});
