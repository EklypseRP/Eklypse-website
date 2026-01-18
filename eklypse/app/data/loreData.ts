// ===== STRUCTURE DES DONNÉES LORE =====
// Fichier: app/data/loreData.ts

export interface LoreArticle {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown
  icon?: string;
  lastUpdated?: string;
}

export interface LoreCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Catégories disponibles
export const loreCategories: LoreCategory[] = [
  {
    id: 'histoire',
    name: 'Histoire',
    description: 'L\'histoire du continent d\'Eklypse',
    icon: '📜'
  },
  {
    id: 'lieux',
    name: 'Lieux',
    description: 'Les différents lieux du monde',
    icon: '🏰'
  },
  {
    id: 'personnages',
    name: 'Personnages',
    description: 'Les personnages importants',
    icon: '👤'
  },
  {
    id: 'factions',
    name: 'Factions',
    description: 'Les guildes et organisations',
    icon: '⚔️'
  },
  {
    id: 'gameplay',
    name: 'Gameplay',
    description: 'Mécaniques de jeu et règles',
    icon: '🎮'
  }
];

// Articles de lore (exemples)
export const loreArticles: LoreArticle[] = [
  {
    id: 'age-prosperite',
    title: 'L\'Âge de Prospérité',
    category: 'histoire',
    content: `# L'Âge de Prospérité

Il y a fort longtemps, le continent d'Eklypse prospérait dans une ère de paix et de prospérité.

## Les Grands Royaumes

- **Le Royaume de Lumière** : Situé au nord, connu pour ses mages puissants
- **L'Empire du Sud** : Maîtres de la forge et de l'artisanat
- **Les Terres de l'Est** : Gardiens des anciennes bibliothèques

## La Magie

La magie florissait à travers tout le continent. Les académies formaient des mages capables de :
- Contrôler les éléments
- Soigner les maladies
- Enchanter les objets

> "Dans ces temps anciens, la magie était aussi naturelle que la respiration" - Archives Anciennes
`,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'grande-guerre',
    title: 'La Grande Guerre',
    category: 'histoire',
    content: `# La Grande Guerre

Mais la paix n'était pas destinée à durer.

## L'Émergence du Roi Démon

Des profondeurs les plus sombres de l'abysse, le **Roi Démon** émergea avec ses armées des ténèbres.

### Les Phases de la Guerre

1. **L'Invasion Initiale** (An 1-10)
   - Destruction des villages frontaliers
   - Premières grandes batailles

2. **La Résistance** (An 11-40)
   - Formation de l'Alliance
   - Batailles décisives

3. **Le Combat Final** (An 41-50)
   - Siège de la capitale
   - Affrontement avec le Roi Démon
`,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'capitale',
    title: 'La Capitale Scellée',
    category: 'lieux',
    content: `# La Capitale Scellée

La plus grande cité jamais construite, aujourd'hui prison et donjon.

## Architecture

La capitale s'étend sur **100 niveaux** en profondeur :

- **Niveaux 1-20** : Zone résidentielle (où vivent les survivants)
- **Niveaux 21-50** : Anciens quartiers marchands (partiellement explorés)
- **Niveaux 51-80** : Quartiers nobles (dangereux)
- **Niveaux 81-99** : Cryptes royales (très dangereux)
- **Niveau 100** : Chambre du Roi Démon (inexploré)

## Dangers

Chaque niveau contient :
- Monstres de plus en plus puissants
- Pièges magiques anciens
- Énigmes à résoudre
`,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'roi-demon',
    title: 'Le Roi Démon',
    category: 'personnages',
    content: `# Le Roi Démon

L'être qui a plongé le monde dans les ténèbres.

## Origine

Peu de choses sont connues sur l'origine du Roi Démon. Certains prétendent qu'il était :
- Un ancien mage corrompu
- Une entité venue d'une autre dimension
- Une création des dieux

## Pouvoirs

Le Roi Démon maîtrisait :
- La magie des ténèbres
- Le contrôle des morts
- La manipulation dimensionnelle

## État Actuel

Après avoir lancé son sort final, le Roi Démon dort dans les profondeurs du niveau 100, attendant que quelqu'un vienne le réveiller pour le combat final.

> ⚠️ **Attention** : Seuls les aventuriers les plus puissants peuvent espérer le vaincre.
`,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'regles-serveur',
    title: 'Règles du Serveur',
    category: 'gameplay',
    content: `# Règles du Serveur

## Règles Générales

1. **Respect** : Traitez tous les joueurs avec respect
2. **Pas de Griefing** : Ne détruisez pas les constructions des autres
3. **Pas de Triche** : Aucun mod ou hack n'est autorisé
4. **Langue** : Français principalement, anglais accepté

## Règles RP (Roleplay)

- Restez dans le personnage autant que possible
- Utilisez le chat RP pour les interactions en jeu
- Respectez le lore établi

## Système de Progression

- Explorez les niveaux du donjon
- Combattez des monstres pour gagner de l'XP
- Trouvez des équipements légendaires
- Formez des guildes avec d'autres joueurs

## Sanctions

Les infractions peuvent entraîner :
- Avertissement
- Mute temporaire
- Ban temporaire
- Ban permanent (cas graves)
`,
    lastUpdated: '2026-01-18'
  }
];