#!/bin/bash

# Script de bootstrap pour Pragttle avec GitOps et Argo CD
set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Bootstrap Pragttle avec GitOps et Argo CD"
echo "=============================================="

# Vérifier les prérequis
log_info "Vérification des prérequis..."

# Vérifier k3d
if ! command -v k3d &> /dev/null; then
    log_error "k3d n'est pas installé. Installez-le: https://k3d.io/"
    exit 1
fi

# Vérifier kubectl
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl n'est pas installé. Installez-le: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Vérifier argocd CLI
if ! command -v argocd &> /dev/null; then
    log_error "argocd CLI n'est pas installé. Installez-le: https://argo-cd.readthedocs.io/en/stable/cli_installation/"
    exit 1
fi

log_success "Tous les prérequis sont satisfaits"

# Créer le cluster K3d
log_info "Création du cluster K3d..."
k3d cluster create pragttle-cluster --config clusters/local/k3d-config.yaml

# Attendre que le cluster soit prêt
log_info "Attente du démarrage du cluster..."
kubectl wait --for=condition=Ready nodes --all --timeout=300s
log_success "Cluster K3d créé et prêt"

# Installer Argo CD
log_info "Installation d'Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f argo/bootstrap/install-argo.yaml

# Attendre qu'Argo CD soit prêt
log_info "Attente du démarrage d'Argo CD..."
kubectl wait --for=condition=Ready pods -n argocd --all --timeout=300s
log_success "Argo CD installé et prêt"

# Installer NGINX Ingress Controller
log_info "Installation de NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml

# Attendre que l'ingress controller soit prêt
log_info "Attente du démarrage de l'Ingress Controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s
log_success "NGINX Ingress Controller installé"

# Configurer l'entrée hosts
log_info "Configuration de l'entrée hosts..."
if ! grep -q "pragttle.local" /etc/hosts; then
    echo "127.0.0.1 pragttle.local" | sudo tee -a /etc/hosts
    log_success "Entrée hosts ajoutée"
else
    log_warning "Entrée hosts déjà présente"
fi

# Créer le secret pour GitHub Container Registry
log_info "Configuration du secret pour GitHub Container Registry..."
kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=benoit-planche \
    --docker-password=ghp_xxxxxxxxxxxxxxxxxxxx \
    --dry-run=client -o yaml | kubectl apply -f -

# Déployer l'application Pragttle
log_info "Déploiement de l'application Pragttle..."
kubectl apply -f argo/apps/pragttle.yaml

# Attendre la synchronisation
log_info "Attente de la synchronisation..."
kubectl wait --for=condition=Available deployment/pragttle-frontend -n pragttle --timeout=300s
kubectl wait --for=condition=Available deployment/pragttle-backend -n pragttle --timeout=300s

log_success "Installation terminée !"
echo ""
echo "🌐 Pragttle:"
echo "   - Application: http://pragttle.local"
echo "   - Argo CD: http://localhost:8080"
echo "   - Username: admin"
echo "   - Password: $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)"
echo ""
echo "🔧 Commandes utiles:"
echo "   - make status    # Afficher le statut"
echo "   - make logs      # Afficher les logs"
echo "   - make clean     # Nettoyer tout" 