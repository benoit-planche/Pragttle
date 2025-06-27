# 🚀 Pipeline CI/CD RAGnagna

Ce document décrit le pipeline CI/CD automatisé pour RAGnagna utilisant GitHub Actions.

## 📋 Vue d'ensemble

Le pipeline CI/CD automatise les étapes suivantes :

1. **Tests** : Vérification du code frontend et backend
2. **Build** : Construction des images Docker
3. **Push** : Publication vers GitHub Container Registry (GHCR)
4. **Deploy** : Déploiement automatique sur le cluster Kubernetes

## 🔧 Configuration requise

### 1. Repository GitHub

- Votre code doit être dans un repository GitHub public ou privé
- Le repository doit avoir les permissions GitHub Actions activées

### 2. GitHub CLI

```bash
# Installation sur Arch Linux
sudo pacman -S github-cli

# Connexion
gh auth login
```

### 3. Configuration des secrets

Exécutez le script de configuration :

```bash
./scripts/setup-github-secrets.sh
```

## 📁 Structure du pipeline

```
.github/workflows/ci-cd.yml
├── test/           # Tests frontend et backend
├── build-and-push/ # Construction et publication des images
└── deploy/         # Déploiement sur Kubernetes
```

## 🔄 Workflow détaillé

### Job `test`

- **Déclencheur** : Push sur `main`/`develop` ou Pull Request
- **Actions** :
  - Setup Node.js 18
  - Installation des dépendances frontend
  - Tests et build frontend
  - Setup Rust
  - Build et tests backend

### Job `build-and-push`

- **Déclencheur** : Push sur `main` uniquement
- **Actions** :
  - Login au GitHub Container Registry
  - Build des images Docker (frontend + backend)
  - Push vers GHCR avec tag SHA
  - Mise à jour des manifests Kubernetes
  - Commit et push des changements

### Job `deploy`

- **Déclencheur** : Après `build-and-push`
- **Actions** :
  - Setup K3d et kubectl
  - Création du cluster local
  - Installation d'Argo CD
  - Déploiement des applications
  - Vérification du déploiement
  - Nettoyage du cluster

## 🐳 Images Docker

### Frontend

- **Image** : `ghcr.io/your-username/ragnagna/frontend:latest`
- **Port** : 3000
- **Base** : Node.js 18 Alpine

### Backend

- **Image** : `ghcr.io/your-username/ragnagna/backend:latest`
- **Port** : 8080
- **Base** : Rust Alpine

## 🔐 Sécurité

### Secrets GitHub

- `GITHUB_TOKEN` : Token avec permissions `repo`, `write:packages`, `delete:packages`

### Permissions requises

```yaml
permissions:
  contents: read
  packages: write
```

## 🚀 Utilisation

### 1. Configuration initiale

```bash
# Configurer les secrets GitHub
./scripts/setup-github-secrets.sh

# Pousser le code
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### 2. Déclenchement automatique

Le pipeline se déclenche automatiquement sur :

- Push vers `main` ou `develop`
- Pull Request vers `main`

### 3. Monitoring

- **GitHub Actions** : Onglet Actions de votre repository
- **Argo CD** : Interface web sur `http://localhost:8080`
- **Application** : `http://localhost:8080`

## 🔧 Personnalisation

### Variables d'environnement

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
```

### Branches

Modifiez les branches dans le workflow :

```yaml
on:
  push:
    branches: [ main, develop ]  # Ajoutez vos branches
```

### Registry personnalisé

Pour utiliser un autre registry (Docker Hub, etc.) :

1. Modifiez `REGISTRY` dans le workflow
2. Ajoutez les secrets correspondants
3. Mettez à jour les permissions

## 🐛 Dépannage

### Erreurs courantes

#### 1. Permission denied sur GHCR

```bash
# Vérifiez que le token a les bonnes permissions
gh secret list
```

#### 2. Build Docker échoue

```bash
# Testez localement
cd apps/frontend && docker build -t test .
cd apps/backend && docker build -t test .
```

#### 3. Déploiement Kubernetes échoue

```bash
# Vérifiez les logs
kubectl logs -n ragna deployment/ragna-app
kubectl describe pod -n ragna
```

### Logs utiles

```bash
# Logs du pipeline
gh run list
gh run view <run-id>

# Logs Kubernetes
kubectl logs -n ragna -l app=ragna-app
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
```

## 📈 Optimisations

### Cache

- **npm** : Cache des dépendances Node.js
- **Cargo** : Cache des dépendances Rust
- **Docker** : Cache des layers Docker

### Parallélisation

- Tests frontend et backend en parallèle
- Build des images en séquence (dépendances)

### Sécurité

- Images scannées automatiquement
- Secrets chiffrés
- Permissions minimales

## 🔄 Mise à jour

Pour mettre à jour le pipeline :

1. Modifiez `.github/workflows/ci-cd.yml`
2. Testez localement si possible
3. Poussez vers une branche de test
4. Vérifiez les Actions GitHub
5. Merge vers `main`

## 📞 Support

En cas de problème :

1. Vérifiez les logs GitHub Actions
2. Consultez la documentation Argo CD
3. Testez les étapes localement
4. Ouvrez une issue sur GitHub
