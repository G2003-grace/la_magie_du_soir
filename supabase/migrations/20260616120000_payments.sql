-- Table des transactions billetterie (paiement mobile money via CinetPay)
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  transaction_id     text unique not null,
  ticket_key         text not null,
  ticket_label       text,
  ticket_name        text,
  amount             integer not null,
  currency           text not null default 'XOF',
  channel            text,                       -- 'mtn' | 'moov'
  customer_prenom    text,
  customer_nom       text,
  customer_email     text,
  customer_telephone text,
  status             text not null default 'PENDING',  -- PENDING | ACCEPTED | REFUSED
  cpm_trans_id       text,                       -- id transaction côté CinetPay
  payment_method     text,                       -- ex: MTNCI, MOOV
  ticket_code        text,                       -- généré uniquement si ACCEPTED
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists payments_transaction_id_idx on public.payments (transaction_id);

-- RLS activée : aucun accès public direct. Seules les Edge Functions
-- (service_role) lisent/écrivent cette table.
alter table public.payments enable row level security;
