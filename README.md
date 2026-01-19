# Eklypse

Ce repo contient le code source du site vitrine et du wiki d'Eklypse, un serveur Minecraft MMORPG. Le site présente l'univers du jeu, son histoire, et propose un wiki entièrement géré par fichiers Markdown pour une documentation évolutive. Il a été entièrement développé par **Capu0410**.

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
- **Rendu Markdown** : React-markdown & Remark-GFM

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
