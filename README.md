# PokéClasseur

[![CI](https://github.com/Boblebol/pokebinder/actions/workflows/ci.yml/badge.svg)](https://github.com/Boblebol/pokebinder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

PokéClasseur est une PWA mobile-first pour suivre une collection de cartes Pokémon et préparer leur rangement dans des classeurs physiques. L'app est construite en React avec Vite, fonctionne sans backend et stocke la progression dans le navigateur.

La version actuelle couvre le Pokédex national de `#001` à `#1025` : Kanto, Johto, Hoenn, Sinnoh, Unys, Kalos, Alola, Meltan / Melmetal, Galar, Hisui et Paldea.

## Fonctionnalités

### Pokédex

- Vue nationale ou régionale avec recherche par nom ou numéro.
- Filtres par statut : tous, rangé, en main, manquant.
- Cycle rapide du statut d'une carte : manquant -> en main -> rangé.
- Fiche détaillée avec types, faiblesses, statistiques, chaînes d'évolution, formes et entrées Pokédex par jeu.
- Images officielles Pokémon avec placeholders en cas d'échec de chargement.

### Classeurs

- Placement automatique par région, avec un classeur logique par région.
- Pages recto/verso et formats configurables : `3x3`, `3x4` ou `4x4`.
- Configuration par défaut : `3x3`, `11` pages par classeur et règle famille activée.
- Règle famille : les chaînes d'évolution restent alignées quand elles risqueraient d'être coupées sur une ligne.
- Les cases de classeur sont interactives et permettent aussi de changer le statut d'une carte.

### Progression, badges et succès

- Tableau de bord global et régional.
- 152 objectifs de badges, ligues, rivaux ou rencontres de dresseurs.
- 76 succès : starters, professeurs, arènes, maîtrises de type, paliers Pokédex, succès régionaux et spéciaux.
- Toasts de déblocage pour les badges et succès.
- Import/export JSON de la collection depuis l'écran Stats.

### Configuration et PWA

- Thèmes intégrés : Shadow, Midnight et Ember.
- Recalcul du placement après changement de format ou de règle famille.
- Guide d'accueil interactif rejouable depuis les réglages.
- Panneau de mise à jour PWA avec changelog, état hors ligne et installation d'une nouvelle version.
- Guide d'installation iOS affiché dans l'app quand Safari ne propose pas l'installation automatiquement.

## Stack technique

- React `19`
- Vite `8`
- pnpm
- ESLint
- PWA maison via `public/sw.js`
- Déploiement Netlify via `netlify.toml`

Il n'y a pas d'API applicative. Les données principales sont embarquées dans `src/data`, et les images viennent principalement des assets officiels Pokémon et de Pokémon Showdown.

## Développement local

Prérequis : Node.js et pnpm.

```bash
pnpm install
pnpm dev
```

Commandes utiles :

```bash
pnpm build      # compile l'application dans dist/
pnpm check      # lance lint puis build
pnpm preview    # sert le build de production localement
pnpm lint       # lance ESLint
```

Le service worker n'est pas enregistré sur `localhost` afin d'éviter les caches gênants pendant le développement. Le comportement PWA complet se vérifie plutôt sur un hébergement HTTPS, par exemple Netlify.

## Architecture

```text
src/
  App.jsx                 Etat global, localStorage, PWA updates, navigation
  main.jsx                Point d'entrée React
  components/             Cartes, images, fiche Pokémon, barre d'onglets, guide
  screens/                Pokédex, Succès, Classeurs, Stats, Config
  data/                   Régions, Pokémon, évolutions, stats, badges, succès
  utils/                  Placement classeur, assets, couleurs
public/
  sw.js                   Service worker
  manifest.json           Manifest PWA
  fonts/                  Polices locales
scripts/
  update_data.py          CLI de synchronisation des données
  generate-badges.js      Génération de src/data/badges.js
```

Fichiers à connaître :

- `src/data/index.js` construit `PKM`, `PLIST`, `INITCOL` et la configuration classeur par défaut.
- `src/utils/binder.js` calcule les coordonnées physiques : classeur, page, recto/verso, ligne et colonne.
- `src/screens/DashboardScreen.jsx` gère l'import/export JSON.
- `public/sw.js` précache l'app shell, les polices et met en cache les assets GET compatibles.
- `PokéClasseur Standalone.html` est une version HTML autonome conservée dans le dépôt, séparée du build Vite courant.

## Données

La majorité des données statiques vit dans `src/data` :

- `pokemon.js` : espèces, noms français et types.
- `regions.js` : plages régionales du Pokédex.
- `evolutions.js` : chaînes d'évolution.
- `stats.js`, `pokemonDetails.js`, `pokemonForms.js` : données enrichies depuis PokéAPI.
- `pokedexEntries.js` et `gamePokedexes.js` : descriptions par jeu.
- `badges.js`, `trainers.js`, `achievements.js` : objectifs et progression.

Pour inspecter l'état des données :

```bash
uv run scripts/update_data.py status
```

Pour synchroniser depuis le bundle local `file_imports/pokevault_bundle.json`, puis compléter les données manquantes via PokéAPI :

```bash
uv run scripts/update_data.py sync
```

Pour régénérer les badges depuis `file_imports/badge-battles.json` :

```bash
node scripts/generate-badges.js
```

Les fichiers sous `file_imports/` sont ignorés par Git. Ils servent aux imports locaux et ne sont pas requis pour utiliser l'application depuis les données déjà générées dans `src/data`.

## Stockage utilisateur

La collection et les réglages sont stockés côté navigateur dans `localStorage` :

- `pokeclasseur_collection`
- `pokeclasseur_bcfg`
- `pokeclasseur_theme`
- `pokeclasseur_tour_completed`
- `pokeclasseur_last_update_check`

Effacer les données du site dans le navigateur supprime donc la collection locale. Utilisez l'export JSON pour transférer ou sauvegarder une collection.

## Déploiement Netlify

Le fichier `netlify.toml` définit :

```toml
[build]
  command = "pnpm build"
  publish = "dist"
```

Il inclut aussi une redirection SPA vers `index.html`, nécessaire pour servir correctement l'application depuis n'importe quelle route.

## Contribuer

Les contributions sont bienvenues. Avant d'ouvrir une pull request, lisez [CONTRIBUTING.md](CONTRIBUTING.md) et lancez :

```bash
pnpm check
```

Pour signaler une vulnérabilité, suivez [SECURITY.md](SECURITY.md). Les échanges du projet suivent [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Marques

Ce projet n'est pas affilié à Nintendo, Creatures, Game Freak ou The Pokémon Company. Les noms, marques, images et éléments Pokémon appartiennent à leurs détenteurs respectifs.

## Licence

MIT. Voir [LICENSE](LICENSE).
