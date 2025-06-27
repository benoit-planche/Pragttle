#!/bin/bash

set -e

echo "📤 Loading RAGnagna images into K3d cluster..."

# Load frontend image
echo "📦 Loading frontend image..."
k3d image import ragna-frontend:latest -c ragna-cluster

# Load backend image
echo "🦀 Loading backend image..."
k3d image import ragna-backend:latest -c ragna-cluster

echo "✅ Images loaded successfully!"
echo "📋 Images in cluster:"
k3d image list --cluster ragna-cluster | grep ragna 