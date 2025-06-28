#!/bin/bash

# Script pour créer le secret GitHub Container Registry
# Usage: ./create-ghcr-secret.sh <GITHUB_TOKEN>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <GITHUB_TOKEN>"
    echo "Vous devez créer un token GitHub avec les permissions 'read:packages'"
    echo "Allez sur https://github.com/settings/tokens"
    exit 1
fi

GITHUB_TOKEN=$1
USERNAME="benoit-planche"

# Créer le secret Docker registry
kubectl create secret docker-registry ghcr-secret \
    --namespace=ragna \
    --docker-server=ghcr.io \
    --docker-username=$USERNAME \
    --docker-password=$GITHUB_TOKEN \
    --docker-email="" \
    --dry-run=client -o yaml | kubectl apply -f -

echo "Secret ghcr-secret créé dans le namespace ragna" 