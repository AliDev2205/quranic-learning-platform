# 🕌 Plateforme d'Apprentissage de la Lecture Coranique - Frontend

Frontend Next.js 14 pour la plateforme d'apprentissage de la lecture coranique de M. Soumanou Ousmane.

## 🎨 Design

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Thème**: Islamique élégant (vert, doré, bleu nuit)
- **Typography**: Inter + Amiri (police arabe)
- **Mode**: Clair / Sombre

## 📋 Prérequis

- Node.js >= 18.0.0
- Backend API en cours d'exécution

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration

Créez un fichier `.env.local` :

```bash
cp .env.local.example .env.local
```

Modifiez l'URL de l'API si nécessaire :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Build pour production
npm run build
npm start
```

Le frontend sera accessible sur : **http://localhost:3000**

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Styles globaux
│   │   ├── lecons/            # Pages leçons
│   │   ├── exercices/         # Pages exercices
│   │   ├── connexion/         # Authentification
│   │   ├── inscription/       # Inscription
│   │   ├── admin/             # Interface admin
│   │   └── profil/            # Profil apprenant
│   ├── components/            # Composants réutilisables
│   │   ├── ui/                # Composants UI de base
│   │   ├── layout/            # Header, Footer, Navigation
│   │   └── lessons/           # Composants leçons
│   ├── lib/                   # Utilitaires
│   │   ├── api.ts             # Client API
│   │   └── auth.ts            # Helpers auth
│   └── store/                 # State management (Zustand)
├── public/                    # Fichiers statiques
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 🎯 Pages principales

### Pages publiques

- `/` - Page d'accueil
- `/lecons` - Liste des leçons
- `/lecons/[slug]` - Détail d'une leçon
- `/exercices` - Liste des exercices
- `/a-propos` - À propos
- `/contact` - Contact

### Pages authentification

- `/connexion` - Connexion
- `/inscription` - Inscription

### Pages apprenant (connecté)

- `/profil` - Mon profil
- `/progression` - Ma progression
- `/favoris` - Mes favoris
- `/historique` - Historique des exercices

### Pages admin

- `/admin` - Dashboard admin
- `/admin/lecons` - Gestion des leçons
- `/admin/lecons/nouvelle` - Créer une leçon
- `/admin/exercices` - Gestion des exercices
- `/admin/categories` - Gestion des catégories
- `/admin/commentaires` - Modération
- `/admin/utilisateurs` - Gestion utilisateurs

## 🛠️ Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Client HTTP
- **Zustand** - State management
- **React Hook Form** - Gestion des formulaires
- **Sonner** - Notifications toast
- **Lucide React** - Icônes
- **date-fns** - Manipulation des dates

## 🎨 Palette de couleurs

```css
/* Vert (Primary) */
--primary-500: #22c55e
--primary-600: #16a34a
--primary-700: #15803d

/* Doré (Gold) */
--gold-400: #fbbf24
--gold-500: #f59e0b
--gold-600: #d97706

/* Bleu Nuit (Night) */
--night-800: #1e293b
--night-900: #0f172a
```

## 🔐 Authentification

Le frontend utilise JWT tokens pour l'authentification :

```typescript
// Stockage du token
localStorage.setItem('token', access_token)

// Appels API authentifiés
axios.get('/api/protected', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

## 📦 Déploiement

### Vercel (Recommandé)

```bash
# Installation de Vercel CLI
npm install -g vercel

# Déploiement
vercel
```

### Autres options

- **Netlify**: Import du repository GitHub
- **Railway**: Déploiement automatique
- **Cloudflare Pages**: Pages statiques optimisées

## 🐛 Dépannage

### Problème de connexion à l'API

Vérifiez que :
- Le backend est démarré sur le port 3001
- L'URL dans `.env.local` est correcte
- CORS est configuré correctement dans le backend

### Erreurs de build

```bash
# Nettoyer le cache
rm -rf .next
npm run build
```

### Images ne s'affichent pas

Vérifiez la configuration dans `next.config.js` :

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3001',
      pathname: '/uploads/**',
    },
  ],
}
```

## 📧 Support

Pour toute question, contactez : **Soumanou Ousmane**

## 📄 Licence

MIT - Projet personnel de M. Soumanou Ousmane

---

Développé avec ❤️ pour l'apprentissage de la lecture coranique
