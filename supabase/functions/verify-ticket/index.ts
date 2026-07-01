// Edge Function : vérifie un billet scanné à l'entrée de l'événement.
// Reçoit le code du billet (contenu du QR), cherche dans `payments` un billet
// dont le paiement est ACCEPTED, et renvoie un verdict d'authenticité.
// Déployer avec verify_jwt = false (appelée avec la clé anon depuis l'admin).
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  let code: string | undefined;
  try {
    ({ code } = await req.json());
  } catch {
    return json({ valid: false, reason: 'invalid_request' }, 400);
  }

  code = (code ?? '').trim();
  if (!code) return json({ valid: false, reason: 'empty' });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // On accepte que le QR encode soit le code du billet, soit la référence interne.
  const { data } = await supabase
    .from('payments')
    .select('ticket_code, transaction_id, status, customer_prenom, customer_nom, ticket_name, ticket_label')
    .or(`ticket_code.eq.${code},transaction_id.eq.${code}`)
    .maybeSingle();

  if (!data) return json({ valid: false, reason: 'not_found' });
  if (data.status !== 'ACCEPTED') return json({ valid: false, reason: 'not_paid' });

  return json({
    valid: true,
    ticketCode: data.ticket_code,
    holder: `${data.customer_prenom ?? ''} ${data.customer_nom ?? ''}`.trim(),
    ticket: [data.ticket_name, data.ticket_label].filter(Boolean).join(' — '),
  });
});
