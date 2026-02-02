# Eklypse

Ce repo contient le code source du site vitrine et du wiki d'Eklypse, un serveur Minecraft MMORPG. Le site présente l'univers du jeu, son histoire, et propose un wiki entièrement dynamique ainsi qu'un système complet de gestion des candidatures RP.

Développé par **Capu0410**.

---

## L'Univers d'Eklypse

Il y a 300 ans, au terme d'une guerre dévastatrice, le Roi Démon, mortellement blessé, a lancé son ultime sortilège. Dans un dernier acte de malveillance, il a confiné la capitale du seul continent peuplé dans un Donjon colossal, isolant l'humanité du reste du monde.

Ce sort a consumé toute son énergie, le plongeant dans un sommeil éternel au plus profond de l'abysse, où il attend qu'une élite l'affronte une dernière fois.

---

## Technologies Utilisées

* **Framework** : Next.js 15+ (App Router)
* **Langage** : TypeScript
* **Base de données** : MongoDB (via MongoDB Driver)
* **Authentification** : NextAuth.js avec fournisseur Discord
* **Animations** : CSS Transitions (Smooth Fade-in et Slide-up)
* **Éditeur de texte** : Tiptap (Rich Text Editor pour le Lore)
* **Parsing Markdown** : Gray-matter
* **Rendu Markdown** : React-markdown et Remark-GFM
* **Visualisation 3D** : Skinview3d pour le rendu des skins Minecraft

---

## Système de Candidature RP

Le projet inclut un tunnel complet pour la création et la gestion des personnages Roleplay.

### Pour les Joueurs

* **Formulaire complet** : Saisie du nom RP, de l'âge (minimum 18 ans), de la taille (numérique uniquement) et de la race (Humain, Elfe, Nain, Autre).
* **Alerte Spécifique** : La sélection de la race "Autre" informe le joueur qu'un ticket Discord est requis pour validation.
* **Éditeur de Lore** : Rédaction du récit avec mise en forme riche (gras, titres, listes) via Tiptap.
* **Upload de Skin** : Chargement de fichiers .png (max 512x512) avec prévisualisation 3D interactive et vérification des dimensions.
* **Brouillons** : Sauvegarde automatique locale pour ne jamais perdre sa progression.

### Pour les Recruteurs (Dashboard Admin)

* **Vue d'ensemble** : Liste des candidatures en attente triées par date de soumission.
* **Gestion par Dossier** : Archivage automatique des fiches par utilisateur (identifié via Discord ID).
* **Outils d'Examen** : Visualisation complète des descriptions physiques/mentales, du lore formaté et du skin en 3D.
* **Alerte Ticket** : Notification visuelle immédiate si une race "Autre" nécessite une attention particulière sur Discord.
* **Décisions** : Acceptation ou refus avec saisie obligatoire d'un motif, visible ensuite par le joueur.

---

## Gestion du Wiki (Système Dynamique Récursif)

Le wiki est entièrement automatisé. Le script scanne récursivement le répertoire `content/wiki/` pour générer l'arborescence, la sidebar, et les cartes de navigation, quelle que soit la profondeur des dossiers.

### Structure des Fichiers

* **Dossier** : Une Catégorie (génère automatiquement une carte et un menu).
* **Fichier .md ou .markdown** : Un Article.
* **index.md** (optionnel) : Permet de définir les métadonnées d'un dossier (titre, icône spécifique).

```text
content/
└── wiki/
    ├── histoire/                   <-- Catégorie principale
    │   ├── index.md                <-- Métadonnées de la catégorie
    │   ├── origines.md             <-- Article
    │   └── ere-des-demons/         <-- Sous-catégorie
    │       ├── index.md            
    │       └── le-roi-demon.md     <-- Article profond
    └── races/                      
        └── elfes.markdown          <-- Supporte .md et .markdown

```

---

## Configuration

Pour fonctionner, le projet nécessite un fichier `.env.local` à la racine avec les variables suivantes :

```text
MONGODB_URI=votre_uri_mongodb
DISCORD_CLIENT_ID=votre_id_client_discord
DISCORD_CLIENT_SECRET=votre_secret_client_discord
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_aleatoire

```

*Note : Les recruteurs doivent avoir le flag `isRecruiter` à `true` dans leur document utilisateur en base de données pour accéder au dashboard admin.*

---

## Installation et Utilisation

### Prérequis

* Node.js (version 18.x ou supérieure)
* npm, yarn ou pnpm

### Procédure

1. **Cloner et installer** :

```bash
git clone https://github.com/votre-pseudo/eklypse-site.git
cd eklypse-site
npm install

```

2. **Lancer le serveur de développement** :

```bash
npm run dev

```

3. **Build pour la production** :

```bash
npm run build

```

---

## Structure du Projet

```text
.
├── app/                # Routes et Layouts (Next.js App Router)
│   ├── admin/          # Dashboard des candidatures pour les recruteurs
│   ├── api/            # API candidatures, auth et upload de skins
│   ├── candidature/    # Formulaire utilisateur et historique personnel
│   ├── wiki/           # Pages dynamiques du wiki avec transitions
│   ├── components/     # Sidebar récursive, SkinViewer3D et éditeurs
│   └── globals.css     # Animations Fade-in globales
├── content/
│   └── wiki/           # Fichiers Markdown (Source de vérité)
├── lib/                # Logique MongoDB, Auth et scan FS du Wiki
└── public/             # Ressources statiques

```

---

## Liens Externes

* **Discord de la communauté** : [Lien vers Discord](https://discord.gg/67H3ccmvvW)

---

© 2026 Eklypse Project. Tous droits réservés.
