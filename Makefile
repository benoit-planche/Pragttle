.PHONY: help bootstrap cluster-create cluster-delete argocd-install argocd-port-forward deploy clean ci-cd-setup ci-cd-start

# Variables
CLUSTER_NAME = ragna-cluster
ARGOCD_NAMESPACE = argocd
RAGNA_NAMESPACE = ragna
KUBECONFIG ?= /home/moi/.config/k3d/kubeconfig-ragna-cluster.yaml

# Afficher l'aide
help:
	@echo "🚀 RAGnagna - Commandes disponibles"
	@echo "=================================="
	@echo ""
	@echo "📦 Installation:"
	@echo "  bootstrap          - Installation complète automatique"
	@echo "  cluster-create     - Créer le cluster K3d"
	@echo "  argocd-install     - Installer Argo CD"
	@echo "  deploy             - Déployer l'application RAGnagna"
	@echo ""
	@echo "🚀 CI/CD:"
	@echo "  ci-cd-setup        - Configurer les secrets GitHub pour CI/CD"
	@echo "  ci-cd-start        - Démarrage complet CI/CD (cluster + Argo CD + secrets)"
	@echo "  ci-cd-registry     - Configurer le registry GitHub pour Argo CD"
	@echo ""
	@echo "🔧 Gestion:"
	@echo "  cluster-delete     - Supprimer le cluster K3d"
	@echo "  argocd-port-forward - Exposer l'UI Argo CD"
	@echo "  status             - Afficher le statut des ressources"
	@echo "  logs               - Afficher les logs de l'application"
	@echo ""
	@echo "🧹 Nettoyage:"
	@echo "  clean              - Nettoyer toutes les ressources"

# Installation complète
bootstrap:
	@echo "🚀 Installation complète de RAGnagna..."
	KUBECONFIG=$(KUBECONFIG) ./scripts/bootstrap.sh

# Configuration CI/CD
ci-cd-setup:
	@echo "🔧 Configuration des secrets GitHub pour CI/CD..."
	./scripts/setup-github-secrets.sh

# Démarrage complet CI/CD
ci-cd-start:
	@echo "🚀 Démarrage complet de la CI/CD..."
	./scripts/start-ci-cd.sh

# Configuration du registry GitHub
ci-cd-registry:
	@echo "🔧 Configuration du registry GitHub pour Argo CD..."
	./scripts/configure-argocd-registry.sh

# Créer le cluster K3d
cluster-create:
	@echo "🐳 Création du cluster K3d..."
	k3d cluster create --config clusters/local/k3d-config.yaml

# Supprimer le cluster K3d
cluster-delete:
	@echo "🗑️  Suppression du cluster K3d..."
	k3d cluster delete $(CLUSTER_NAME)

# Installer Argo CD
argocd-install:
	@echo "🧠 Installation d'Argo CD..."
	kubectl --kubeconfig=$(KUBECONFIG) create namespace $(ARGOCD_NAMESPACE) --dry-run=client -o yaml | kubectl --kubeconfig=$(KUBECONFIG) apply -f -
	kubectl --kubeconfig=$(KUBECONFIG) apply -n $(ARGOCD_NAMESPACE) -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
	@echo "⏳ Attente que les pods soient prêts..."
	kubectl --kubeconfig=$(KUBECONFIG) wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n $(ARGOCD_NAMESPACE) --timeout=300s
	@echo "✅ Argo CD installé !"
	@echo "🔑 Mot de passe:"
	@kubectl --kubeconfig=$(KUBECONFIG) -n $(ARGOCD_NAMESPACE) get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Exposer l'UI Argo CD
argocd-port-forward:
	@echo "🌐 Exposition de l'UI Argo CD sur https://localhost:8081"
	kubectl --kubeconfig=$(KUBECONFIG) port-forward svc/argocd-server -n $(ARGOCD_NAMESPACE) 8081:443

# Déployer l'application
deploy:
	@echo "📦 Déploiement de l'application RAGnagna..."
	kubectl --kubeconfig=$(KUBECONFIG) apply -f argo/apps/ragna.yaml -n $(ARGOCD_NAMESPACE)
	@echo "✅ Application déployée !"

# Afficher le statut
status:
	@echo "📊 Statut du cluster:"
	kubectl --kubeconfig=$(KUBECONFIG) get nodes
	@echo ""
	@echo "📊 Statut d'Argo CD:"
	kubectl --kubeconfig=$(KUBECONFIG) get pods -n $(ARGOCD_NAMESPACE)
	@echo ""
	@echo "📊 Applications Argo CD:"
	kubectl --kubeconfig=$(KUBECONFIG) get applications -n $(ARGOCD_NAMESPACE)
	@echo ""
	@echo "📊 Statut de RAGnagna:"
	kubectl --kubeconfig=$(KUBECONFIG) get pods -n $(RAGNA_NAMESPACE) 2>/dev/null || echo "Namespace $(RAGNA_NAMESPACE) n'existe pas encore"

# Afficher les logs
logs:
	@echo "📝 Logs de l'application RAGnagna:"
	kubectl --kubeconfig=$(KUBECONFIG) logs -f deployment/ragna-app -n $(RAGNA_NAMESPACE)

# Nettoyer
clean:
	@echo "🧹 Nettoyage des ressources..."
	kubectl --kubeconfig=$(KUBECONFIG) delete application ragna -n $(ARGOCD_NAMESPACE) --ignore-not-found=true
	kubectl --kubeconfig=$(KUBECONFIG) delete namespace $(RAGNA_NAMESPACE) --ignore-not-found=true
	kubectl --kubeconfig=$(KUBECONFIG) delete namespace $(ARGOCD_NAMESPACE) --ignore-not-found=true
	k3d cluster delete $(CLUSTER_NAME) --ignore-not-found=true
	@echo "✅ Nettoyage terminé !"

# Installer NGINX Ingress Controller
install-ingress:
	@echo "🌐 Installation de NGINX Ingress Controller..."
	kubectl --kubeconfig=$(KUBECONFIG) apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
	@echo "⏳ Attente que l'Ingress Controller soit prêt..."
	kubectl --kubeconfig=$(KUBECONFIG) wait --for=condition=ready pod -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx --timeout=300s
	@echo "✅ NGINX Ingress Controller installé !"

# Configurer l'entrée hosts
setup-hosts:
	@echo "🔧 Configuration de l'entrée hosts..."
	@if ! grep -q "ragna.local" /etc/hosts; then \
		echo "127.0.0.1 ragna.local" | sudo tee -a /etc/hosts; \
		echo "✅ Entrée hosts ajoutée"; \
	else \
		echo "ℹ️  L'entrée hosts existe déjà"; \
	fi 