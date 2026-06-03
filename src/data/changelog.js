// ── Changelog PokéClasseur ─────────────────────────────────────────────────
export const CHANGELOG = [
  {
    version: '2.1.0',
    date: '2026-06-03',
    title: 'Tutoriel Interactif avec Spotlights & Focus',
    items: [
      '🎯 Nouveau système de spotlight dynamique qui met en évidence les éléments réels de l\'application',
      '💬 Bulle d\'information contextuelle avec positionnement intelligent (au-dessus, en-dessous ou centrée)',
      '👆 Zone spotlight interactive permettant de cliquer directement sur les éléments (ex: cocher les cartes du classeur pendant le guide)',
      '📜 Défilement automatique intelligent (scrollIntoView) pour amener les éléments hors-champ (comme le bouton d\'export) au centre de l\'écran avant de les pointer',
      '🔄 Recalcul de position en temps réel lors du défilement ou du redimensionnement de l\'écran',
    ],
  },
  {
    version: '2.0.7',
    date: '2026-05-27',
    title: 'Placeholders & Correctifs d\'Images',
    items: [
      '🖼️ Correction complète des avatars de dresseurs (Conseil 4, Rivaux et Champions) sur Pokémon Showdown (0% d\'erreurs 404)',
      '⭐ Intégration de placeholders SVG pour les badges manquants ou en erreur',
      '👤 Intégration de placeholders silhouettes pour les dresseurs non chargés',
    ],
  },
  {
    version: '2.0.6',
    date: '2026-05-27',
    title: 'Objectifs multi-régions & Tableau Pokédex',
    items: [
      '🗺️ Correction des succès et badges régionaux sur le Tableau de bord pour toutes les régions (Johto, Hoenn, etc.)',
      '🔗 Navigation synchronisée : cliquer sur une carte d\'objectifs du Dashboard ouvre désormais la page Succès sur le bon onglet régional',
      '📖 Remplacement du sélecteur d\'entrées Pokédex par un tableau vertical propre, listant tous les jeux et descriptions correspondantes en même temps',
    ],
  },
  {
    version: '2.0.5',
    date: '2026-05-27',
    title: 'Navigation & Succès Spéciaux',
    items: [
      '⚠️ Avertissement dans les Réglages quand la règle famille est active (Kanto et Unys = 11 pages)',
      '🌟 Nouveau filtre "Spéciaux" dans la page Succès pour retrouver les succès légendaires cachés',
      '→ Les cartes de la page Stats sont maintenant cliquables et ouvrent la page Succès avec le bon filtre',
      '→ Navigation directe vers Starters, Arènes, Professeurs, Maîtrises, Pokédex et Succès Spéciaux',
    ],
  },
  {
    version: '2.0.4',
    date: '2026-05-27',
    title: 'Correction Kanto & Unys (Mewtwo)',
    items: [
      '🐛 Correction : Mewtwo, Mew et les derniers Pokémon d\'Unys n\'apparaissaient pas dans les classeurs',
      '📖 Le nombre de pages par classeur passe de 10 à 11 pour absorber les sauts de ligne de la règle famille',
      '🔄 Migration automatique pour les utilisateurs existants',
    ],
  },
  {
    version: '2.0.3',
    date: '2026-05-27',
    title: 'Classeurs interactifs',
    items: [
      '👆 Cliquer sur une pochette dans les Classeurs change maintenant le statut du Pokémon (→ En main → Rangé → vide)',
      '✨ Effet de zoom tactile au tap pour un meilleur feedback',
    ],
  },
  {
    version: '2.0.2',
    date: '2026-05-27',
    title: 'Scroll intelligent dans le Pokédex',
    items: [
      '📜 Fermer la fiche d\'un Pokémon ne revient plus tout en haut de la liste',
      '🎯 Au retour, le Pokémon consulté s\'aligne automatiquement en haut de l\'écran sans animation saccadée',
      '⚡ La grille reste montée en mémoire pour conserver la position de défilement',
    ],
  },
  {
    version: '2.0.1',
    date: '2026-05-26',
    title: 'Guide installation iOS',
    items: [
      '📱 Affichage automatique d\'un guide d\'installation sur iPhone/iPad (Safari ne propose pas d\'installation automatique)',
      '3 étapes claires : Bouton Partager → Sur l\'écran d\'accueil → Ajouter',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-05-26',
    title: 'Guide d\'accueil interactif',
    items: [
      '✨ Nouveau guide d\'accueil qui se lance automatiquement pour les nouvelles collections vides',
      '🗺️ 6 étapes pour découvrir le Pokédex, les Classeurs, les Succès, les Stats et les Réglages',
      '⚙️ Bouton "Rejouer le guide" dans les Réglages pour le relancer à tout moment',
      '🔵 L\'overlay du guide ne bloque plus la barre de navigation du bas',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-05-25',
    title: 'Système de floutage unifié & Succès secrets',
    items: [
      '🔒 Succès secrets : titre et description masqués jusqu\'au déblocage (affichés comme "Succès Mystère")',
      '👁 Badges d\'arènes : nom, rôle et ville toujours visibles — seule l\'équipe adverse reste floutée',
      '🎯 Succès de collection : jamais floutés, barre de progression toujours lisible',
    ],
  },
  {
    version: '1.1.9',
    date: '2026-05-25',
    title: 'Infos de mise à jour dans les Réglages',
    items: [
      '📊 Panneau PWA dans les Réglages : version installée, état (À jour / Mise à jour prête / Hors ligne)',
      '🕐 Affichage de la date de la dernière vérification',
      '🔍 Bouton "Rechercher une mise à jour" et "Installer" si disponible',
    ],
  },
  {
    version: '1.1.8',
    date: '2026-05-25',
    title: 'Enrichissement des succès & Maîtrises de type',
    items: [
      '🥋 18 nouveaux succès "Maîtrise de Type" (Feu, Eau, Plante…)',
      '📖 Nouveaux succès Pokédex : paliers de capture, mémoire vivante, tous les types',
      '🌱 Succès starters pour les 9 générations',
      '🏆 Succès légendaires pour les trios iconiques (Oiseaux, Golems, Lacs…)',
      '🎓 Évaluations des professeurs régionaux à 50% et 100% de complétion',
    ],
  },
  {
    version: '1.1.7',
    date: '2026-05-25',
    title: 'Têtes des Professeurs & Starters régionaux',
    items: [
      '🎓 Les têtes des Professeurs (Oak, Orme, Bouleaux…) s\'affichent correctement dans les succès de région',
      '🌱 Succès pour les familles complètes de starters de chaque génération',
      '🐛 Correction du filtre "Professeur" qui ne montrait pas les succès de championnats régionaux',
    ],
  },
  {
    version: '1.1.6',
    date: '2026-05-24',
    title: 'Double visuel Champion & Badge',
    items: [
      '🖼 Les fiches de badges affichent maintenant la tête du Champion ET l\'illustration du badge simultanément',
      '🔔 Les notifications toast de déblocage affichent aussi les deux visuels',
    ],
  },
  {
    version: '1.1.5',
    date: '2026-05-24',
    title: 'Intégration graphique des succès',
    items: [
      '🖼 Remplacement des émojis par les images officielles dans les cartes de succès et les notifications',
      '👤 Avatars Showdown pour les Champions, l\'Élite 4 et les rivaux de toutes générations',
      '🎖 Médailles de badges officielles depuis Bulbapedia',
    ],
  },
];
