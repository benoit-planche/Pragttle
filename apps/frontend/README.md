# 🧠🔥 Pragttle Frontend

Le frontend de Pragttle, une application de réseau social moderne construite avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

### ✅ Implémentées

- **Page d'accueil** : Landing page moderne avec design responsive
- **Feed de posts** : Affichage et création de posts avec interactions
- **Composants réutilisables** :
  - `PostCard` : Affichage des posts avec likes, commentaires, partage
  - `CreatePost` : Formulaire de création de posts
  - `Navigation` : Navigation mobile-friendly
- **Page d'exploration** : Découverte de contenu, tendances, utilisateurs suggérés
- **Service API** : Connexion au backend Rust
- **Design responsive** : Optimisé pour mobile et desktop
- **Mode sombre** : Support complet du thème sombre
- **Animations** : Transitions fluides et micro-interactions

### 🔄 En cours de développement

- Authentification (login/register)
- Profil utilisateur
- Commentaires sur les posts
- Système de suivi d'utilisateurs
- Recherche avancée
- Notifications

## 🛠️ Technologies

- **Framework** : Next.js 15 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **État** : React Hooks (useState, useEffect)
- **API** : Fetch API avec service personnalisé

## 📁 Structure du projet

```mermaid
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── feed/              # Feed de posts
│   └── explore/           # Page d'exploration
├── components/            # Composants réutilisables
│   ├── PostCard.tsx       # Carte de post
│   ├── CreatePost.tsx     # Formulaire de création
│   └── Navigation.tsx     # Navigation
└── services/              # Services API
    └── api.ts             # Service de connexion au backend
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
cd apps/frontend
npm install
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

### Build de production

```bash
npm run build
npm start
```

## 🔗 Connexion au backend

Le frontend se connecte automatiquement au backend Rust sur `http://localhost:4000`.

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎨 Design System

### Couleurs

- **Primaire** : Bleu (`blue-600`)
- **Secondaire** : Violet (`purple-600`)
- **Accent** : Rouge pour les likes (`red-500`)
- **Neutre** : Gris avec support du mode sombre

### Typographie

- **Titres** : Font-bold avec tailles responsives
- **Corps** : Font-normal avec hiérarchie claire
- **Interface** : Font-medium pour les boutons et labels

### Composants

- **Cartes** : Bordures arrondies avec ombres subtiles
- **Boutons** : États hover et focus avec transitions
- **Formulaires** : Focus rings et validation visuelle
- **Navigation** : Sticky header et bottom navigation mobile

## 📱 Responsive Design

- **Mobile First** : Optimisé pour les petits écrans
- **Breakpoints** : sm (640px), md (768px), lg (1024px)
- **Navigation** : Bottom navigation sur mobile, top navigation sur desktop
- **Grilles** : Flexbox et CSS Grid pour les layouts

## 🔧 Développement

### Ajouter un nouveau composant

1. Créez le fichier dans `src/components/`
2. Utilisez TypeScript pour les props
3. Ajoutez le support du mode sombre
4. Testez la responsivité

### Ajouter une nouvelle page

1. Créez le dossier dans `src/app/`
2. Ajoutez `page.tsx`
3. Utilisez le composant `Navigation` si nécessaire
4. Ajoutez la route dans la navigation

### Connexion API

1. Ajoutez les méthodes dans `src/services/api.ts`
2. Utilisez les interfaces TypeScript
3. Gérez les erreurs et les états de chargement
4. Ajoutez le fallback vers les données mock si nécessaire

## 🎯 Prochaines étapes

1. **Authentification** : Pages de login/register avec JWT
2. **Profil utilisateur** : Page de profil avec statistiques
3. **Commentaires** : Système de commentaires sur les posts
4. **Recherche** : Recherche en temps réel
5. **Notifications** : Système de notifications push
6. **Tests** : Tests unitaires et d'intégration
7. **PWA** : Support offline et installation
8. **Internationalisation** : Support multi-langues

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet fait partie de Pragttle et est sous licence MIT.

---

**Pragttle** - Le futur des réseaux sociaux 🧠🔥
