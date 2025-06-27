#!/bin/bash

set -e

echo "🚀 Deploying RAGnagna with custom images..."

# Build images
echo "📦 Building Docker images..."
./scripts/build-images.sh

# Load images into K3d
echo "📤 Loading images into K3d cluster..."
./scripts/load-images.sh

# Create a temporary deployment with custom images
echo "🔧 Creating deployment with custom images..."

# Create a ConfigMap to store the custom image configuration
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: ragna-custom-images
  namespace: ragna
data:
  frontend-image: "ragna-frontend:latest"
  backend-image: "ragna-backend:latest"
EOF

# Create a Job to patch the deployments
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: patch-deployments
  namespace: ragna
spec:
  template:
    spec:
      serviceAccountName: default
      containers:
      - name: kubectl
        image: bitnami/kubectl:latest
        command:
        - /bin/sh
        - -c
        - |
          kubectl patch deployment ragna-frontend -p '{"spec":{"template":{"spec":{"containers":[{"name":"ragna-frontend","image":"ragna-frontend:latest","imagePullPolicy":"Never"}]}}}}'
          kubectl patch deployment ragna-backend -p '{"spec":{"template":{"spec":{"containers":[{"name":"ragna-backend","image":"ragna-backend:latest","imagePullPolicy":"Never"}]}}}}'
      restartPolicy: Never
  backoffLimit: 3
EOF

echo "✅ Deployment script completed!"
echo "📋 Check the status with: kubectl get pods -n ragna" 