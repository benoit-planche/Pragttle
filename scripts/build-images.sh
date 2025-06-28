#!/bin/bash

set -e

echo "🐳 Building Pragttle Docker images..."

# Build frontend image
echo "📦 Building frontend image..."
docker build -t ghcr.io/benoit-planche/pragttle/frontend:latest apps/frontend/

# Build backend image
echo "📦 Building backend image..."
docker build -t ghcr.io/benoit-planche/pragttle/backend:latest apps/backend/

echo "✅ All images built successfully!"
echo ""
echo "📦 Images:"
echo "   - ghcr.io/benoit-planche/pragttle/frontend:latest"
echo "   - ghcr.io/benoit-planche/pragttle/backend:latest"

echo "📋 Available images:"
docker images | grep ghcr.io/benoit-planche/pragttle 