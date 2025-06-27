#!/bin/bash

set -e

echo "🚀 Bootstrap RAGnagna avec GitOps et Argo CD"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl n'est pas installé"
        exit 1
    fi
    
    if ! command -v k3d &> /dev/null; then
        log_error "k3d n'est pas installé"
        exit 1
    fi
    
    log_info "Tous les prérequis sont satisfaits"
}

# Créer le cluster K3d
create_cluster() {
    log_info "Création du cluster K3d..."
    
    if k3d cluster list | grep -q "ragna-cluster"; then
        log_warn "Le cluster ragna-cluster existe déjà"
        read -p "Voulez-vous le supprimer et le recréer ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            k3d cluster delete ragna-cluster
        else
            log_info "Utilisation du cluster existant"
            return
        fi
    fi
    
    k3d cluster create --config clusters/local/k3d-config.yaml
    
    log_info "Cluster créé avec succès"
}

# Installer Argo CD
install_argocd() {
    log_info "Installation d'Argo CD..."
    
    kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    
    log_info "Attente que tous les pods Argo CD soient prêts..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
    
    log_info "Argo CD installé avec succès"
}

# Récupérer le mot de passe Argo CD
get_argocd_password() {
    log_info "Récupération du mot de passe Argo CD..."
    
    ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
    echo "Mot de passe Argo CD: $ARGOCD_PASSWORD"
    echo "Conservez ce mot de passe pour vous connecter à l'UI"
}

# Installer NGINX Ingress Controller
install_ingress() {
    log_info "Installation de NGINX Ingress Controller..."
    
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
    
    log_info "Attente que l'Ingress Controller soit prêt..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx --timeout=300s
    
    log_info "NGINX Ingress Controller installé"
}

# Configurer l'entrée hosts
setup_hosts() {
    log_info "Configuration de l'entrée hosts..."
    
    if ! grep -q "ragna.local" /etc/hosts; then
        echo "127.0.0.1 ragna.local" | sudo tee -a /etc/hosts
        log_info "Entrée hosts ajoutée"
    else
        log_warn "L'entrée hosts existe déjà"
    fi
}

# Déployer l'application RAGnagna
deploy_ragna() {
    log_info "Déploiement de l'application RAGnagna..."
    
    kubectl apply -f argo/apps/ragna.yaml -n argocd
    
    log_info "Application déployée. Vérification du statut..."
    sleep 10
    
    kubectl get applications -n argocd
    kubectl get pods -n ragna
}

# Afficher les informations de connexion
show_connection_info() {
    echo
    echo "🎉 Installation terminée !"
    echo "========================"
    echo
    echo "📊 Argo CD UI:"
    echo "   URL: https://localhost:8081"
    echo "   Username: admin"
    echo "   Password: $ARGOCD_PASSWORD"
    echo
    echo "🌐 RAGnagna:"
    echo "   URL: http://ragna.local:8080"
    echo
    echo "🔧 Commandes utiles:"
    echo "   kubectl port-forward svc/argocd-server -n argocd 8081:443"
    echo "   kubectl get pods -n ragna"
    echo "   argocd app get ragna"
    echo
}

# Fonction principale
main() {
    check_prerequisites
    create_cluster
    install_argocd
    get_argocd_password
    install_ingress
    setup_hosts
    deploy_ragna
    show_connection_info
}

# Exécuter le script
main "$@" 