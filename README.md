# PokéClasseur

Application mobile de gestion de collection Pokémon — organisée par classeurs physiques de 10 pages, par région.

Cette version a été entièrement modularisée sous forme d'application React moderne propulsée par Vite. Elle est configurée pour fonctionner 100% hors ligne (PWA) et prête à être déployée en un clic sur Netlify.

---

## Fonctionnalités

### 📖 Pokédex
- 386 Pokémon (Générations 1, 2, 3 : Kanto · Johto · Hoenn).
- Filtre par région, statut (Rangé / En main / Manquant), recherche textuelle par nom ou numéro.
- Fiche détaillée : statistiques de base avec diagrammes, faiblesses types, chaîne d'évolution et dresseurs associés.
- Entrées Pokédex riches chargées dynamiquement depuis l'API PokéAPI en ligne, avec repli de secours hors ligne.

### 📋 Classeurs Physiques Virtuels
- Organisation automatique par région (un classeur par région).
- **10 pages par classeur**, recto/verso.
- **Règle famille** : les chaînes d'évolution ne sont jamais coupées sur une ligne.
- Formats de page physiques configurables : 3×3, 4×3, 4×4.

### ⚔️ Dresseurs & Badges
- **Kanto** — 8 chefs d'arène + Élite 4 + Rival.
- **Johto** — 8 chefs d'arène.
- **Hoenn** — 8 chefs d'arène.
- Progression des badges et des succès globaux (Champion de région, Grand Maître, Dresseur Ultime).

### 📊 Statistiques & Sauvegarde
- Progression globale et régionale détaillée.
- Sauvegarde automatique dans le `localStorage` de l'appareil (la collection n'est plus perdue en fermant l'onglet).
- Export & **Import** de la collection au format JSON pour les sauvegardes et transferts.

### ⚙️ Config & Personnalisation
- Thèmes graphiques premium intégrés changeables en un clic (Shadow, Midnight, Ember).
- Règle famille activable/désactivable.
- Formats de grilles personnalisables.

---

## 🛠️ Structure Modulaire (Ajouter des Générations)

Le projet a été conçu de manière ultra-modulaire pour vous permettre d'ajouter la Génération 4 (Sinnoh) et les suivantes en quelques minutes :
1. Dans `src/data/regions.js` : Ajoutez la nouvelle région avec sa plage d'IDs (ex: Sinnoh, IDs 387 à 493).
2. Dans `src/data/pokemon.js` : Ajoutez les noms français et types des nouveaux Pokémon.
3. Dans `src/data/evolutions.js` : Ajoutez les chaînes d'évolution correspondantes.
4. Dans `src/data/trainers.js` : Ajoutez les dresseurs, arènes et équipes de la nouvelle région.
5. Les statistiques et entrées Pokédex s'ajouteront respectivement dans `stats.js` et `pokedexEntries.js` (avec récupération automatique sur PokéAPI si non renseignées).

---

## 🚀 Développement Local (PWA & Offline)

Pour faire tourner le projet localement :

1. Installez les dépendances avec `pnpm` :
   ```bash
   pnpm install
   ```
2. Lancez le serveur de développement :
   ```bash
   pnpm dev
   ```
3. Compilez la version de production :
   ```bash
   pnpm build
   ```

### Mode PWA (Application mobile native)
L'application intègre un Service Worker (`sw.js`) et des polices locales pré-packagées dans `public/fonts/`. Lorsque vous hébergez l'application sur un serveur HTTPS (ou Netlify) :
- **Sur iOS (Safari)** : Bouton Partager ➔ « Sur l'écran d'accueil ».
- **Sur Android (Chrome)** : Menu ⋮ ➔ « Ajouter à l'écran d'accueil ».

L'icône Pokéball s'ajoute à votre écran d'accueil et l'application s'ouvre en mode plein écran sans barres de navigation.

- **Mises à jour intelligentes** : Une bannière interactive notifie l'utilisateur lorsqu'une mise à jour de l'application est disponible (nouvelle build sur Netlify), permettant de recharger proprement la PWA sans mélanger d'anciens et nouveaux fichiers.
- **Notifications de Déblocage (Toasts)** : Lorsqu'un badge ou un succès est débloqué, un toast flottant animé apparaît en haut de l'écran avec une médaille, un effet de halo lumineux et un lien direct pour voir les détails du badge.

---

## ☁️ Déploiement sur Netlify

Le projet contient un fichier `netlify.toml` pré-configuré. Pour déployer :
1. Poussez ce dépôt sur GitHub.
2. Créez un nouveau site sur Netlify et liez-le à votre dépôt GitHub.
3. Netlify détectera automatiquement la configuration et déploiera l'application.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
