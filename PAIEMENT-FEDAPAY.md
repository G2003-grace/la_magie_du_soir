# Paiement en ligne — FedaPay (MTN / Moov / Carte)

La page billetterie encaisse les paiements via **FedaPay** (MTN Money, Moov Money
et carte bancaire, zone FCFA / XOF), en mode **hybride** :

- la **fenêtre de paiement** s'ouvre dans le navigateur via `checkout.js` (clé
  publique) ;
- la **transaction est créée et vérifiée côté serveur** par des Edge Functions
  Supabase qui détiennent seules la clé secrète marchande.

## Comment ça marche (flux réel)

1. Le client choisit un billet et saisit ses informations.
2. Au clic sur **Payer avec FedaPay**, le frontend appelle l'Edge Function
   `fedapay-initiate`, qui crée la transaction côté FedaPay (clé secrète) et
   enregistre une ligne `PENDING` dans la table `payments`. Elle renvoie l'`id`
   FedaPay de la transaction.
3. Le frontend ouvre la fenêtre **checkout.js** sur cette transaction
   (`FedaPay.init({ transaction: { id } })`). Le client choisit MTN, Moov ou la
   carte et **valide le paiement** (code PIN mobile money, etc.). C'est
   l'opérateur / la banque qui débite réellement.
4. FedaPay notifie le serveur (`fedapay-notify`, webhook signé).
5. La page de confirmation appelle `fedapay-status`, qui **re-vérifie le statut
   auprès de l'API FedaPay**. Le billet (QR code) n'est émis que si le statut est
   `approved`/`ACCEPTED`.

> Sécurité : la clé secrète reste uniquement côté serveur (Edge Functions). Le
> statut n'est jamais cru sur parole (ni le résultat de checkout.js, ni le
> contenu du webhook) : il est toujours revérifié auprès de FedaPay avant
> d'émettre un billet.

## Ce qu'il te reste à fournir / faire

### 1. Un compte marchand FedaPay
Dans ton tableau de bord FedaPay (`sandbox.fedapay.com` en test), récupère :
- la **clé publique** (`pk_sandbox_…` / `pk_live_…`)
- la **clé secrète** (`sk_sandbox_…` / `sk_live_…`)
- (optionnel) le **secret du webhook** (`wh_…`) pour vérifier `X-FEDAPAY-SIGNATURE`

Autorise aussi ton **nom de domaine** dans FedaPay (Profil → Applications →
*Nom de domaine à autoriser*), sinon checkout.js renverra les clients vers la
page de création de compte FedaPay au lieu du paiement.

### 2. Un projet Supabase
Dans **Settings → API** :
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

### 3. Variables d'environnement frontend
Copie `.env.example` vers `.env` et renseigne :
```
VITE_SUPABASE_URL=https://<projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon>
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_xxxx
VITE_FEDAPAY_ENVIRONMENT=sandbox
```

### 4. Secrets serveur (jamais dans le frontend)
```
supabase secrets set \
  FEDAPAY_SECRET_KEY=sk_sandbox_xxxx \
  FEDAPAY_ENVIRONMENT=sandbox \
  FEDAPAY_WEBHOOK_SECRET=wh_sandbox_xxxx \
  FRONTEND_URL=https://<ton-site-en-prod>
```

### 5. Base de données + déploiement
```
supabase link --project-ref <ref-du-projet>
supabase db push                 # ajoute provider / provider_transaction_id
supabase functions deploy fedapay-initiate
supabase functions deploy fedapay-status
supabase functions deploy fedapay-notify
```
(Les trois fonctions sont configurées avec `verify_jwt = false` dans
`supabase/config.toml`.)

### 6. URL de notification (webhook)
Dans FedaPay → Webhooks, déclare l'URL :
```
https://<projet>.supabase.co/functions/v1/fedapay-notify
```
et reporte son secret dans `FEDAPAY_WEBHOOK_SECRET`. Tant que ce secret n'est
pas défini, la vérification de signature est ignorée (le statut reste de toute
façon re-vérifié via l'API).

## Important pour les tests
- En local (`localhost`), FedaPay ne peut pas appeler le webhook. La page de
  confirmation re-vérifie quand même le statut (avec quelques tentatives), donc
  le flux fonctionne ; pour un test 100 % fidèle, déploie le frontend sur une
  URL HTTPS publique.
- Statuts FedaPay → interne : `approved`/`transferred` → `ACCEPTED` ;
  `declined`/`canceled`/`expired` → `REFUSED` ; sinon `PENDING`.

## Fichiers ajoutés / modifiés
- `index.html` — chargement de `checkout.js`.
- `src/lib/fedapay.ts` — initiate (serveur) + ouverture checkout.js + statut.
- `src/pages/Billetterie.tsx` — paiement via FedaPay au clic.
- `src/pages/BilletterieConfirmation.tsx` — vérification du statut avant émission.
- `supabase/functions/fedapay-initiate` — création de la transaction.
- `supabase/functions/fedapay-status` — vérification (frontend).
- `supabase/functions/fedapay-notify` — webhook FedaPay (signature + re-vérif).
- `supabase/functions/_shared/fedapay.ts` — logique de vérification partagée.
- `supabase/migrations/…_fedapay.sql` — colonnes `provider` / `provider_transaction_id`.
- `.env.example` — variables FedaPay (frontend + secrets serveur).

> L'ancienne intégration **CinetPay** reste présente (fonctions `cinetpay-*`) mais
> n'est plus utilisée par la page billetterie. Tu peux la supprimer si tu n'en as
> plus besoin.
