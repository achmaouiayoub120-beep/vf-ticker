# Stadium Ticket Pro — بيع تذاكر الملاعب

Application web de vente de billets pour les stades marocains. Recherche de matchs, sélection interactive des sièges, paiement Stripe, billets PDF avec QR code.

---

## Démarrage local en 3 commandes

```bash
git clone <repo-url> stadiump-ticket-pro && cd stadiump-ticket-pro
cp .env.example .env
docker-compose -f infra/docker-compose.yml up --build
```

| Service   | URL                    |
|----------|-------------------------|
| Frontend | http://localhost:3000   |
| API      | http://localhost:8000   |
| Nginx    | http://localhost:80     |

---

## Déploiement sur Vercel (frontend)

L’interface React est prête pour un déploiement **frontend uniquement** sur Vercel. L’API doit être hébergée ailleurs (Railway, Render, etc.).

### 1. Déployer le frontend sur Vercel

1. **Importer le dépôt**  
   Sur [vercel.com](https://vercel.com) : New Project → importer le repo Git.

2. **Configurer le projet**
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

3. **Variables d’environnement** (onglet Settings → Environment Variables)

   | Nom | Valeur | Remarque |
   |-----|--------|----------|
   | `VITE_API_URL` | `https://votre-api.railway.app` ou URL de votre backend | **Obligatoire** en prod |

   Optionnel (paiement Stripe côté client) :

   | Nom | Valeur |
   |-----|--------|
   | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` ou `pk_test_...` |

4. **Déployer**  
   Chaque push sur la branche principale déclenche un déploiement.

### 2. CORS côté backend

Sur votre backend (NestJS), autoriser l’origine Vercel dans CORS, par exemple :

```ts
app.enableCors({
  origin: [
    'https://votre-app.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
});
```

Ou en production avec une variable :

```ts
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
```

Et définir `FRONTEND_URL=https://votre-app.vercel.app` sur Railway/Render.

### 3. Héberger l’API (ex. Railway)

- Créer un projet sur [Railway](https://railway.app).
- Ajouter **PostgreSQL** et **Redis** (ou utiliser des services externes).
- Déployer le **backend** (dossier `backend/`) depuis le même repo (Root: `backend`, build: `npm install && npm run build`, start: `npm run start:prod`).
- Renseigner `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `STRIPE_*`, `FRONTEND_URL` dans les variables d’environnement Railway.
- Utiliser l’URL publique du service (ex. `https://xxx.railway.app`) comme `VITE_API_URL` dans Vercel.

---

## Comptes démo

| Rôle  | Email              | Mot de passe |
|-------|--------------------|--------------|
| Admin | admin1@stadium.ma  | DemoAdmin1!  |
| Admin | admin2@stadium.ma  | DemoAdmin2!  |
| User  | user1@stadium.ma   | DemoUser1!   |
| User  | user2@stadium.ma   | DemoUser2!   |

## Variables d’environnement

Voir `.env.example`. Obligatoires : `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_*` pour le paiement.

## Structure

- `backend/` — API NestJS (auth, matches, orders, payments, workers)
- `frontend/` — React 18 + Vite + TailwindCSS (déployable sur Vercel)
- `infra/` — Docker Compose, Nginx
- `db/` — Migrations et seed Maroc
- `docs/` — API OpenAPI, architecture, sécurité

## Tests

```bash
cd backend && npm run test
cd frontend && npm run test
cd frontend && npm run test:e2e
```

---

Projet réalisé par **Amine Annouka**.

---

# البدء السريع (بالعربية)

```bash
git clone <repo-url> stadiump-ticket-pro && cd stadiump-ticket-pro
cp .env.example .env
docker-compose -f infra/docker-compose.yml up --build
```

**الوصول:** الواجهة: http://localhost:3000 — API: http://localhost:8000

**النشر على Vercel:** استخدم المجلد `frontend` كمجلد الجذر، وأضف المتغير `VITE_API_URL` لرابط الـ API.

**حسابات تجريبية:** انظر الجدول أعلاه (Comptes démo).

مشروع من إنجاز **أمين أنوكة**.
