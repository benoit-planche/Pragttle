# 🔧 Résolution du problème Argo CD

## 🚨 Problème initial

Après le push, Argo CD s'est mis à jour mais :

- ❌ La base de données PostgreSQL n'était pas déployée
- ❌ L'application PostgreSQL n'apparaissait pas dans Argo CD

## 🔍 Diagnostic

### 1. Vérification de l'état du cluster

```bash
export KUBECONFIG=/home/moi/.kube/config
kubectl get applications -n argocd
```

**Résultat** : Seule l'application `ragna` était présente, `postgres` manquait.

### 2. Analyse de la configuration

- ✅ Le fichier `argo/apps/postgres.yaml` existait
- ❌ L'application n'était pas appliquée dans le cluster
- ❌ Configuration incorrecte pour Helm

## 🛠️ Résolution

### Étape 1 : Application manuelle de PostgreSQL

```bash
kubectl apply -f argo/apps/postgres.yaml
```

### Étape 2 : Correction de la configuration Helm

**Problème** : L'application utilisait un chemin local au lieu du repository Helm.

**Solution** : Modification de `argo/apps/postgres.yaml` pour utiliser directement le chart Helm Bitnami.

#### Configuration corrigée

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: postgres
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://charts.bitnami.com/bitnami  # Repository Helm direct
    chart: postgresql                             # Chart Helm
    targetRevision: 15.5.2                       # Version spécifique
    helm:
      values: |                                  # Configuration inline
        auth:
          postgresPassword: "ragna123"
          database: "ragna"
        primary:
          persistence:
            enabled: true
            size: 8Gi
        service:
          type: ClusterIP
  destination:
    server: https://kubernetes.default.svc
    namespace: ragna-db                          # Namespace dédié
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### Étape 3 : Nettoyage et recréation

```bash
# Suppression de l'ancienne application
kubectl delete application postgres -n argocd

# Application de la nouvelle configuration
kubectl apply -f argo/apps/postgres.yaml
```

## ✅ Résultat final

### Applications Argo CD

```bash
kubectl get applications -n argocd
NAME       SYNC STATUS   HEALTH STATUS
postgres   Synced        Healthy
ragna      Synced        Healthy
```

### Pods déployés

```bash
# Application RAGnagna
kubectl get pods -n ragna
NAME                         READY   STATUS    RESTARTS   AGE
ragna-app-659f8fdd85-4r27t   1/1     Running   0          74m

# Base de données PostgreSQL
kubectl get pods -n ragna-db
NAME                    READY   STATUS    RESTARTS   AGE
postgres-postgresql-0   1/1     Running   0          85s
```

### Services

```bash
# Services RAGnagna
kubectl get services -n ragna
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
ragna-service   ClusterIP   10.43.87.71   <none>        80/TCP    74m

# Services PostgreSQL
kubectl get services -n ragna-db
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
postgres-postgresql      ClusterIP   10.43.24.168   <none>        5432/TCP   45s
postgres-postgresql-hl   ClusterIP   None           <none>        5432/TCP   45s
```

### Ingress

```bash
kubectl get ingress -n ragna
NAME            CLASS   HOSTS         ADDRESS      PORTS   AGE
ragna-ingress   nginx   ragna.local   172.19.0.4   80      75m
```

## 🎯 Accès à l'application

- **Application RAGnagna** : <http://ragna.local/>
- **Base de données PostgreSQL** :
  - Host: `postgres-postgresql.ragna-db.svc.cluster.local`
  - Port: `5432`
  - Database: `ragna`
  - Password: `ragna123`

## 📚 Leçons apprises

### 1. Vérification des applications Argo CD

Toujours vérifier que toutes les applications sont bien appliquées :

```bash
kubectl get applications -n argocd
```

### 2. Configuration Helm avec Argo CD

Pour utiliser des charts Helm avec Argo CD :

- Utiliser `repoURL` pointant vers le repository Helm
- Spécifier `chart` et `targetRevision`
- Utiliser `helm.values` pour la configuration

### 3. Namespaces

- Créer des namespaces dédiés pour chaque application
- Utiliser `CreateNamespace=true` dans les syncOptions

### 4. Debugging

- Utiliser `kubectl describe application` pour diagnostiquer les erreurs
- Vérifier les logs des pods Argo CD si nécessaire

## 🚀 Prochaines étapes

1. **Configuration de la base de données** : Mettre à jour le backend Rust pour se connecter à PostgreSQL
2. **Variables d'environnement** : Configurer les secrets pour les credentials DB
3. **Monitoring** : Ajouter des dashboards pour surveiller les applications
4. **Backup** : Configurer les sauvegardes de la base de données

---

**RAGnagna** - Infrastructure GitOps opérationnelle ! 🧠🔥
