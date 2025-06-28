# Pragttle 🐦

Une application de réseau social moderne construite avec une architecture microservices et déployée avec GitOps.

## 🏗️ Architecture

```mermaid
Pragttle/
├── apps/
│   ├── backend/          # API Rust avec Axum
│   ├── frontend/         # Interface Next.js
│   └── database/         # Configuration PostgreSQL
├── argo/                 # Configuration Argo CD
├── clusters/             # Configuration K3d
└── scripts/              # Scripts d'automatisation
```

## 🚀 Technologies

- **Backend** : Rust + Axum + SQLx
- **Frontend** : Next.js + TypeScript + Tailwind CSS
- **Base de données** : PostgreSQL
- **Infrastructure** : Kubernetes + K3d
- **GitOps** : Argo CD
- **CI/CD** : GitHub Actions

## 📦 Pipeline CI/CD

Pragttle utilise un pipeline CI/CD complet avec GitHub Actions :

1. **Build** : Construction des images Docker
2. **Test** : Tests automatisés
3. **Push** : Publication sur GitHub Container Registry
4. **Deploy** : Déploiement automatique via Argo CD

## 🛠️ Installation

### Prérequis

- Docker
- kubectl
- k3d
- argocd CLI

### Démarrage rapide

```bash
# Cloner le repository
git clone https://github.com/benoit-planche/Pragttle.git
cd Pragttle

# Installer les dépendances
make install

# Démarrer le cluster local
make cluster

# Déployer l'application
make deploy
```

## 📚 Documentation

- [Guide de Setup](docs/setup.md)
- [Pipeline CI/CD](docs/ci-cd-pipeline.md)
- [Progression Frontend](docs/frontend-progress.md)

## 🎯 Fonctionnalités

- ✅ Authentification utilisateur
- ✅ Création et affichage de posts
- ✅ Interface responsive
- ✅ API RESTful
- ✅ Déploiement GitOps

## 🔧 Développement

### Backend

```bash
cd apps/backend
cargo run
```

### Frontend

```bash
cd apps/frontend
npm run dev
```

## 🚀 Déploiement

### Local

```bash
make deploy
```

### Production

```bash
# Configurer les secrets GitHub
./scripts/setup-github-secrets.sh

# Démarrer la CI/CD
./scripts/start-ci-cd.sh
```

## 📊 Monitoring

- **Argo CD** : <http://localhost:8080>
- **Application** : <http://localhost:3000>

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**Pragttle** - Le futur des réseaux sociaux 🧠🔥
