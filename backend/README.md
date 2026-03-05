# 🕌 Plateforme d'Apprentissage de la Lecture Coranique - Backend

Backend API NestJS pour la plateforme d'apprentissage de la lecture coranique de M. Soumanou Ousmane.

## 📋 Prérequis

- Node.js >= 18.0.0
- npm ou yarn
- Compte PostgreSQL (Neon recommandé - gratuit)

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de la base de données

1. Créez un compte gratuit sur [Neon](https://neon.tech)
2. Créez une nouvelle base de données PostgreSQL
3. Copiez l'URL de connexion fournie par Neon

### 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet backend :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos informations :

```env
# Database - Remplacez par votre URL Neon
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# JWT Secret - Générez une clé sécurisée
JWT_SECRET="votre_secret_jwt_tres_securise_ici"
JWT_EXPIRATION="7d"

# Application
PORT=3001
NODE_ENV=development

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables dans la base de données
npm run prisma:migrate

# Remplir la base avec des données initiales (admin + exemples)
npm run seed
```

### 5. Démarrer le serveur

```bash
# Mode développement (avec rechargement automatique)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le backend sera accessible sur : **http://localhost:3001/api**

## 📁 Structure du projet

```
backend/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   └── seed.ts                # Données initiales
├── src/
│   ├── auth/                  # Authentification JWT
│   ├── users/                 # Gestion des utilisateurs
│   ├── lessons/               # Gestion des leçons
│   ├── categories/            # Gestion des catégories
│   ├── exercises/             # Gestion des exercices
│   ├── progress/              # Suivi de progression
│   ├── comments/              # Système de commentaires
│   ├── favorites/             # Leçons favorites
│   ├── prisma/                # Service Prisma
│   ├── app.module.ts          # Module principal
│   └── main.ts                # Point d'entrée
├── uploads/                   # Fichiers uploadés
├── .env                       # Variables d'environnement
├── .env.example               # Exemple de configuration
├── package.json
└── tsconfig.json
```

## 🔑 Compte administrateur par défaut

Après avoir exécuté le seed, vous pouvez vous connecter avec :

- **Email** : `admin@quranic-learning.com`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez ce mot de passe immédiatement en production !

## 📚 API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Leçons (Public)

- `GET /api/lessons/published` - Liste des leçons publiées
- `GET /api/lessons/slug/:slug` - Détails d'une leçon
- `GET /api/lessons/search?q=query` - Recherche

### Leçons (Admin)

- `GET /api/lessons` - Toutes les leçons
- `POST /api/lessons` - Créer une leçon
- `PATCH /api/lessons/:id` - Modifier une leçon
- `DELETE /api/lessons/:id` - Supprimer une leçon
- `POST /api/lessons/upload/image` - Upload d'image

### Catégories

- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (Admin)

### Exercices

- `GET /api/exercises` - Liste des exercices
- `POST /api/exercises` - Créer un exercice (Admin)
- `POST /api/exercises/:id/submit` - Soumettre une réponse

### Progression

- `GET /api/progress/my-progress` - Ma progression
- `POST /api/progress/mark-complete/:lessonId` - Marquer terminé

### Commentaires

- `POST /api/comments` - Ajouter un commentaire
- `GET /api/comments/pending` - Commentaires en attente (Admin)
- `PATCH /api/comments/:id/approve` - Approuver (Admin)

### Favoris

- `GET /api/favorites` - Mes favoris
- `POST /api/favorites/:lessonId` - Ajouter aux favoris
- `DELETE /api/favorites/:lessonId` - Retirer des favoris

## 🛠️ Commandes utiles

```bash
# Générer le client Prisma (après modification du schéma)
npm run prisma:generate

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface visuelle pour la BDD)
npm run prisma:studio

# Linter
npm run lint

# Build pour production
npm run build
```

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification JWT avec expiration
- Validation des données avec class-validator
- Protection CORS configurée
- Routes admin protégées par guards

## 📦 Déploiement

### Option 1: Railway (Recommandé - Gratuit)

1. Créez un compte sur [Railway](https://railway.app)
2. Connectez votre repository GitHub
3. Railway détectera automatiquement NestJS
4. Ajoutez vos variables d'environnement
5. Déployez !

### Option 2: Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau Web Service
3. Connectez votre repository
4. Configurez les variables d'environnement
5. Déployez !

### Option 3: Vercel (Backend)

```bash
npm install -g vercel
vercel
```

## 🐛 Dépannage

### Problème de connexion à la base de données

- Vérifiez que votre URL DATABASE_URL est correcte
- Assurez-vous que `?sslmode=require` est présent pour Neon
- Vérifiez que votre IP est autorisée (Neon autorise toutes les IPs par défaut)

### Erreurs Prisma

```bash
# Réinitialiser la base de données
npx prisma migrate reset

# Regénérer le client
npm run prisma:generate
```

### Port déjà utilisé

Changez le PORT dans le fichier `.env`

## 📧 Support

Pour toute question, contactez : **Soumanou Ousmane**

## 📄 Licence

MIT - Projet personnel de M. Soumanou Ousmane

---

Développé avec ❤️ pour l'apprentissage de la lecture coranique
