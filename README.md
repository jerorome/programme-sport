# APEX — Guide de déploiement

## Stack
- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Vercel** (hébergement)
- **Tailwind CSS**

---

## 1. Supabase — 10 minutes

### Créer le projet
1. Va sur [supabase.com](https://supabase.com) → "New project"
2. Nom : `apex-app`, choisis une région proche (Europe West)
3. Attends ~2 minutes que le projet s'initialise

### Créer les tables
1. Dans le dashboard Supabase → **SQL Editor**
2. Colle le contenu du fichier `supabase-schema.sql`
3. Clique "Run" — toutes les tables sont créées avec RLS

### Activer Google Auth
1. **Authentication** → **Providers** → **Google** → Enable
2. Va sur [console.cloud.google.com](https://console.cloud.google.com)
3. Crée un projet OAuth → Credentials → OAuth 2.0 Client ID
4. Authorized redirect URI : `https://XXXXXX.supabase.co/auth/v1/callback`
5. Copie Client ID + Secret dans Supabase → Google provider

### Récupérer les clés API
1. **Settings** → **API**
2. Copie `Project URL` et `anon public key`

---

## 2. Variables d'environnement

Crée un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXX
```

---

## 3. Développement local

```bash
# Installer les dépendances
npm install

# Lancer en dev
npm run dev
# → http://localhost:3000
```

---

## 4. Déploiement Vercel

### Première fois
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Répondre aux questions :
# - Link to existing project? No
# - Project name: apex-app
# - Directory: ./
# - Override settings? No
```

### Ajouter les variables d'environnement sur Vercel
1. Va sur [vercel.com](https://vercel.com) → ton projet `apex-app`
2. **Settings** → **Environment Variables**
3. Ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL` → ta valeur
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ta valeur
4. **Redéploie** : `vercel --prod`

### Mettre à jour l'URL de callback Supabase
1. Dans Supabase → **Authentication** → **URL Configuration**
2. **Site URL** : `https://apex-app-xxxx.vercel.app`
3. **Redirect URLs** : `https://apex-app-xxxx.vercel.app/**`

---

## 5. Importer tes données depuis la v7 HTML

1. Dans APEX v7 HTML → **Export JSON** (bouton dans la séance)
2. Dans APEX Next.js → `/dashboard/import`
3. Upload le fichier — toutes tes séances, PR et journal sont importés

---

## 6. Structure des routes

```
/                     → redirect login ou dashboard
/login                → Magic link + Google
/auth/callback        → OAuth handler
/dashboard            → Séance du jour
/dashboard/history    → Historique
/dashboard/journal    → Journal de forme
/dashboard/stats      → Statistiques
/dashboard/objectif   → Objectif + poids + déficit
/dashboard/import     → Import depuis JSON
```

---

## 7. Domaine personnalisé (optionnel)

Si tu veux `apex.jeromesuider.fr` :
1. Vercel → Settings → Domains → Add `apex.jeromesuider.fr`
2. Dans ton registrar DNS : CNAME `apex` → `cname.vercel-dns.com`

---

## Variables importantes

| Variable | Où la trouver |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |

---

## Notes

- **RLS activé** sur toutes les tables — chaque utilisateur ne voit que ses données
- **Magic link** : l'email de connexion arrive en ~30 secondes
- **PWA** : sur Chrome Android, une bannière "Installer" apparaît automatiquement
- **iOS** : Partager → Ajouter à l'écran d'accueil
