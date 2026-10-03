# 💸 FinanceFlow — Personal Finance Tracker

<div align="center">

![FinanceFlow Banner](https://img.shields.io/badge/FinanceFlow-Personal%20Finance%20Tracker-16a34a?style=for-the-badge&logo=trending-up)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**Suivez vos dépenses · Gérez votre budget · Comprenez où va votre argent**

Démo publique : lien à ajouter après déploiement.

[Signaler un bug](https://github.com/seiff-23/FinanceFlow/issues) · [Proposer une feature](https://github.com/seiff-23/FinanceFlow/issues)

</div>

---

## ✨ Fonctionnalités

| Feature | Description |
|---|---|
| 🔐 **Authentification JWT** | Inscription, connexion sécurisée, routes protégées |
| 📊 **Dashboard interactif** | Solde, revenus, dépenses, graphiques Recharts |
| 💳 **CRUD Transactions** | Ajouter, modifier, supprimer, filtrer, rechercher |
| 🎯 **Budget mensuel** | Budget global + par catégorie avec alertes visuelles |
| 📁 **Export CSV** | Téléchargement des transactions filtrées |
| 🌙 **Mode sombre/clair** | Toggle avec persistance localStorage |
| 📱 **Responsive** | Mobile, tablette, desktop |
| 🔒 **Multi-utilisateur** | Données isolées par compte (userId) |

---

## 🛠️ Stack technique

```
Backend                     Frontend
──────────────────────      ──────────────────────────────
Node.js + Express           React 18 + TypeScript + Vite
MongoDB + Mongoose          TailwindCSS 3
JWT (jsonwebtoken)          Recharts (graphiques)
bcryptjs (hash mdp)         Axios (HTTP client)
express-validator           react-hot-toast (notifications)
                            lucide-react (icônes)
```

---

## 🚀 Installation & Lancement

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Un cluster **MongoDB Atlas** (gratuit sur [mongodb.com/atlas](https://mongodb.com/atlas))

### 1. Cloner le projet

```bash
git clone https://github.com/seiff-23/FinanceFlow.git
cd FinanceFlow
```

### 2. Configurer les variables d'environnement

**Backend :**
```bash
cp backend/.env.example backend/.env
```

Éditez `backend/.env` :
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/financeflow?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend :**
```bash
cp frontend/.env.example frontend/.env
```

Le fichier `frontend/.env` contient :
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installer les dépendances

```bash
npm run install:all
```

Cela installe les dépendances dans `/`, `/backend` et `/frontend`.

### 4. Lancer en développement

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

---

## ☁️ Configuration MongoDB Atlas

1. Créez un compte sur [mongodb.com/atlas](https://cloud.mongodb.com)
2. Créez un **cluster gratuit** (M0)
3. Dans **Database Access** : créez un utilisateur avec mot de passe
4. Dans **Network Access** : ajoutez `0.0.0.0/0` (ou votre IP)
5. Cliquez **Connect** → **Connect your application** → copiez l'URI
6. Collez l'URI dans `backend/.env` en remplaçant `<password>` par votre mot de passe

---

## 📁 Structure du projet

```
FinanceFlow/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # Connexion MongoDB
│   │   ├── controllers/
│   │   │   ├── authController.js     # Inscription / Connexion / Me
│   │   │   ├── transactionController.js  # CRUD + Stats
│   │   │   └── budgetController.js   # Budget mensuel (upsert)
│   │   ├── middleware/auth.js        # Vérification JWT
│   │   ├── models/
│   │   │   ├── User.js               # Modèle utilisateur (bcrypt)
│   │   │   ├── Transaction.js        # Modèle transaction
│   │   │   └── Budget.js             # Modèle budget mensuel
│   │   ├── routes/
│   │   │   ├── auth.js               # POST /register /login, GET /me
│   │   │   ├── transactions.js       # GET POST PUT DELETE /transactions
│   │   │   └── budgets.js            # GET POST /budgets
│   │   └── app.js                    # Express entry point
│   ├── .env                          # Variables (non committé)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Barre de navigation
│   │   │   ├── TransactionForm.tsx   # Modal ajout/édition
│   │   │   ├── TransactionCard.tsx   # Carte transaction
│   │   │   ├── BudgetCard.tsx        # Aperçu budget avec barres
│   │   │   ├── StatsCard.tsx         # Carte statistique
│   │   │   ├── ProtectedRoute.tsx    # HOC route protégée
│   │   │   └── ThemeToggle.tsx       # Bouton dark/light
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── DashboardPage.tsx     # Page principale (tabs)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # State auth global
│   │   │   └── ThemeContext.tsx      # State thème global
│   │   ├── hooks/
│   │   │   ├── useTransactions.ts    # CRUD transactions
│   │   │   └── useBudget.ts          # Fetch/save budget
│   │   ├── services/api.ts           # Axios + generateCSV
│   │   ├── types/index.ts            # Types TypeScript
│   │   ├── App.tsx                   # Router + Toaster
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind + composants
│   └── package.json
│
├── package.json                      # Scripts root (concurrently)
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | ❌ |
| POST | `/api/auth/login` | Se connecter | ❌ |
| GET | `/api/auth/me` | Profil connecté | ✅ |

### Transactions
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/transactions` | Liste (filtres: month, year, search) | ✅ |
| GET | `/api/transactions/stats` | Stats dashboard | ✅ |
| POST | `/api/transactions` | Créer une transaction | ✅ |
| PUT | `/api/transactions/:id` | Modifier | ✅ |
| DELETE | `/api/transactions/:id` | Supprimer | ✅ |

### Budgets
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/budgets?month=&year=` | Budget du mois | ✅ |
| POST | `/api/budgets` | Sauvegarder (upsert) | ✅ |

---

## 🏗️ Build pour la production

```bash
# Build du frontend
cd frontend && npm run build

# Démarrer le backend en production
cd backend && NODE_ENV=production npm start
```

Pour servir le frontend depuis Express, ajoutez dans `backend/src/app.js` :
```javascript
const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
```

---

## 🔧 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance backend + frontend en parallèle |
| `npm run dev:backend` | Lance uniquement le backend (nodemon) |
| `npm run dev:frontend` | Lance uniquement le frontend (Vite) |
| `npm run install:all` | Installe toutes les dépendances |
| `npm run build` | Build production du frontend |

---

## 📋 Catégories

**Dépenses** : Alimentaire · Transport · Logement · Loisirs · Santé · Shopping · Factures · Restaurants · Autre

**Revenus** : Salaire · Freelance · Cadeau · Investissement · Autre

---

## 👤 Auteur

**Seif Eddine Mechkene** — Développeur Full-Stack

[![GitHub](https://img.shields.io/badge/GitHub-seiff--23-181717?style=flat-square&logo=github)](https://github.com/seiff-23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Seif%20Eddine-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/seifmechkene)

---

## 📄 Licence

La licence annoncée pour ce projet est **MIT**. Le fichier LICENSE reste à ajouter au dépôt.

---

<div align="center">
  Fait avec ❤️ par <strong>Seif Eddine Mechkene</strong>
</div>
