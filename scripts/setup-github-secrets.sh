#!/bin/bash

# Script pour configurer les secrets GitHub nécessaires pour la CI/CD
# Utilisez ce script après avoir créé votre repository GitHub

set -e

echo "🔧 Configuration des secrets GitHub pour RAGnagna CI/CD"
echo "=================================================="

# Vérifier que gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) n'est pas installé."
    echo "Installez-le depuis: https://cli.github.com/"
    exit 1
fi

# Vérifier que l'utilisateur est connecté
if ! gh auth status &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à GitHub CLI."
    echo "Exécutez: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI est configuré"

# Obtenir le nom du repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📦 Repository: $REPO"

# Créer un token GitHub avec les permissions nécessaires
echo "🔑 Création d'un token GitHub..."
echo "Ce token sera utilisé pour pousser les images Docker et déployer l'application."
echo ""

# Demander confirmation
read -p "Voulez-vous créer un nouveau token GitHub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Ouvrez cette URL dans votre navigateur:"
    echo "https://github.com/settings/tokens/new"
    echo ""
    echo "Configurez le token avec ces permissions:"
    echo "- repo (toutes les permissions)"
    echo "- write:packages (pour pousser les images Docker)"
    echo "- delete:packages (pour nettoyer les anciennes images)"
    echo ""
    echo "Copiez le token généré et collez-le ci-dessous:"
    read -s GITHUB_TOKEN
    
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "✅ Token reçu, configuration en cours..."
        
        # Configurer le secret
        echo "$GITHUB_TOKEN" | gh secret set GITHUB_TOKEN --repo "$REPO"
        
        echo "✅ Secret GITHUB_TOKEN configuré avec succès!"
    else
        echo "❌ Aucun token fourni"
        exit 1
    fi
else
    echo "ℹ️  Utilisation du token existant..."
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Poussez votre code vers la branche main:"
echo "   git push origin main"
echo ""
echo "2. Vérifiez le pipeline dans l'onglet Actions de votre repository GitHub"
echo ""
echo "3. Les images Docker seront automatiquement construites et poussées vers:"
echo "   ghcr.io/$REPO/frontend:latest"
echo "   ghcr.io/$REPO/backend:latest"
echo ""
echo "4. Argo CD déploiera automatiquement les nouvelles images"
echo ""
echo "🔗 Accédez à votre application:"
echo "   http://localhost:8080 (après déploiement)" 