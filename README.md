# RAGnagna 🐦

Une application Twitter-like moderne construite avec une approche GitOps utilisant Argo CD et K3d.

## 🚀 Architecture

- **Frontend**: React/Next.js avec une UI moderne
- **Backend**: API REST avec authentification
- **Base de données**: PostgreSQL
- **Infrastructure**: Kubernetes avec Argo CD pour GitOps
- **Cluster local**: K3d pour le développement
- **CI/CD**: GitHub Actions avec déploiement automatique

## 📁 Structure du projet

```
RAGNagna/
├── README.md
├── Makefile                    # Commandes automatisées
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD GitHub Actions
├── clusters/
│   └── local/
│       └── k3d-config.yaml    # Configuration K3d
├── argo/
│   ├── bootstrap/
│   │   └── install-argo.yaml  # Installation Argo CD
│   └── apps/
│       └── ragna.yaml         # Application Argo CD
├── apps/
│   ├── frontend/              # Application Next.js
│   ├── backend/               # API Rust
│   └── ragna/
│       ├── base/              # Manifests de base
│       └── overlays/
│           ├── dev/           # Configuration développement
│           └── prod/          # Configuration production
├── scripts/
│   ├── bootstrap.sh           # Script d'installation automatique
│   └── setup-github-secrets.sh # Configuration CI/CD
└── docs/
    ├── setup.md               # Documentation détaillée
    └── ci-cd-pipeline.md      # Documentation CI/CD
```

## 🚀 CI/CD Pipeline

RAGnagna utilise un pipeline CI/CD complet avec GitHub Actions :

### 🔄 Workflow automatique

1. **Tests** : Vérification du code frontend et backend
2. **Build** : Construction des images Docker
3. **Push** : Publication vers GitHub Container Registry
4. **Deploy** : Déploiement automatique sur Kubernetes

### ⚡ Configuration rapide

```bash
# 1. Configurer les secrets GitHub
./scripts/setup-github-secrets.sh

# 2. Pousser le code
git push origin main

# 3. Le pipeline se déclenche automatiquement !
```

### 📊 Monitoring

- **GitHub Actions** : Onglet Actions de votre repository
- **Argo CD** : Interface web sur `http://localhost:8081`
- **Application** : `http://ragna.local:8080`

📖 [Documentation complète CI/CD](docs/ci-cd-pipeline.md)

## 🛠️ Installation rapide

### Prérequis

- Docker
- kubectl
- k3d
- argocd CLI

### Option 1 : Installation automatique (recommandée)

```bash
make bootstrap
```

### Option 2 : Installation manuelle

```bash
# 1. Créer le cluster
make cluster-create

# 2. Installer Argo CD
make argocd-install

# 3. Installer NGINX Ingress
make install-ingress

# 4. Configurer l'entrée hosts
make setup-hosts

# 5. Déployer l'application
make deploy
```

## 🎯 Commandes utiles

### Afficher l'aide

```bash
make help
```

### Gestion du cluster

```bash
make cluster-create    # Créer le cluster
make cluster-delete    # Supprimer le cluster
make status           # Afficher le statut
```

### Argo CD

```bash
make argocd-install      # Installer Argo CD
make argocd-port-forward # Exposer l'UI
```

### Application

```bash
make deploy    # Déployer l'application
make logs      # Afficher les logs
make clean     # Nettoyer tout
```

## 🌐 Accès aux services

### Argo CD UI

- URL: <https://localhost:8081>
- Username: `admin`
- Password: Récupérer avec `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d`

### RAGnagna

- URL: <http://ragna.local:8080>

## 🔄 Workflow de développement

1. **Modifier le code** dans `apps/ragna/`
2. **Commiter et pousser** vers Git
3. **Argo CD synchronise automatiquement** l'application
4. **Vérifier** avec `make status` ou l'UI Argo CD

## 🎯 Fonctionnalités

- [ ] Authentification utilisateur
- [ ] Création et partage de posts
- [ ] Système de likes et commentaires
- [ ] Timeline personnalisée
- [ ] Recherche de posts et utilisateurs
- [ ] Notifications en temps réel

## 📝 Développement

Voir `docs/setup.md` pour les instructions détaillées de développement.

## 🐛 Dépannage

### Problèmes courants

#### Cluster ne démarre pas

```bash
make cluster-delete
make cluster-create
```

#### Argo CD ne répond pas

```bash
make argocd-install
make argocd-port-forward
```

#### Application en erreur

```bash
make status
make logs
```

## 📚 Ressources

- [Documentation Argo CD](https://argo-cd.readthedocs.io/)
- [Documentation K3d](https://k3d.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Kustomize](https://kustomize.io/)
