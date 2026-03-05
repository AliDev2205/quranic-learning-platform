# 🕌 Plateforme d'Apprentissage de la Lecture Coranique

> Plateforme web moderne et interactive pour l'apprentissage de la lecture du Saint Coran

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

## 📖 À propos du projet

Cette plateforme permet aux apprenants de tous niveaux de maîtriser l'art de la lecture coranique (Tajweed) à travers :

- **Leçons structurées** : Du niveau débutant à avancé
- **Exercices interactifs** : QCM et questions ouvertes
- **Suivi de progression** : Historique et statistiques personnalisées
- **Interface moderne** : Design islamique élégant avec mode clair/sombre
- **Gestion autonome** : Interface admin complète pour le créateur de contenu

## 🏗️ Architecture

```
quranic-learning-platform/
├── backend/                 # API NestJS + PostgreSQL
│   ├── src/
│   ├── prisma/
│   └── uploads/
└── frontend/               # Application Next.js 14
    ├── src/
    └── public/
```

### Stack Technique

**Backend**
- NestJS 10 (Node.js, TypeScript)
- Prisma ORM
- PostgreSQL (Neon - gratuit)
- JWT Authentication
- Multer (Upload fichiers)

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- Zustand (State management)

## 🚀 Installation Rapide

### Prérequis

- Node.js >= 18.0.0
- npm ou yarn
- Compte PostgreSQL (Neon recommandé - gratuit)

### 1. Cloner le projet

```bash
git clone <repository-url>
cd quranic-learning-platform
```

### 2. Installation Backend

```bash
cd backend
npm install

# Configuration
cp .env.example .env
# Modifiez .env avec votre DATABASE_URL Neon

# Initialiser la base de données
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Démarrer le backend
npm run start:dev
```

Le backend sera sur : **http://localhost:3001/api**

### 3. Installation Frontend

```bash
cd ../frontend
npm install

# Configuration
cp .env.local.example .env.local

# Démarrer le frontend
npm run dev
```

Le frontend sera sur : **http://localhost:3000**

## 🔑 Compte Administrateur

Après le seed, connectez-vous avec :

- **Email** : `admin@quranic-learning.com`
- **Mot de passe** : `admin123`

⚠️ **Changez ce mot de passe immédiatement !**

## 📚 Fonctionnalités

### Pour les Apprenants

✅ Inscription et connexion sécurisées
✅ Navigation par catégories et niveaux
✅ Leçons avec contenu riche (texte, images, audio, vidéo)
✅ Exercices QCM avec correction automatique
✅ Suivi de progression personnalisé
✅ Système de favoris
✅ Commentaires sur les leçons
✅ Historique des exercices
✅ Mode clair/sombre
✅ Recherche et filtres
✅ Interface responsive (mobile-first)

### Pour l'Administrateur

✅ Dashboard complet
✅ Création et gestion des leçons
✅ Éditeur de contenu riche
✅ Upload d'images, audio, vidéo
✅ Gestion des exercices (QCM et questions ouvertes)
✅ Organisation par catégories
✅ Définition des niveaux (débutant, intermédiaire, avancé)
✅ Modération des commentaires
✅ Statistiques et analytics
✅ Gestion des utilisateurs

### Fonctionnalités Avancées (Phase 3)

- Certificats de progression (PDF)
- Système de notifications
- Progression par parcours
- Leaderboard
- Statistiques avancées

## 🎨 Design

- **Thème** : Islamique moderne et élégant
- **Couleurs** : Vert, Doré, Blanc, Bleu nuit
- **Typography** : Inter (latin) + Amiri (arabe)
- **Modes** : Clair et Sombre
- **Responsive** : Mobile, Tablette, Desktop

## 📱 Pages Principales

### Public

- `/` - Page d'accueil
- `/lecons` - Liste des leçons
- `/lecons/[slug]` - Détail d'une leçon
- `/exercices` - Exercices disponibles
- `/a-propos` - Présentation
- `/contact` - Formulaire de contact

### Apprenant (connecté)

- `/profil` - Mon profil
- `/progression` - Ma progression
- `/favoris` - Mes favoris
- `/historique` - Historique des exercices

### Admin

- `/admin` - Dashboard
- `/admin/lecons` - Gestion des leçons
- `/admin/exercices` - Gestion des exercices
- `/admin/categories` - Gestion des catégories
- `/admin/commentaires` - Modération
- `/admin/utilisateurs` - Gestion utilisateurs

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Protection CSRF
- Validation des données
- Routes protégées par guards
- Upload sécurisé de fichiers
- Variables d'environnement

## 📦 Déploiement

### Backend

**Option 1: Railway** (Recommandé)
```bash
# Connectez votre repo GitHub à Railway
# Railway détecte automatiquement NestJS
# Ajoutez les variables d'environnement
# Déployez !
```

**Option 2: Render**
- Créez un Web Service
- Connectez votre repository
- Configurez les variables d'environnement

### Frontend

**Vercel** (Recommandé)
```bash
npm install -g vercel
cd frontend
vercel
```

**Netlify**
- Import du repository GitHub
- Build command: `npm run build`
- Publish directory: `.next`

## 🛠️ Commandes Utiles

### Backend
```bash
npm run start:dev          # Développement
npm run build              # Build production
npm run prisma:studio      # Interface DB
npm run prisma:migrate     # Nouvelle migration
npm run seed               # Remplir la DB
```

### Frontend
```bash
npm run dev                # Développement
npm run build              # Build production
npm run start              # Production
npm run lint               # Linter
```

## 📊 Base de Données

**Modèles Prisma**
- User (Admin & Apprenants)
- Lesson (Leçons)
- Category (Catégories)
- Exercise (Exercices)
- Question (Questions)
- Answer (Réponses)
- LessonProgress (Progression)
- ExerciseResult (Résultats)
- Comment (Commentaires)
- Favorite (Favoris)

## 🤝 Contribution

Ce projet est développé pour M. Soumanou Ousmane.

## 📧 Contact

**Soumanou Ousmane**
- Email: admin@quranic-learning.com
- Projet: Plateforme d'apprentissage de la lecture coranique

## 📄 Licence

MIT - Tous droits réservés

---

## 📝 Notes de développement

### Phase 1 (Base) ✅
- ✅ Setup Backend NestJS
- ✅ Setup Frontend Next.js
- ✅ Base de données PostgreSQL
- ✅ Authentification JWT
- ✅ CRUD Leçons
- ✅ Pages publiques essentielles

### Phase 2 (Intermédiaire) 🚧
- Système d'exercices complet
- Interface admin finalisée
- Design Tailwind optimisé
- Upload de médias

### Phase 3 (Avancé) 📅
- Comptes apprenants
- Progression et historique
- Commentaires modérés
- Certificats
- Audio/Vidéo

---

**Développé avec ❤️ pour l'apprentissage de la lecture du Saint Coran**

🌙 *"Récite au nom de ton Seigneur qui a créé"* - Sourate Al-Alaq, Verset 1
