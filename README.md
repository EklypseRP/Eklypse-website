Voici la version mise à jour de ton **README.md**, structurée en Markdown et sans aucun emoji, pour refléter les derniers changements du système dynamique.

---

# Eklypse

Ce repo contient le code source du site vitrine et du wiki d'Eklypse, un serveur Minecraft MMORPG. Le site présente l'univers du jeu, son histoire, et propose un wiki entièrement dynamique et récursif, géré par fichiers Markdown.

Développé par **Capu0410**.

---

## L'Univers d'Eklypse

Il y a 300 ans, au terme d'une guerre dévastatrice, le Roi Démon, mortellement blessé, a lancé son ultime sortilège. Dans un dernier acte de malveillance, il a confiné la capitale du seul continent peuplé dans un Donjon colossal, isolant l'humanité du reste du monde.

Ce sort a consumé toute son énergie, le plongeant dans un sommeil éternel au plus profond de l'abysse, où il attend qu'une élite l'affronte une dernière fois.

---

## Technologies Utilisées

* **Framework** : Next.js 15+ (App Router)
* **Langage** : TypeScript
* **Animations** : CSS Transitions (Smooth Fade-in et Slide-up)
* **Parsing Markdown** : Gray-matter
* **Rendu Markdown** : React-markdown et Remark-GFM

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
    ├── histoire/                  <-- Catégorie principale
    │   ├── index.md               <-- Métadonnées de la catégorie
    │   ├── origines.md            <-- Article
    │   └── ere-des-demons/        <-- Sous-catégorie
    │       ├── index.md           
    │       └── le-roi-demon.md    <-- Article profond
    └── races/                     
        └── elfes.markdown         <-- Supporte .md et .markdown

```

### Formatage Automatique des Titres

Le système utilise une fonction `formatTitle` qui transforme les noms de dossiers (kebab-case) en titres lisibles. Par exemple, un dossier nommé `geographie-du-monde` sera automatiquement affiché sous le titre **Geographie Du Monde** sans intervention manuelle.

### Le rôle du fichier index.md

Pour personnaliser l'apparence d'une catégorie (dossier), placez un fichier `index.md` à l'intérieur. Il permet de définir l'icône et le titre personnalisé :

```markdown
---
title: "Geographie du Monde"
categoryIcon: "Icône"
---
Texte optionnel affiché en haut de la page catégorie...

```

### Créer un Article

Chaque article doit posséder un bloc Frontmatter. Le contenu de l'article est masqué sur les cartes de prévisualisation pour éviter tout spoil.

```markdown
---
title: "Les Elfes de Nuit"
icon: "Icône"
lastUpdated: "2026-01-20"
---

# Les Elfes de Nuit
Votre contenu ici...

```

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
│   ├── wiki/           # Pages dynamiques [...path] avec transitions fluides
│   ├── components/     # Sidebar récursive et composants Markdown
│   └── globals.css     # Animations Fade-in globales
├── content/
│   └── wiki/           # Fichiers Markdown (Source de vérité)
├── lib/                # Logique FS : scan récursif et formatage de titres
└── public/             # Ressources statiques

```

---

## Liens Externes

* **Discord de la communauté** : [Lien vers Discord](https://discord.gg/67H3ccmvvW)

---

© 2026 Eklypse Project. Tous droits réservés.
