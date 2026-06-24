# Déploiement du paiement en ligne (FedaPay + Supabase)

Guide pas-à-pas pour mettre la billetterie en paiement réel (**live**).
Le code est déjà terminé : il ne reste que la **sécurité des clés** et le **déploiement**.

Projet Supabase : `hroknynhnszwzkxaauak`
À exécuter dans **PowerShell**, à la racine `C:\la-magie-du-soir`.

---

## 0. 🔴 Sécurité — À FAIRE EN PREMIER

L'ancienne clé secrète `sk_live_1Ywfrr…` a été exposée (elle était dans un fichier
frontend). Elle doit être considérée comme **compromise**.

1. Aller sur FedaPay → **Profil → Applications → Clés API**.
2. **Régénérer / révoquer** le couple de clés.
3. Noter les nouvelles :
   - clé **publique** `pk_live_…`
   - clé **secrète** `sk_live_…`  ← ne JAMAIS la mettre dans un fichier `VITE_`.

Mettre ensuite la nouvelle clé publique dans `.env` :
```
VITE_FEDAPAY_PUBLIC_KEY=pk_live_TA_NOUVELLE_CLE_PUBLIQUE
VITE_FEDAPAY_ENVIRONMENT=live
```

---

## 1. CLI Supabase
La CLI est installée **localement** dans le projet (`node_modules`), donc on
l'appelle avec `npx supabase …` (et non `supabase …`).
```powershell
npx supabase --version
```

## 2. Connexion + liaison du projet
```powershell
npx supabase login
npx supabase link --project-ref hroknynhnszwzkxaauak
```
> `login` ouvre le navigateur. `link` demande le **mot de passe de la base**
> (Project Settings → Database → Database password).

## 3. Créer la table `payments`
```powershell
npx supabase db push
```

## 4. Poser les secrets serveur (clé SECRÈTE régénérée)
```powershell
npx supabase secrets set FEDAPAY_SECRET_KEY=sk_live_TA_NOUVELLE_CLE_SECRETE
npx supabase secrets set FEDAPAY_ENVIRONMENT=live
npx supabase secrets set FRONTEND_URL=https://TON-DOMAINE.com
```

## 5. Déployer les 3 Edge Functions
```powershell
npx supabase functions deploy fedapay-initiate
npx supabase functions deploy fedapay-status
npx supabase functions deploy fedapay-notify
```

## 6. Configurer FedaPay (tableau de bord)
- **Profil → Applications** : autoriser ton **nom de domaine**
  (sinon `checkout.js` redirige les clients vers l'inscription FedaPay au lieu du paiement).
- **Webhooks** : créer un webhook vers :
  ```
  https://hroknynhnszwzkxaauak.supabase.co/functions/v1/fedapay-notify
  ```
- Copier le secret du webhook `wh_live_…` puis :
```powershell
supabase secrets set FEDAPAY_WEBHOOK_SECRET=wh_live_LE_SECRET_DU_WEBHOOK
```

## 7. Test de bout en bout
1. Lancer le site (`npm run dev` en local, ou la version déployée).
2. Page **Billetterie** → choisir un billet → remplir le formulaire → **Payer avec FedaPay**.
3. Régler dans la fenêtre FedaPay (MTN / Moov / carte).
4. Vérifier que la page **Confirmation** affiche le billet + QR code.

---

## Vérifier que tout est en place (checklist)
- [ ] Clés FedaPay régénérées (l'ancienne `sk_live_1Ywfrr…` révoquée)
- [ ] `.env` : `VITE_FEDAPAY_PUBLIC_KEY` = nouvelle `pk_live_…`, `VITE_FEDAPAY_ENVIRONMENT=live`
- [ ] `supabase db push` OK (table `payments` créée)
- [ ] Secrets posés : `FEDAPAY_SECRET_KEY`, `FEDAPAY_ENVIRONMENT`, `FRONTEND_URL`, `FEDAPAY_WEBHOOK_SECRET`
- [ ] 3 fonctions déployées
- [ ] Domaine autorisé + webhook déclaré dans FedaPay
- [ ] Achat test réussi

## En cas d'erreur fréquente
| Symptôme | Cause probable |
|---|---|
| « FedaPay non configuré » | `FEDAPAY_SECRET_KEY` pas posé (étape 4) |
| Fenêtre FedaPay redirige vers une page d'inscription | Domaine non autorisé (étape 6) |
| « Enregistrement de la commande impossible » | `supabase db push` non fait (étape 3) |
| Confirmation reste sur « en cours de validation » | Webhook non déclaré, ou `FRONTEND_URL` manquant |
