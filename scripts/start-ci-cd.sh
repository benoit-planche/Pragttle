#!/bin/bash

# Script de démarrage complet pour la CI/CD Pragttle
# Ce script configure tout l'environnement nécessaire

set -e

echo "🚀 Démarrage de Pragttle CI/CD"
echo "=============================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
print_status "Vérification des prérequis..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé"
    exit 1
fi
print_success "Docker est installé"

# Vérifier kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl n'est pas installé"
    exit 1
fi
print_success "kubectl est installé"

# Vérifier k3d
if ! command -v k3d &> /dev/null; then
    print_error "k3d n'est pas installé"
    exit 1
fi
print_success "k3d est installé"

# Vérifier gh CLI
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI n'est pas installé"
    echo "Installez-le avec: sudo pacman -S github-cli"
    echo "Puis connectez-vous avec: gh auth login"
    exit 1
fi
print_success "GitHub CLI est installé"

# Vérifier la connexion GitHub
if ! gh auth status &> /dev/null; then
    print_error "Vous n'êtes pas connecté à GitHub CLI"
    echo "Connectez-vous avec: gh auth login"
    exit 1
fi
print_success "Connecté à GitHub"

# Étape 1: Créer le cluster
print_status "Étape 1: Création du cluster K3d..."
if k3d cluster list | grep -q ragna-cluster; then
    print_warning "Cluster ragna-cluster existe déjà"
    read -p "Voulez-vous le supprimer et le recréer? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        k3d cluster delete ragna-cluster
        k3d cluster create ragna-cluster --config clusters/local/k3d-config.yaml
    fi
else
    k3d cluster create ragna-cluster --config clusters/local/k3d-config.yaml
fi
print_success "Cluster K3d créé"

# Étape 2: Installer Argo CD
print_status "Étape 2: Installation d'Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
print_success "Argo CD installé"

# Attendre qu'Argo CD soit prêt
print_status "Attente qu'Argo CD soit prêt..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
print_success "Argo CD est prêt"

# Étape 3: Configurer les secrets GitHub
print_status "Étape 3: Configuration des secrets GitHub..."
if [ -f "./scripts/setup-github-secrets.sh" ]; then
    ./scripts/setup-github-secrets.sh
else
    print_warning "Script setup-github-secrets.sh non trouvé"
    echo "Configurez manuellement les secrets GitHub:"
    echo "1. Allez dans Settings > Secrets and variables > Actions"
    echo "2. Ajoutez GITHUB_TOKEN avec les permissions nécessaires"
fi

# Étape 4: Configurer le registry GitHub
print_status "Étape 4: Configuration du registry GitHub..."
if [ -f "./scripts/configure-argocd-registry.sh" ]; then
    ./scripts/configure-argocd-registry.sh
else
    print_warning "Script configure-argocd-registry.sh non trouvé"
    echo "Configurez manuellement le secret Docker registry:"
    echo "kubectl create secret docker-registry ghcr-secret --docker-server=ghcr.io --docker-username=YOUR_USERNAME --docker-password=YOUR_TOKEN --namespace=ragna"
fi

# Étape 5: Déployer les applications
print_status "Étape 5: Déploiement des applications..."
kubectl apply -f argo/apps/postgres.yaml
kubectl apply -f argo/apps/ragna.yaml
print_success "Applications déployées"

# Étape 6: Configurer l'ingress
print_status "Étape 6: Configuration de l'ingress..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
print_success "Ingress configuré"

# Étape 7: Configuration finale
print_status "Étape 7: Configuration finale..."

# Exporter le contexte K3d
export KUBECONFIG=$(k3d kubeconfig write ragna-cluster)
print_success "Contexte Kubernetes exporté"

# Attendre que les pods soient prêts
print_status "Attente que les pods soient prêts..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
print_success "Pods Argo CD prêts"

# Afficher les informations de connexion
echo ""
echo "🎉 Configuration CI/CD terminée!"
echo "================================"
echo ""
echo "📊 Argo CD UI:"
echo "   URL: https://localhost:8081"
echo "   Username: admin"
echo "   Password: $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)"
echo ""
echo "🌐 Application Pragttle:"
echo "   URL: http://pragttle.local:8080"
echo ""
echo "🔧 Commandes utiles:"
echo "   kubectl get pods -n ragna"
echo "   kubectl get pods -n ragna-db"
echo "   kubectl get applications -n argocd"
echo ""
echo "🚀 Pour déclencher le pipeline CI/CD:"
echo "   git add ."
echo "   git commit -m 'Your commit message'"
echo "   git push origin main"
echo ""
echo "📋 Le pipeline va:"
echo "   1. Tester le code"
echo "   2. Construire les images Docker"
echo "   3. Pousser vers GitHub Container Registry"
echo "   4. Argo CD déploiera automatiquement"
echo ""
print_success "Configuration terminée avec succès!"

# Vérifier que nous sommes sur la branche main
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main pour démarrer la CI/CD"
    exit 1
fi

# Vérifier que le working directory est clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erreur: Le working directory n'est pas clean. Committez vos changements d'abord."
    exit 1
fi

# Construire les images
echo "📦 Construction des images Docker..."
./scripts/build-images.sh

# Pousser les images vers le registry
echo "📤 Push des images vers GitHub Container Registry..."
docker push ghcr.io/benoit-planche/pragttle/frontend:latest
docker push ghcr.io/benoit-planche/pragttle/backend:latest

# Pousser le code
echo "📤 Push du code vers GitHub..."
git push origin main

echo "✅ CI/CD démarrée !"
echo ""
echo "📊 Suivi:"
echo "   - GitHub Actions: https://github.com/benoit-planche/Pragttle/actions"
echo "   - Argo CD: http://localhost:8080"
echo ""
echo "🌐 Application Pragttle:"
echo "   - URL: http://pragttle.local"
echo "   - Le déploiement se fera automatiquement via Argo CD" 