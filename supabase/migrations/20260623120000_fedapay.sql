-- Ajout du support FedaPay à la table `payments`.
-- Le flux hybride : la transaction est créée côté serveur (clé secrète FedaPay),
-- ouverte dans le navigateur via checkout.js, puis le statut est re-vérifié
-- côté serveur avant l'émission du billet.

alter table public.payments
  add column if not exists provider text default 'cinetpay';

alter table public.payments
  add column if not exists provider_transaction_id text;  -- id transaction côté fournisseur (FedaPay)

create index if not exists payments_provider_transaction_id_idx
  on public.payments (provider_transaction_id);
