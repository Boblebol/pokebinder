# Changelog

Tous les changements notables de PokéClasseur sont suivis ici.

Le changelog affiché dans l'application est maintenu dans `src/data/changelog.js` et présenté dans l'écran Config. Ce fichier Markdown sert au dépôt open source, aux releases GitHub et à la lecture de l'historique depuis les tags Git.

## [2.2.0] - 2026-07-13

### Ajouté

- Documentation open source complète : contribution, sécurité, code de conduite et changelog public.
- GitHub Actions pour valider `pnpm lint` et `pnpm build` sur `main` et les pull requests.
- Dependabot pour les dépendances npm et les actions GitHub.
- Templates GitHub pour bug reports, feature requests et pull requests.
- Metadata npm/repo dans `package.json`, avec engines Node/pnpm et commande `pnpm check`.

### Amélioré

- README restructuré avec badges, architecture, données, stockage local, contribution et disclaimer de marques.
- `.gitignore` renforcé pour caches, environnements locaux et artefacts de build.
- ESLint stabilisé pour que la CI reflète l'état réel du dépôt.

### Corrigé

- Suppression de petites erreurs lint existantes : variables inutilisées, hook conditionnel dans le guide, dépendances `useMemo` inutiles.
- Suppression d'une clé dupliquée dans la map d'assets de badges.

## [2.1.0] - 2026-06-03

### Ajouté

- Guide d'accueil interactif avec spotlight dynamique sur les vrais éléments de l'application.
- Bulles d'information contextuelles avec positionnement intelligent.
- Recalcul du spotlight au scroll et au redimensionnement.

### Amélioré

- Défilement automatique vers les éléments hors champ pendant le guide.
- Zone spotlight interactive pour conserver les interactions utiles pendant l'onboarding.

## [2.0.7] - 2026-05-27

### Corrigé

- Avatars de dresseurs, Conseil 4, rivaux et champions sur Pokémon Showdown.
- Fallbacks d'images pour dresseurs et badges manquants.

## [2.0.6] - 2026-05-27

### Ajouté

- Navigation depuis les cartes du dashboard vers la page Succès avec le bon filtre régional.

### Amélioré

- Calculs des objectifs régionaux et des badges sur toutes les régions supportées.
- Descriptions Pokédex affichées dans un tableau vertical plus lisible.
- Alignement visuel des cartes Pokémon dans la grille.

## [2.0.5] - 2026-05-27

### Ajouté

- Changelog consultable depuis le panneau PWA des réglages.
- Filtre de succès spéciaux.
- Cartes de statistiques cliquables vers les succès correspondants.

### Amélioré

- Version affichée dynamiquement depuis le changelog in-app.
- Avertissement quand la règle famille implique 11 pages pour Kanto et Unys.

## [2.0.4] - 2026-05-27

### Corrigé

- Placement de Mewtwo, Mew et des derniers Pokémon d'Unys dans les classeurs.
- Migration automatique des configurations de classeur existantes vers 11 pages.

## [2.0.3] - 2026-05-26

### Ajouté

- Interaction directe dans les classeurs : tap sur une case pour cycler le statut.
- Feedback tactile au tap sur les cases.

## [2.0.2] - 2026-05-26

### Amélioré

- Retour depuis une fiche Pokémon sans perdre la position dans la grille.
- Alignement automatique du Pokémon consulté au retour dans le Pokédex.

## [2.0.1] - 2026-05-26

### Ajouté

- Guide d'installation iOS/Safari dans les réglages.

### Amélioré

- Overlay du tour ajusté pour ne pas couvrir la barre d'onglets.

## [2.0.0] - 2026-05-26

### Ajouté

- Guide d'accueil interactif pour les nouvelles collections vides.
- Bouton de rejeu du guide depuis les réglages.

## [1.2.0] - 2026-05-26

### Amélioré

- Système unifié de floutage/verrouillage pour Progression, Collection et Secrets.
- Succès secrets masqués jusqu'au déblocage.
- Progression des objectifs de collection toujours lisible.

## [1.1.9] - 2026-05-26

### Ajouté

- Panneau PWA dans les réglages avec état en ligne/hors ligne, dernière vérification et recherche de mise à jour.

## [1.1.8] - 2026-05-26

### Ajouté

- Maîtrises de type.
- Paliers Pokédex enrichis.
- Succès starters et légendaires.
- Évaluations des professeurs régionaux.

## [1.1.7] - 2026-05-26

### Ajouté

- Succès de familles complètes pour les starters de toutes les générations.

### Corrigé

- Filtres régionaux et affichage des têtes de professeurs dans les succès.

## [1.1.6] - 2026-05-26

### Amélioré

- Fiches de badges avec tête du champion et illustration du badge.
- Notifications de déblocage avec les deux visuels.

## [1.1.5] - 2026-05-26

### Ajouté

- Images officielles pour cartes de succès et notifications.
- Avatars Showdown pour champions, Conseil 4 et rivaux.
- Médailles de badges depuis Bulbapedia.

## [1.1.4] - 2026-05-26

### Ajouté

- Notifications toast lors du déblocage de badges et succès.
- Détection et installation des mises à jour PWA.

## [1.1.3] - 2026-05-25

### Amélioré

- Installabilité PWA avec icônes PNG.
- Initialisation de collection par défaut plus robuste.

## [1.1.2] - 2026-05-25

### Ajouté

- Descriptions Pokédex françaises complètes par version depuis PokéAPI.

## [1.1.1] - 2026-05-25

### Ajouté

- Import de descriptions Pokédex complètes.

### Amélioré

- CLI `scripts/update_data.py` pour l'import et la mise à jour des données.

## [1.1.0] - 2026-05-25

### Ajouté

- Restructuration des succès et badges.
- Filtres de catégories.
- Progression par région.

## [1.0.0] - 2026-05-24

### Ajouté

- Première version modulaire React/Vite.
- PWA offline, polices locales, manifest et configuration Netlify.
- Données statiques et structure initiale des écrans.

[2.2.0]: https://github.com/Boblebol/pokebinder/releases/tag/v2.2.0
[2.1.0]: https://github.com/Boblebol/pokebinder/releases/tag/v2.1.0
[2.0.7]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.7
[2.0.6]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.6
[2.0.5]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.5
[2.0.4]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.4
[2.0.3]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.3
[2.0.2]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.2
[2.0.1]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.1
[2.0.0]: https://github.com/Boblebol/pokebinder/releases/tag/v2.0.0
[1.2.0]: https://github.com/Boblebol/pokebinder/releases/tag/v1.2.0
[1.1.9]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.9
[1.1.8]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.8
[1.1.7]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.7
[1.1.6]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.6
[1.1.5]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.5
[1.1.4]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.4
[1.1.3]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.3
[1.1.2]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.2
[1.1.1]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.1
[1.1.0]: https://github.com/Boblebol/pokebinder/releases/tag/v1.1.0
[1.0.0]: https://github.com/Boblebol/pokebinder/releases/tag/v1.0.0
