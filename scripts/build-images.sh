#!/bin/bash

set -e

echo "🐳 Building RAGnagna Docker images..."

# Build frontend image
echo "📦 Building frontend image..."
cd apps/frontend
docker build -t ragna-frontend:latest .

# Build backend image
echo "🦀 Building backend image..."
cd ../backend
docker build -t ragna-backend:latest .

echo "✅ Images built successfully!"
echo "📋 Available images:"
docker images | grep ragna 