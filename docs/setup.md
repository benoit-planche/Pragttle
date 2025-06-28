# 🚀 Guide de Setup - Pragttle

Ce guide vous accompagne dans la mise en place complète de Pragttle avec GitOps et Argo CD.

## 📋 Prérequis

### Outils requis

- **Docker** : [Installation Docker](https://docs.docker.com/get-docker/)
- **kubectl** : [Installation kubectl](https://kubernetes.io/docs/tasks/tools/)
- **k3d** : [Installation k3d](https://k3d.io/)
- **argocd CLI** : [Installation Argo CD CLI](https://argo-cd.readthedocs.io/en/stable/cli_installation/)

### Vérification des prérequis

```bash
# Vérifier Docker
docker --version

# Vérifier kubectl
kubectl version --client

# Vérifier k3d
k3d version

# Vérifier argocd CLI
argocd version --client
```

## 🚀 Installation automatique (recommandée)

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/benoit-planche/Pragttle.git
cd Pragttle
```

### Étape 2 : Exécuter le script de bootstrap

```bash
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

Le script va automatiquement :

- Créer un cluster K3d local
- Installer Argo CD
- Configurer l'ingress
- Déployer l'application Pragttle

## 🔧 Installation manuelle

### Étape 1 : Créer le cluster K3d

```bash
k3d cluster create pragttle-cluster --config clusters/local/k3d-config.yaml
```

### Étape 2 : Installer Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f argo/bootstrap/install-argo.yaml
```

### Étape 3 : Attendre qu'Argo CD soit prêt

```bash
kubectl wait --for=condition=Ready pods -n argocd --all --timeout=300s
```

### Étape 4 : Configurer le repository

```bash
argocd repo add https://github.com/your-username/Pragttle.git
```

### Étape 5 : Déployer Pragttle

```bash
kubectl apply -f argo/apps/pragttle.yaml
```

### Étape 6 : Accéder à Pragttle

```bash
# Configurer l'entrée hosts
echo "127.0.0.1 pragttle.local" | sudo tee -a /etc/hosts

# Exposer Argo CD
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## 🌐 Accès aux services

### Argo CD UI

- **URL** : <https://localhost:8080>
- **Username** : `admin`
- **Password** : Récupérer avec la commande :

  ```bash
  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
  ```

### Application Pragttle

- **URL** : <http://pragttle.local>

## 🔧 Configuration CI/CD

### Étape 1 : Configurer les secrets GitHub

```bash
./scripts/setup-github-secrets.sh
```

### Étape 2 : Pousser le code

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Le pipeline CI/CD se déclenchera automatiquement et déploiera l'application.

## 🎯 Commandes utiles

### Gestion du cluster

```bash
# Afficher le statut
make status

# Afficher les logs
make logs

# Nettoyer
make clean
```

### Argo CD

```bash
# Lister les applications
argocd app list

# Synchroniser une application
argocd app sync pragttle

# Afficher le statut d'une application
argocd app get pragttle
```

## 🐛 Dépannage

### Problèmes courants

#### Cluster ne démarre pas

```bash
k3d cluster delete pragttle-cluster
k3d cluster create pragttle-cluster --config clusters/local/k3d-config.yaml
```

#### Argo CD ne répond pas

```bash
kubectl get pods -n argocd
kubectl logs -n argocd deployment/argocd-server
```

#### Application en erreur

```bash
kubectl get pods -n pragttle
kubectl describe pod <pod-name> -n pragttle
```

## 📚 Ressources

- [Documentation Argo CD](https://argo-cd.readthedocs.io/)
- [Documentation K3d](https://k3d.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Kustomize](https://kustomize.io/)

---

**Pragttle** - Infrastructure GitOps opérationnelle ! 🧠🔥
