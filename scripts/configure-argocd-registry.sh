#!/bin/bash

# Script pour configurer Argo CD avec les permissions pour accéder au registry GitHub
# Ce script doit être exécuté après avoir configuré les secrets GitHub

set -e

echo "🔧 Configuration d'Argo CD pour le registry GitHub"
echo "=================================================="

# Vérifier que kubectl est configuré
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl n'est pas configuré ou le cluster n'est pas accessible"
    echo "Assurez-vous que votre cluster K3d est démarré:"
    echo "  make cluster-create"
    exit 1
fi

echo "✅ Cluster Kubernetes accessible"

# Vérifier qu'Argo CD est installé
if ! kubectl get namespace argocd &> /dev/null; then
    echo "❌ Argo CD n'est pas installé"
    echo "Installez Argo CD d'abord:"
    echo "  make argocd-install"
    exit 1
fi

echo "✅ Argo CD est installé"

# Créer un secret pour le registry GitHub
echo "🔑 Création du secret pour le registry GitHub..."

# Demander le token GitHub
echo "Entrez votre token GitHub (avec permissions packages:read):"
read -s GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token GitHub requis"
    exit 1
fi

# Créer le secret Docker registry
kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=$(echo $GITHUB_TOKEN | cut -d: -f1) \
    --docker-password=$GITHUB_TOKEN \
    --docker-email="your-email@example.com" \
    --namespace=ragna \
    --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secret Docker registry créé"

# Patch le service account pour utiliser le secret
kubectl patch serviceaccount default -n ragna -p '{"imagePullSecrets": [{"name": "ghcr-secret"}]}'

echo "✅ Service account configuré"

# Vérifier la configuration
echo ""
echo "🔍 Vérification de la configuration:"
echo "=================================="

echo "📋 Secrets dans le namespace ragna:"
kubectl get secrets -n ragna

echo ""
echo "👤 Service account default:"
kubectl get serviceaccount default -n ragna -o yaml | grep -A 5 imagePullSecrets

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Poussez votre code vers GitHub:"
echo "   git push origin main"
echo ""
echo "2. Le pipeline CI/CD va construire et pousser les images"
echo ""
echo "3. Argo CD va automatiquement déployer les nouvelles images"
echo ""
echo "4. Vérifiez le déploiement:"
echo "   kubectl get pods -n ragna"
echo "   kubectl logs -n ragna deployment/ragna-app" 