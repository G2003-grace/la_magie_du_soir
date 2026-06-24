# Paiement en ligne — MTN Money / Moov Money (CinetPay)

Ce projet intègre le paiement mobile money réel via **CinetPay** (agrégateur qui
gère MTN, Moov et les cartes en une seule intégration, zone FCFA / XOF).

## Comment ça marche (flux réel)

1. Le client choisit un billet, son opérateur (MTN ou Moov) et saisit ses infos.
2. Au clic sur **Payer**, le frontend appelle l'Edge Function `cinetpay-initiate`,
   qui crée la transaction côté CinetPay et renvoie une **URL de paiement**.
3. Le client est redirigé vers la page sécurisée CinetPay, où **il valide le
   paiement sur son téléphone** (notification push / USSD + code PIN). C'est
   l'opérateur qui débite réellement le montant — un site ne peut jamais
   prélever « en silence ».
4. CinetPay notifie le serveur (`cinetpay-notify`) et renvoie le client vers la
   page de confirmation.
5. La page de confirmation appelle `cinetpay-status`, qui **re-vérifie le statut
   auprès de CinetPay**. Le billet (QR code) n'est émis que si le statut est
   `ACCEPTED`.

> Sécurité : les clés marchandes restent uniquement côté serveur (Edge
> Functions). Le statut n'est jamais cru sur parole : il est toujours revérifié
> auprès de CinetPay avant d'émettre un billet.

## Ce qu'il te reste à fournir / faire

### 1. Un compte marchand CinetPay
Récupère dans ton back-office CinetPay :
- `CINETPAY_APIKEY`
- `CINETPAY_SITE_ID`
- `CINETPAY_SECRET_KEY` (clé HMAC, pour vérifier les notifications)

### 2. Un projet Supabase
Aucun des projets existants (PronoTurf, Talyon) ne correspond à ce site — crée
un projet dédié (ou indique-m'en un). Récupère ensuite dans **Settings → API** :
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

### 3. Variables d'environnement frontend
Copie `.env.example` vers `.env` et renseigne :
```
VITE_SUPABASE_URL=https://<projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon>
```

### 4. Secrets serveur (jamais dans le frontend)
```
supabase secrets set \
  CINETPAY_APIKEY=xxxx \
  CINETPAY_SITE_ID=xxxx \
  CINETPAY_SECRET_KEY=xxxx \
  FRONTEND_URL=https://<ton-site-en-prod>
```

### 5. Base de données + déploiement
```
supabase link --project-ref <ref-du-projet>
supabase db push                 # crée la table payments
supabase functions deploy cinetpay-initiate
supabase functions deploy cinetpay-status
supabase functions deploy cinetpay-notify
```
(Les trois fonctions sont déjà configurées avec `verify_jwt = false` dans
`supabase/config.toml`.)

### 6. URL de notification
Déclare dans CinetPay l'URL de notification :
```
https://<projet>.supabase.co/functions/v1/cinetpay-notify
```

## Important pour les tests
- En local (`localhost`), CinetPay ne peut pas appeler le webhook `notify`.
  La page de confirmation revérifie quand même le statut à l'affichage, donc le
  flux fonctionne, mais pour un test 100 % fidèle, déploie le frontend sur une
  URL HTTPS publique.
- Le montant en XOF doit être un multiple de 5 (les tarifs actuels — 2000, 8000,
  20000 — sont conformes).

## Fichiers ajoutés / modifiés
- `src/lib/payment.ts` — appels aux Edge Functions (initiate / status).
- `src/pages/Billetterie.tsx` — redirection vers CinetPay au paiement.
- `src/pages/BilletterieConfirmation.tsx` — vérification du statut avant émission.
- `supabase/functions/cinetpay-initiate` — création de la transaction.
- `supabase/functions/cinetpay-status` — vérification (frontend).
- `supabase/functions/cinetpay-notify` — webhook CinetPay.
- `supabase/functions/_shared/` — CORS + logique de vérification partagée.
- `supabase/migrations/…_payments.sql` — table `payments`.
- `.env.example` — variables frontend.
