// Edge Function : crée une transaction FedaPay côté serveur (clé secrète) et
// renvoie l'id FedaPay à ouvrir avec checkout.js, ainsi que notre référence
// interne. Déployer avec verify_jwt = false (appelée avec la clé anon).
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';
import { fedapayApiBase, fedapayHeaders, unwrapTransaction } from '../_shared/fedapay.ts';

interface Body {
  ticketKey: string;
  ticketName: string;
  ticketLabel: string;
  amount: number;
  customer: { prenom: string; nom: string; email: string; telephone: string };
  /** URL de retour après paiement (callback FedaPay). */
  returnUrl?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const SECRET = Deno.env.get('FEDAPAY_SECRET_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const FRONTEND_URL = Deno.env.get('FRONTEND_URL') ?? '';

  if (!SECRET) {
    return json({ error: 'FedaPay non configuré (FEDAPAY_SECRET_KEY).' }, 500);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400);
  }

  const { ticketKey, ticketName, ticketLabel, amount, customer, returnUrl } = body;

  if (!ticketKey || !amount || amount < 100 || !customer?.email) {
    return json({ error: 'Données de commande incomplètes.' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Référence interne unique (= merchant_reference côté FedaPay).
  const transactionId = `LMDS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const base = (FRONTEND_URL || returnUrl || '').replace(/\/$/, '');
  const callbackUrl = returnUrl || (base ? `${base}/billetterie/confirmation` : undefined);

  const phone = (customer.telephone ?? '').replace(/[^\d+]/g, '');

  // 1) Création de la transaction FedaPay (clé secrète, jamais exposée au client).
  let created: Record<string, unknown> | null;
  try {
    const res = await fetch(`${fedapayApiBase()}/transactions`, {
      method: 'POST',
      headers: fedapayHeaders(),
      body: JSON.stringify({
        description: `Billet ${ticketName} — La Magie du Soir 2026`,
        amount,
        currency: { iso: 'XOF' },
        callback_url: callbackUrl,
        merchant_reference: transactionId,
        custom_metadata: { ticketKey, ref: transactionId },
        customer: {
          firstname: customer.prenom,
          lastname: customer.nom,
          email: customer.email,
          phone_number: phone ? { number: phone, country: 'bj' } : undefined,
        },
      }),
    });
    created = unwrapTransaction(await res.json());
    if (!res.ok) {
      return json({ error: "Échec de l'initialisation FedaPay." }, 502);
    }
  } catch {
    return json({ error: 'Service de paiement injoignable.' }, 502);
  }

  const fedapayId = created?.id;
  if (!fedapayId) {
    return json({ error: "Réponse FedaPay invalide (id manquant)." }, 502);
  }

  // 2) Enregistrement local (statut PENDING ; source de vérité re-vérifiée ensuite).
  const { error: insertError } = await supabase.from('payments').insert({
    transaction_id: transactionId,
    provider: 'fedapay',
    provider_transaction_id: String(fedapayId),
    ticket_key: ticketKey,
    ticket_label: ticketLabel,
    ticket_name: ticketName,
    amount,
    currency: 'XOF',
    channel: 'fedapay',
    customer_prenom: customer.prenom,
    customer_nom: customer.nom,
    customer_email: customer.email,
    customer_telephone: customer.telephone,
    status: 'PENDING',
  });
  if (insertError) return json({ error: 'Enregistrement de la commande impossible.' }, 500);

  // Le frontend ouvre checkout.js avec `transaction: { id: fedapayId }`.
  return json({ transactionId, fedapayId: String(fedapayId) });
});
