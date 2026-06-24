// Edge Function : initialise une transaction CinetPay et renvoie l'URL de paiement.
// Déployer avec verify_jwt = false (appelée avec la clé anon depuis le frontend).
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';

const CINETPAY_PAYMENT_URL = 'https://api-checkout.cinetpay.com/v2/payment';

interface Body {
  ticketKey: string;
  ticketName: string;
  ticketLabel: string;
  amount: number;
  channel: 'mtn' | 'moov';
  customer: { prenom: string; nom: string; email: string; telephone: string };
  returnUrl: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const APIKEY = Deno.env.get('CINETPAY_APIKEY');
  const SITE_ID = Deno.env.get('CINETPAY_SITE_ID');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const FRONTEND_URL = Deno.env.get('FRONTEND_URL') ?? '';

  if (!APIKEY || !SITE_ID) {
    return json({ error: 'CinetPay non configuré (CINETPAY_APIKEY / CINETPAY_SITE_ID).' }, 500);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }

  const { ticketKey, ticketName, ticketLabel, amount, channel, customer, returnUrl } = body;

  if (!ticketKey || !amount || amount < 100 || !channel || !customer?.email) {
    return json({ error: 'Données de commande incomplètes.' }, 400);
  }
  // XOF : montant multiple de 5 exigé par CinetPay.
  if (amount % 5 !== 0) return json({ error: 'Montant invalide (multiple de 5 requis).' }, 400);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const transactionId = `LMDS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { error: insertError } = await supabase.from('payments').insert({
    transaction_id: transactionId,
    ticket_key: ticketKey,
    ticket_label: ticketLabel,
    ticket_name: ticketName,
    amount,
    currency: 'XOF',
    channel,
    customer_prenom: customer.prenom,
    customer_nom: customer.nom,
    customer_email: customer.email,
    customer_telephone: customer.telephone,
    status: 'PENDING',
  });
  if (insertError) return json({ error: 'Enregistrement de la commande impossible.' }, 500);

  const base = (FRONTEND_URL || returnUrl || '').replace(/\/$/, '');
  const notifyUrl = `${SUPABASE_URL}/functions/v1/cinetpay-notify`;
  const finalReturnUrl = returnUrl || `${base}/billetterie/confirmation`;

  const payload = {
    apikey: APIKEY,
    site_id: SITE_ID,
    transaction_id: transactionId,
    amount,
    currency: 'XOF',
    description: `Billet ${ticketName} — La Magie du Soir 2026`,
    channels: 'MOBILE_MONEY',
    lang: 'fr',
    customer_name: customer.nom,
    customer_surname: customer.prenom,
    customer_email: customer.email,
    customer_phone_number: customer.telephone,
    customer_address: 'NA',
    customer_city: 'NA',
    customer_country: 'CI',
    customer_state: 'CI',
    customer_zip_code: '00000',
    notify_url: notifyUrl,
    return_url: finalReturnUrl,
    metadata: JSON.stringify({ channel, ticketKey }),
  };

  let cp: { code?: string; message?: string; data?: { payment_url?: string; payment_token?: string } };
  try {
    const cpRes = await fetch(CINETPAY_PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    cp = await cpRes.json();
  } catch {
    return json({ error: 'Service de paiement injoignable.' }, 502);
  }

  if (cp.code !== '201' || !cp.data?.payment_url) {
    return json({ error: cp.message || "Échec de l'initialisation CinetPay." }, 502);
  }

  return json({ transactionId, paymentUrl: cp.data.payment_url });
});
