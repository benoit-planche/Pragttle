# 🚀 Guide de démarrage rapide CI/CD RAGnagna

Ce guide vous permet de configurer et démarrer la CI/CD RAGnagna en quelques minutes.

## ⚡ Démarrage ultra-rapide

### Option 1: Script automatique (recommandé)

```bash
# Démarrage complet en une commande
make ci-cd-start
```

Ce script va automatiquement :

- ✅ Vérifier les prérequis
- ✅ Créer le cluster K3d
- ✅ Installer Argo CD
- ✅ Configurer les secrets GitHub
- ✅ Configurer le registry GitHub
- ✅ Déployer les applications

### Option 2: Configuration manuelle

```bash
# 1. Configurer les secrets GitHub
make ci-cd-setup

# 2. Créer le cluster et installer Argo CD
make cluster-create
make argocd-install

# 3. Configurer le registry GitHub
make ci-cd-registry

# 4. Déployer les applications
make deploy
```

## 🔧 Prérequis

Assurez-vous d'avoir installé :

```bash
# Sur Arch Linux
sudo pacman -S docker kubectl k3d github-cli

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
# Redémarrez votre session ou exécutez : newgrp docker
```

## 🔑 Configuration GitHub

### 1. Connexion GitHub CLI

```bash
gh auth login
```

### 2. Créer un token GitHub

1. Allez sur <https://github.com/settings/tokens/new>
2. Configurez le token avec ces permissions :
   - `repo` (toutes les permissions)
   - `write:packages` (pour pousser les images Docker)
   - `delete:packages` (pour nettoyer les anciennes images)

### 3. Configurer les secrets

```bash
make ci-cd-setup
```

## 🚀 Premier déploiement

### 1. Pousser le code

```bash
git add .
git commit -m "Initial commit with CI/CD"
git push origin main
```

### 2. Vérifier le pipeline

- Allez dans l'onglet **Actions** de votre repository GitHub
- Le pipeline va automatiquement :
  1. Tester le code
  2. Construire les images Docker
  3. Pousser vers GitHub Container Registry
  4. Mettre à jour les manifests Kubernetes

### 3. Vérifier le déploiement

```bash
# Statut des pods
kubectl get pods -n ragna

# Logs de l'application
kubectl logs -n ragna deployment/ragna-app

# Applications Argo CD
kubectl get applications -n argocd
```

## 🌐 Accès aux services

### Argo CD UI

- **URL** : <https://localhost:8081>
- **Username** : `admin`
- **Password** : `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d`

### Application RAGnagna

- **URL** : <http://ragna.local:8080>

## 🔄 Workflow de développement

1. **Modifier le code** dans `apps/frontend/` ou `apps/backend/`
2. **Commiter et pousser** :

   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

3. **Le pipeline se déclenche automatiquement**
4. **Argo CD déploie automatiquement** les nouvelles images

## 🐛 Dépannage

### Pipeline GitHub Actions échoue

```bash
# Vérifier les logs
gh run list
gh run view <run-id>

# Vérifier les secrets
gh secret list
```

### Images ne se déploient pas

```bash
# Vérifier le secret Docker registry
kubectl get secrets -n ragna

# Vérifier les logs des pods
kubectl describe pod -n ragna
kubectl logs -n ragna deployment/ragna-app
```

### Argo CD ne synchronise pas

```bash
# Vérifier le statut des applications
kubectl get applications -n argocd

# Forcer la synchronisation
kubectl patch application ragna -n argocd --type='merge' -p='{"spec":{"syncPolicy":{"automated":{"prune":true,"selfHeal":true}}}}'
```

## 📊 Monitoring

### Commandes utiles

```bash
# Statut général
make status

# Logs en temps réel
make logs

# Port-forward Argo CD
make argocd-port-forward
```

### Interface Argo CD

- **Applications** : Voir le statut de tous les déploiements
- **Resources** : Explorer les ressources Kubernetes
- **Settings** : Configurer les repositories et clusters

## 🔄 Mise à jour

Pour mettre à jour le pipeline CI/CD :

1. Modifiez `.github/workflows/ci-cd.yml`
2. Testez localement si possible
3. Poussez vers une branche de test
4. Vérifiez les Actions GitHub
5. Merge vers `main`

## 📞 Support

En cas de problème :

1. **Vérifiez les logs** GitHub Actions et Kubernetes
2. **Consultez la documentation** complète : `docs/ci-cd-pipeline.md`
3. **Testez les étapes** localement
4. **Ouvrez une issue** sur GitHub

## 🎯 Prochaines étapes

Une fois la CI/CD configurée :

1. **Développez votre application** frontend et backend
2. **Ajoutez des tests** unitaires et d'intégration
3. **Configurez des environnements** (dev, staging, prod)
4. **Ajoutez du monitoring** (Prometheus, Grafana)
5. **Configurez des alertes** pour les déploiements

---

🎉 **Félicitations !** Votre pipeline CI/CD est maintenant opérationnel !
