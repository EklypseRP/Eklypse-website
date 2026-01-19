# Eklypse

Ce repo contient le code source du site vitrine et du wiki d'Eklypse, un serveur Minecraft MMORPG. Le site présente l'univers du jeu, son histoire, et propose un wiki entièrement géré par fichiers Markdown pour une documentation évolutive. Il à été entièrement developpé par Capu0410.

---

## L'Univers d'Eklypse

Il y a 300 ans, au terme d'une guerre dévastatrice, le Roi Démon, mortellement blessé, a lancé son ultime sortilège. Dans un dernier acte de malveillance, il a confiné la capitale du seul continent peuplé dans un Donjon colossal, isolant l'humanité du reste du monde. 

Ce sort a consumé toute son énergie, le plongeant dans un sommeil éternel au plus profond de l'abysse, où il attend qu'une élite l'affronte une dernière fois.

---

## Technologies Utilisées

- **Framework** : Next.js 15+ (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Gestion Contenu** : Gray-matter (Parsing Markdown)
- **Rendu Markdown** : React-markdown

---

## Gestion du Wiki (Système Dynamique)

Le wiki est entièrement automatisé. Il scanne le répertoire `content/wiki/` pour générer les catégories et articles. Aucune modification de code n'est nécessaire pour ajouter du contenu.

### Structure des Fichiers
- **Dossier** = Une Catégorie (ex: `histoire`).
- **Fichier .md** = Un Article (ex: `le-roi-demon.md`).

```text
content/
└── wiki/
    ├── histoire/                <-- Catégorie "Histoire"
    │   ├── origines.md          <-- Article "Les Origines"
    │   └── ere-des-demons.md
    └── geographie/              <-- Nouvelle catégorie créée automatiquement
        └── les-montagnes.md


### Créer un Article

Chaque fichier `.md` doit commencer par un bloc de métadonnées (Frontmatter) :

---
title: "Le Roi Démon"        # Titre de l'article
icon: "symbole"             # Icône ou émoji de la petite carte (liste)
categoryIcon: "symbole"     # Icône ou émoji de la grosse carte (accueil wiki)
lastUpdated: "2026-01-19"   # Date de mise à jour
---

# Titre de l'article
Votre contenu en Markdown ici...

```

*Note : La propriété categoryIcon peut être définie dans n'importe quel article d'un dossier pour s'appliquer à la catégorie entière.*

---

## Installation et Utilisation

### Prérequis

* Node.js (version 18.x ou supérieure)
* Un gestionnaire de paquets (npm, yarn ou pnpm)

### Procédure de lancement

1. **Cloner le projet** :
```bash
git clone [https://github.com/votre-pseudo/eklypse-site.git](https://github.com/votre-pseudo/eklypse-site.git)
cd eklypse-site

```


2. **Installer les dépendances** :
```bash
npm install

```


3. **Lancer le serveur de développement** :
```bash
npm run dev

```


4. **Builder pour la production** :
```bash
npm run build

```



---

## Structure du Projet

```
.
├── app/                # Routes et Layouts Next.js (App Router)
│   ├── components/     # Composants React (Header, Footer, etc.)
│   ├── wiki/           # Pages du système de Wiki
│   └── globals.css     # Styles globaux
├── content/
│   └── wiki/           # Fichiers Markdown du Lore (Base de données)
├── lib/                # Fonctions utilitaires (Lecteur de fichiers)
├── public/             # Images et ressources statiques
└── tailwind.config.ts  # Configuration Tailwind

```

---

## Liens Externes

* **Discord de la communauté** : [[Lien]](https://discord.gg/67H3ccmvvW)

---

© 2026 Eklypse Project. Tous droits réservés.
