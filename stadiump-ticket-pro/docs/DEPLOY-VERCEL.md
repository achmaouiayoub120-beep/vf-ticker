# Déploiement Stadium Ticket Pro sur Vercel

Guide pour un déploiement **expert** : frontend sur Vercel, backend sur Railway (ou Render).

## Architecture de déploiement

```
[Utilisateur]
     │
     ▼
[Vercel] ← Frontend (React + Vite) — https://votre-app.vercel.app
     │
     │  VITE_API_URL
     ▼
[Railway / Render] ← Backend NestJS + PostgreSQL + Redis
     │
     ├── Stripe Webhooks (URL publique du backend)
     └── CORS autorise l’origine Vercel
```

## Étape 1 — Frontend sur Vercel

1. **Connexion**  
   [vercel.com](https://vercel.com) → Login avec GitHub/GitLab/Bitbucket.

2. **Nouveau projet**  
   Import du repo → **Configure** :
   - **Root Directory** : `frontend` (obligatoire pour ce monorepo)
   - **Framework** : Vite (détecté automatiquement si présent)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

3. **Variables d’environnement**  
   Settings → Environment Variables (Production + Preview si besoin) :

   | Variable | Valeur | Obligatoire |
   |----------|--------|-------------|
   | `VITE_API_URL` | `https://votre-backend.railway.app` | Oui |

   Sans `VITE_API_URL`, les appels API iront en relatif et échoueront en production.

4. **Déploiement**  
   Deploy. L’URL sera du type : `https://stadiump-ticket-pro-xxx.vercel.app`.

5. **Optionnel — Domaine personnalisé**  
   Settings → Domains → ajouter votre domaine.

---

## Étape 2 — Backend sur Railway

1. **Créer un projet**  
   [railway.app](https://railway.app) → New Project.

2. **PostgreSQL**  
   Add Service → Database → PostgreSQL. Noter l’URL (ex. `DATABASE_URL`).

3. **Redis**  
   Add Service → Database → Redis. Noter l’URL (ex. `REDIS_URL`).

4. **Backend**  
   Add Service → GitHub Repo → choisir le repo.
   - **Root Directory** : `backend`
   - **Build** : `npm install && npm run build`
   - **Start** : `npm run start:prod`
   - **Variables d’environnement** (dans Variables) :

   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_ACCESS_SECRET=<générer une clé longue>
   JWT_REFRESH_SECRET=<générer une autre clé>
   STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   FRONTEND_URL=https://votre-app.vercel.app
   ```

5. **Exposer le service**  
   Settings → Networking → Generate Domain. Copier l’URL (ex. `https://backend-xxx.railway.app`).

6. **Stripe Webhook**  
   Dans le tableau de bord Stripe : Webhooks → Add endpoint :
   - URL : `https://backend-xxx.railway.app/api/payments/webhook`
   - Événements : `payment_intent.succeeded`
   - Copier le **Signing secret** → mettre dans `STRIPE_WEBHOOK_SECRET`.

7. **Mettre à jour Vercel**  
   Dans Vercel, modifier `VITE_API_URL` : `https://backend-xxx.railway.app` (sans slash final). Redéployer si besoin.

---

## Étape 3 — CORS et sécurité

- Le backend doit autoriser `FRONTEND_URL` (et éventuellement `https://*.vercel.app` en preview).
- Ne pas exposer de secrets dans le frontend ; seul `VITE_*` est public (ex. `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`).

---

## Résumé des URLs après déploiement

| Rôle | URL |
|------|-----|
| Site (frontend) | `https://votre-app.vercel.app` |
| API | `https://backend-xxx.railway.app` |
| Webhook Stripe | `https://backend-xxx.railway.app/api/payments/webhook` |

En local : frontend `http://localhost:3000`, API `http://localhost:8000` (ou 3001 selon config).
