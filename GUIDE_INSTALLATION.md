# 📘 Guide d'Installation Complet
## Plateforme d'Apprentissage de la Lecture Coranique

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation de la base de données](#installation-de-la-base-de-données)
3. [Configuration du Backend](#configuration-du-backend)
4. [Configuration du Frontend](#configuration-du-frontend)
5. [Premier démarrage](#premier-démarrage)
6. [Accès à l'application](#accès-à-lapplication)
7. [Dépannage](#dépannage)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Logiciels requis

- **Node.js** (version 18 ou supérieure)
  - Téléchargement : https://nodejs.org/
  - Vérification : `node --version`

- **npm** (inclus avec Node.js)
  - Vérification : `npm --version`

- **Git** (optionnel, pour cloner le projet)
  - Téléchargement : https://git-scm.com/

### Compte requis

- **Neon PostgreSQL** (base de données gratuite)
  - Inscription : https://neon.tech
  - Créez un compte gratuit (pas de carte bancaire requise)

---

## Installation de la base de données

### 1. Créer une base de données Neon

1. Connectez-vous à https://neon.tech
2. Cliquez sur "Create a Project"
3. Donnez un nom à votre projet : `quranic-learning`
4. Sélectionnez la région la plus proche
5. Cliquez sur "Create Project"

### 2. Récupérer l'URL de connexion

1. Dans votre projet Neon, allez dans l'onglet "Dashboard"
2. Copiez la **Connection String** qui ressemble à :
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```
3. Gardez cette URL pour la configuration du backend

---

## Configuration du Backend

### 1. Naviguer dans le dossier backend

```bash
cd quranic-learning-platform/backend
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande peut prendre 2-3 minutes.

### 3. Configurer les variables d'environnement

1. Copiez le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```

2. Ouvrez le fichier `.env` avec un éditeur de texte

3. Modifiez les valeurs suivantes :

   ```env
   # Remplacez par votre URL Neon (copiée précédemment)
   DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

   # Générez une clé secrète aléatoire (minimum 32 caractères)
   JWT_SECRET="votre_cle_secrete_tres_longue_et_aleatoire_123456789"

   # Laissez les autres valeurs par défaut
   JWT_EXPIRATION="7d"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables dans la base de données
npm run prisma:migrate

# Insérer les données initiales (admin + exemples)
npm run seed
```

✅ Si tout s'est bien passé, vous verrez :
```
🌱 Début du seed...
✅ Admin créé: admin@quranic-learning.com
✅ Catégories créées: 3
✅ Leçon d'exemple créée: Introduction à la lecture coranique
🎉 Seed terminé avec succès!
```

### 5. Démarrer le backend

```bash
npm run start:dev
```

✅ Le backend est prêt quand vous voyez :
```
🚀 Backend API démarrée sur http://localhost:3001/api
✅ Base de données PostgreSQL connectée
```

**Ne fermez pas cette fenêtre !** Laissez le backend tourner.

---

## Configuration du Frontend

### 1. Ouvrir une nouvelle fenêtre de terminal

Gardez le backend actif et ouvrez un nouveau terminal.

### 2. Naviguer dans le dossier frontend

```bash
cd quranic-learning-platform/frontend
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer les variables d'environnement

1. Copiez le fichier d'exemple :
   ```bash
   cp .env.local.example .env.local
   ```

2. Le fichier `.env.local` devrait contenir :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. Si votre backend tourne sur un port différent, modifiez l'URL

### 5. Démarrer le frontend

```bash
npm run dev
```

✅ Le frontend est prêt quand vous voyez :
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## Premier démarrage

### Vérification complète

1. **Backend actif** : http://localhost:3001/api
2. **Frontend actif** : http://localhost:3000

### Connexion admin

1. Ouvrez votre navigateur : http://localhost:3000
2. Cliquez sur "Connexion"
3. Utilisez les identifiants :
   - **Email** : `admin@quranic-learning.com`
   - **Mot de passe** : `admin123`

⚠️ **Important** : Changez ce mot de passe dès votre première connexion !

### Première leçon

Après connexion, allez dans :
- `/admin` pour l'interface d'administration
- `/admin/lecons` pour voir/modifier la leçon d'exemple
- `/lecons` pour voir la vue publique

---

## Accès à l'application

### URLs principales

| Page | URL | Description |
|------|-----|-------------|
| Accueil | http://localhost:3000 | Page d'accueil publique |
| Leçons | http://localhost:3000/lecons | Liste des leçons |
| Admin | http://localhost:3000/admin | Dashboard admin |
| API | http://localhost:3001/api | Backend API |

### Comptes par défaut

**Administrateur**
- Email: `admin@quranic-learning.com`
- Mot de passe: `admin123`
- Accès: Tout

Pour créer un compte apprenant, utilisez l'inscription publique.

---

## Dépannage

### Problème : "Cannot connect to database"

**Solution** :
1. Vérifiez votre URL `DATABASE_URL` dans `.env`
2. Assurez-vous que `?sslmode=require` est présent
3. Testez la connexion sur Neon.tech
4. Redémarrez le backend

### Problème : "Port 3001 already in use"

**Solution** :
```bash
# Arrêtez le processus sur le port 3001
# Sur Mac/Linux :
lsof -ti:3001 | xargs kill -9

# Sur Windows :
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

Ou changez le port dans `backend/.env` :
```env
PORT=3002
```

### Problème : "Module not found"

**Solution** :
```bash
# Supprimez et réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problème : "Prisma Client not generated"

**Solution** :
```bash
cd backend
npm run prisma:generate
```

### Problème : "Frontend ne peut pas se connecter au backend"

**Vérifications** :
1. Backend est démarré sur le port 3001
2. `NEXT_PUBLIC_API_URL` dans `frontend/.env.local` est correct
3. Pas de firewall qui bloque la connexion
4. CORS est configuré dans le backend

### Réinitialiser complètement

Si rien ne fonctionne :

```bash
# Backend
cd backend
rm -rf node_modules
npm install
npm run prisma:generate
npx prisma migrate reset
npm run seed
npm run start:dev

# Frontend (nouveau terminal)
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

---

## Commandes utiles

### Backend

```bash
# Démarrer
npm run start:dev

# Build production
npm run build
npm run start:prod

# Voir la base de données (interface graphique)
npm run prisma:studio

# Réinitialiser la base de données
npx prisma migrate reset
```

### Frontend

```bash
# Démarrer
npm run dev

# Build production
npm run build
npm start

# Linter
npm run lint
```

---

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans le terminal
2. Consultez le README principal
3. Vérifiez que toutes les étapes ont été suivies
4. Contactez : **Soumanou Ousmane**

---

## Prochaines étapes

✅ Installation terminée !

Maintenant vous pouvez :

1. **Créer votre première leçon** dans `/admin/lecons`
2. **Ajouter des catégories** dans `/admin/categories`
3. **Créer des exercices** dans `/admin/exercices`
4. **Personnaliser le contenu** selon vos besoins

---

**Bon apprentissage ! 🕌**

*Développé avec ❤️ pour l'apprentissage de la lecture coranique*
