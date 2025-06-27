# 🚀 Guide de Setup - RAGnagna

Ce guide vous accompagne dans la mise en place complète de RAGnagna avec GitOps et Argo CD.

## 📋 Prérequis

### Outils requis

```bash
# Docker
docker --version

# kubectl
kubectl version --client

# k3d
k3d version

# argocd CLI
argocd version --client
```

### Installation des outils manquants

#### k3d

```bash
# Linux/macOS
wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Ou avec Homebrew
brew install k3d
```

#### Argo CD CLI

```bash
# Linux
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# macOS
brew install argocd
```

## 🐳 Étape 1 : Créer le cluster K3d

### Option A : Avec la configuration YAML

```bash
k3d cluster create --config clusters/local/k3d-config.yaml
```

### Option B : En ligne de commande

```bash
k3d cluster create ragna-cluster \
  --api-port 6550 \
  --servers 1 \
  --agents 2 \
  --port "8080:80@loadbalancer" \
  --port "8443:443@loadbalancer"
```

### Vérification

```bash
kubectl cluster-info
kubectl get nodes
```

## 🧠 Étape 2 : Installer Argo CD

### Créer le namespace

```bash
kubectl create namespace argocd
```

### Installer Argo CD

```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Attendre que tous les pods soient prêts

```bash
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

## 🌐 Étape 3 : Accéder à l'UI Argo CD

### Port-forward

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

### Récupérer le mot de passe initial

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Accès

- URL: <https://localhost:8081>
- Username: `admin`
- Password: (celui récupéré ci-dessus)

## 🔧 Étape 4 : Configurer Argo CD

### Se connecter via CLI

```bash
argocd login localhost:8081 --username admin --password <password>
```

### Ajouter le repository Git

```bash
# Remplacer par votre URL de repo
argocd repo add https://github.com/your-username/RAGNagna.git
```

## 📦 Étape 5 : Déployer RAGnagna

### Appliquer l'application Argo CD

```bash
kubectl apply -f argo/apps/ragna.yaml -n argocd
```

### Vérifier le déploiement

```bash
# Via CLI
argocd app get ragna

# Via kubectl
kubectl get applications -n argocd
kubectl get pods -n ragna
```

## 🎯 Étape 6 : Accéder à RAGnagna

### Ajouter l'entrée dans /etc/hosts

```bash
echo "127.0.0.1 ragna.local" | sudo tee -a /etc/hosts
```

### Installer NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
```

### Accéder à l'application

- URL: <http://ragna.local:8080>

## 🔄 Workflow de développement

### 1. Modifier le code

```bash
# Faire vos modifications dans apps/ragna/
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push
```

### 2. Argo CD synchronise automatiquement

- L'application se met à jour automatiquement
- Vérifier dans l'UI Argo CD ou via CLI

### 3. Vérifier les logs

```bash
kubectl logs -f deployment/ragna-app -n ragna
```

## 🛠️ Commandes utiles

### Cluster

```bash
# Voir les clusters
k3d cluster list

# Supprimer le cluster
k3d cluster delete ragna-cluster

# Redémarrer le cluster
k3d cluster start ragna-cluster
```

### Argo CD

```bash
# Lister les applications
argocd app list

# Synchroniser manuellement
argocd app sync ragna

# Voir les logs
argocd app logs ragna

# Supprimer l'application
argocd app delete ragna
```

### Kubernetes

```bash
# Voir tous les pods
kubectl get pods -A

# Voir les services
kubectl get svc -A

# Voir les ingress
kubectl get ingress -A

# Décrire une ressource
kubectl describe pod <pod-name> -n ragna
```

## 🐛 Dépannage

### Problèmes courants

#### Argo CD ne démarre pas

```bash
kubectl get pods -n argocd
kubectl describe pod <pod-name> -n argocd
```

#### Application en état "OutOfSync"

```bash
argocd app sync ragna
argocd app get ragna
```

#### Pods en état "Pending"

```bash
kubectl describe pod <pod-name> -n ragna
kubectl get events -n ragna
```

## 📚 Ressources

- [Documentation Argo CD](https://argo-cd.readthedocs.io/)
- [Documentation K3d](https://k3d.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Kustomize](https://kustomize.io/)
