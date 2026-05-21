# Willpower OS

Application mobile-first gamifiée de gestion d'habitudes personnelles.

## Stack
- **Front** : React 18 + Vite + Tailwind CSS
- **API** : Node.js + Express
- **BDD** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Vercel (front) + Render (API)

## Lancer le projet

### 1. Front-end
```bash
cd willpower-os
npm install
npm run dev
# → http://localhost:5173
```

### 2. API Express
```bash
cd willpower-os/server
npm install
npm run dev
# → http://localhost:3001
```

### 3. Setup Supabase
- Exécuter `supabase/schema.sql` dans le SQL Editor de Supabase
- Activer Email provider dans Authentication → Sign In / Providers
- Copier `.env.example` en `.env` et remplir les clés

## Structure
```
willpower-os/
├── src/                  # Front React
│   ├── components/       # Composants UI
│   ├── hooks/            # Hooks custom
│   ├── lib/              # Clients (Supabase, API)
│   └── data/             # Données statiques
├── server/               # API Express
│   ├── routes/           # GET/POST/PUT/DELETE
│   ├── middleware/        # Auth JWT
│   └── lib/              # Client Supabase serveur
└── supabase/
    └── schema.sql        # Tables + RLS
```

## Routes API
```
GET    /api/health
GET    /api/profile
PUT    /api/profile
GET    /api/habits
POST   /api/habits
DELETE /api/habits/:id
GET    /api/logs/today
PUT    /api/logs/today
GET    /api/streak
```

## Lancer avec Docker

```bash
# 1. Copier le fichier d'environnement
cp .env.docker .env

# 2. Lancer tout le projet
docker compose up --build

# Front  → http://localhost:80
# API    → http://localhost:3001
```
