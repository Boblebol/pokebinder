import { TRAINERS } from './trainers.js';
import { POKEMON_RAW } from './pokemon.js';
import { EVOLUTIONS_RAW } from './evolutions.js';

// Count how many Pokémon are owned in the collection
const countOwned = (col) => {
  return POKEMON_RAW.filter(([id]) => col[id] === 'rangé' || col[id] === 'en main').length;
};

// Count how many Pokémon of a specific type are owned
const countOwnedType = (col, type) => {
  return POKEMON_RAW.filter(([id, name, t1, t2]) => {
    const isOwned = col[id] === 'rangé' || col[id] === 'en main';
    return isOwned && (t1 === type || t2 === type);
  }).length;
};

// Count how many Pokémon of a region range are owned
const countOwnedRegion = (col, min, max) => {
  let count = 0;
  for (let id = min; id <= max; id++) {
    if (col[id] === 'rangé' || col[id] === 'en main') {
      count++;
    }
  }
  return count;
};

// Evolution helper
const EVOLVED_SET = new Set();
EVOLUTIONS_RAW.forEach(chain => {
  chain.slice(1).forEach(id => EVOLVED_SET.add(id));
});

// Stone evolution IDs
const STONE_EVO_IDS = new Set([26, 31, 34, 36, 40, 45, 59, 62, 71, 91, 103, 121, 134, 135, 136, 182, 186, 192]);

// Happiness evolution IDs
const HAPPINESS_EVO_IDS = new Set([25, 35, 39, 143, 169, 176, 196, 197, 183, 242, 428]);

// Trade evolution IDs
const TRADE_EVO_IDS = new Set([65, 68, 76, 94, 208, 212, 230, 233, 351, 474]);

// Starter base IDs
const BASE_STARTERS = new Set([1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656, 722, 725, 728, 810, 813, 816, 906, 909, 912]);

export const ACHIEVEMENTS = [
  // ==========================================
  // --- Exploration / Pokédex ---
  // ==========================================
  {
    id: 'je-choisis-toi',
    type: 'pokedex',
    region: 'global',
    label: 'Je te choisis !',
    icon: '🔴',
    color: '#3b82f6',
    desc: 'Enregistre ton premier Pokémon dans la collection.',
    check: (col) => countOwned(col) >= 1,
    progress: (col) => ({ cur: Math.min(1, countOwned(col)), max: 1 })
  },
  {
    id: 'debut-aventure',
    type: 'pokedex',
    region: 'global',
    label: 'Début d’aventure',
    icon: '🎒',
    color: '#10b981',
    desc: 'Range 10 Pokémon dans ta collection.',
    check: (col) => countOwned(col) >= 10,
    progress: (col) => ({ cur: Math.min(10, countOwned(col)), max: 10 })
  },
  {
    id: 'chercheur-pokemon',
    type: 'pokedex',
    region: 'global',
    label: 'Chercheur Pokémon',
    icon: '🔍',
    color: '#f59e0b',
    desc: 'Range 30 Pokémon dans ta collection.',
    check: (col) => countOwned(col) >= 30,
    progress: (col) => ({ cur: Math.min(30, countOwned(col)), max: 30 })
  },
  {
    id: 'assistant-professeur',
    type: 'pokedex',
    region: 'global',
    label: 'Assistant du Professeur',
    icon: '🔬',
    color: '#8b5cf6',
    desc: 'Range 50 Pokémon dans ta collection.',
    check: (col) => countOwned(col) >= 50,
    progress: (col) => ({ cur: Math.min(50, countOwned(col)), max: 50 })
  },
  {
    id: 'pokedex-route',
    type: 'pokedex',
    region: 'global',
    label: 'Pokédex national : en route !',
    icon: '✈️',
    color: '#ec4899',
    desc: 'Range 250 Pokémon dans ta collection.',
    check: (col) => countOwned(col) >= 250,
    progress: (col) => ({ cur: Math.min(250, countOwned(col)), max: 250 })
  },
  {
    id: 'memoire-vivante',
    type: 'pokedex',
    region: 'global',
    label: 'Mémoire vivante',
    icon: '📚',
    color: '#06b6d4',
    desc: 'Ranger au moins un Pokémon de chaque génération (1 à 9).',
    check: (col) => {
      const gens = [
        [1, 151], [152, 251], [252, 386], [387, 493], [494, 649],
        [650, 721], [722, 809], [810, 905], [906, 1025]
      ];
      return gens.every(([min, max]) => countOwnedRegion(col, min, max) > 0);
    },
    progress: (col) => {
      const gens = [
        [1, 151], [152, 251], [252, 386], [387, 493], [494, 649],
        [650, 721], [722, 809], [810, 905], [906, 1025]
      ];
      const cur = gens.filter(([min, max]) => countOwnedRegion(col, min, max) > 0).length;
      return { cur, max: gens.length };
    }
  },
  {
    id: 'toutes-formes-vie',
    type: 'pokedex',
    region: 'global',
    label: 'Toutes les formes de vie',
    icon: '🧬',
    color: '#a855f7',
    desc: 'Ranger au moins un Pokémon de chaque type élémentaire.',
    check: (col) => {
      const types = ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost', 'ice', 'dragon', 'steel', 'dark', 'flying'];
      const ownedTypes = new Set();
      POKEMON_RAW.forEach(([id, name, t1, t2]) => {
        if (col[id] === 'rangé' || col[id] === 'en main') {
          if (t1) ownedTypes.add(t1);
          if (t2) ownedTypes.add(t2);
        }
      });
      return types.every(t => ownedTypes.has(t));
    },
    progress: (col) => {
      const types = ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost', 'ice', 'dragon', 'steel', 'dark', 'flying'];
      const ownedTypes = new Set();
      POKEMON_RAW.forEach(([id, name, t1, t2]) => {
        if (col[id] === 'rangé' || col[id] === 'en main') {
          if (t1) ownedTypes.add(t1);
          if (t2) ownedTypes.add(t2);
        }
      });
      return { cur: types.filter(t => ownedTypes.has(t)).length, max: types.length };
    }
  },

  // ==========================================
  // --- Mécaniques de jeu / Évolutions ---
  // ==========================================
  {
    id: 'le-choix-destin',
    type: 'special',
    region: 'global',
    label: 'Le choix du destin',
    icon: '🌱',
    color: '#10b981',
    desc: 'Obtiens un premier Pokémon de départ (starter).',
    check: (col) => Array.from(BASE_STARTERS).some(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ownedCount = Array.from(BASE_STARTERS).filter(id => col[id] === 'rangé' || col[id] === 'en main').length;
      return { cur: Math.min(1, ownedCount), max: 1 };
    }
  },
  {
    id: 'tous-partenaires',
    type: 'special',
    region: 'global',
    label: 'Tous les partenaires',
    icon: '🤝',
    color: '#10b981',
    desc: 'Obtiens les 27 Pokémon de départ de toutes les générations.',
    check: (col) => Array.from(BASE_STARTERS).every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const cur = Array.from(BASE_STARTERS).filter(id => col[id] === 'rangé' || col[id] === 'en main').length;
      return { cur, max: BASE_STARTERS.size };
    }
  },
  {
    id: 'ca-evolue',
    type: 'special',
    region: 'global',
    label: 'Ça évolue !',
    icon: '✨',
    color: '#fbbf24',
    desc: 'Ajoute un premier Pokémon évolué dans ta collection.',
    check: (col) => Object.keys(col).some(id => (col[id] === 'rangé' || col[id] === 'en main') && EVOLVED_SET.has(Number(id))),
    progress: (col) => {
      const ownedCount = Object.keys(col).filter(id => (col[id] === 'rangé' || col[id] === 'en main') && EVOLVED_SET.has(Number(id))).length;
      return { cur: Math.min(1, ownedCount), max: 1 };
    }
  },
  {
    id: 'pierre-etrange',
    type: 'special',
    region: 'global',
    label: 'Pierre étrange',
    icon: '💎',
    color: '#3b82f6',
    desc: 'Ranger un Pokémon évolué via une pierre évolutive (ex: Raichu, Arcanin, Aquali).',
    check: (col) => Object.keys(col).some(id => (col[id] === 'rangé' || col[id] === 'en main') && STONE_EVO_IDS.has(Number(id))),
    progress: (col) => {
      const ownedCount = Object.keys(col).filter(id => (col[id] === 'rangé' || col[id] === 'en main') && STONE_EVO_IDS.has(Number(id))).length;
      return { cur: Math.min(1, ownedCount), max: 1 };
    }
  },
  {
    id: 'bonheur-maximum',
    type: 'special',
    region: 'global',
    label: 'Bonheur maximum',
    icon: '❤️',
    color: '#ec4899',
    desc: 'Ranger un Pokémon évoluant par bonheur/amitié (ex: Nostenfer, Togetic, Mentali, Noctali).',
    check: (col) => Object.keys(col).some(id => (col[id] === 'rangé' || col[id] === 'en main') && HAPPINESS_EVO_IDS.has(Number(id))),
    progress: (col) => {
      const ownedCount = Object.keys(col).filter(id => (col[id] === 'rangé' || col[id] === 'en main') && HAPPINESS_EVO_IDS.has(Number(id))).length;
      return { cur: Math.min(1, ownedCount), max: 1 };
    }
  },
  {
    id: 'echange-mysterieux',
    type: 'special',
    region: 'global',
    label: 'Échange mystérieux',
    icon: '🔄',
    color: '#10b981',
    desc: 'Ranger un Pokémon évoluant par échange (ex: Alakazam, Mackogneur, Grolem, Ectoplasma).',
    check: (col) => Object.keys(col).some(id => (col[id] === 'rangé' || col[id] === 'en main') && TRADE_EVO_IDS.has(Number(id))),
    progress: (col) => {
      const ownedCount = Object.keys(col).filter(id => (col[id] === 'rangé' || col[id] === 'en main') && TRADE_EVO_IDS.has(Number(id))).length;
      return { cur: Math.min(1, ownedCount), max: 1 };
    }
  },
  {
    id: 'metamorphose-complete',
    type: 'special',
    region: 'global',
    label: 'Métamorphose complète',
    icon: '🧬',
    color: '#8b5cf6',
    desc: 'Complète une ligne d’évolution entière (ex: Bulbizarre + Herbizarre + Florizarre).',
    check: (col) => EVOLUTIONS_RAW.some(chain => chain.every(id => col[id] === 'rangé' || col[id] === 'en main')),
    progress: (col) => {
      const completeChains = EVOLUTIONS_RAW.filter(chain => chain.every(id => col[id] === 'rangé' || col[id] === 'en main')).length;
      return { cur: Math.min(1, completeChains), max: 1 };
    }
  },

  // ==========================================
  // --- Badges Régionaux / Nostalgiques ---
  // ==========================================
  {
    id: 'champ-kanto',
    type: 'gyms',
    region: 'kanto',
    label: 'Retour à Kanto',
    icon: '🔴',
    color: '#ff375f',
    desc: 'Décroche tous les badges de la ligue de Kanto.',
    check: (col) => TRAINERS.filter(t => t.region === 'kanto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-johto',
    type: 'gyms',
    region: 'johto',
    label: 'Les mers de Johto',
    icon: '⭐',
    color: '#ffd60a',
    desc: 'Décroche tous les badges de la ligue de Johto.',
    check: (col) => TRAINERS.filter(t => t.region === 'johto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-gs',
    type: 'gyms',
    region: 'johto',
    label: 'Rivalités de Johto',
    icon: '🏆',
    color: '#ffd60a',
    desc: 'Décroche tous les badges de la ligue de Gs.',
    check: (col) => TRAINERS.filter(t => t.region === 'gs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-rs',
    type: 'gyms',
    region: 'hoenn',
    label: 'Terre et Océan',
    icon: '🏆',
    color: '#22c55e',
    desc: 'Décroche tous les badges de la ligue de Rs.',
    check: (col) => TRAINERS.filter(t => t.region === 'rs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-dp',
    type: 'gyms',
    region: 'sinnoh',
    label: 'Légendes de Sinnoh',
    icon: '🏆',
    color: '#38bdf8',
    desc: 'Décroche tous les badges de la ligue de Dp.',
    check: (col) => TRAINERS.filter(t => t.region === 'dp' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-bw',
    type: 'gyms',
    region: 'unys',
    label: 'Un monde de rêves',
    icon: '🏆',
    color: '#fb923c',
    desc: 'Décroche tous les badges de la ligue de Bw.',
    check: (col) => TRAINERS.filter(t => t.region === 'bw' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-b2w2',
    type: 'gyms',
    region: 'b2w2',
    label: 'Un monde de rêves 2',
    icon: '🏆',
    color: '#fb923c',
    desc: 'Décroche tous les badges de la ligue de B2w2.',
    check: (col) => TRAINERS.filter(t => t.region === 'b2w2' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-xy',
    type: 'gyms',
    region: 'kalos',
    label: 'Le secret de Kalos',
    icon: '🏆',
    color: '#a78bfa',
    desc: 'Décroche tous les badges de la ligue de Xy.',
    check: (col) => TRAINERS.filter(t => t.region === 'xy' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-sm',
    type: 'gyms',
    region: 'alola',
    label: 'Évasion sous le Soleil',
    icon: '🏆',
    color: '#f472b6',
    desc: 'Décroche tous les badges de la ligue de Sm.',
    check: (col) => TRAINERS.filter(t => t.region === 'sm' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-swsh',
    type: 'gyms',
    region: 'galar',
    label: 'Le Bouclier de Galar',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de la ligue de Swsh.',
    check: (col) => TRAINERS.filter(t => t.region === 'swsh' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-sv',
    type: 'gyms',
    region: 'paldea',
    label: 'Trésor de Paldea',
    icon: '🏆',
    color: '#ec4899',
    desc: 'Décroche tous les badges de la ligue de Sv.',
    check: (col) => TRAINERS.filter(t => t.region === 'sv' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },

  // ==========================================
  // --- Starters Régionaux (Trio de Départ) ---
  // ==========================================
  {
    id: 'starters-kanto',
    type: 'starters',
    region: 'kanto',
    label: 'Starters de Kanto',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Bulbizarre, Salamèche, Carapuce et leurs évolutions.',
    check: (col) => [1, 2, 3, 4, 5, 6, 7, 8, 9].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-gs',
    type: 'starters',
    region: 'johto',
    label: 'Starters de Johto',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Germignon, Héricendre, Kaiminus et leurs évolutions.',
    check: (col) => [152, 153, 154, 155, 156, 157, 158, 159, 160].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [152, 153, 154, 155, 156, 157, 158, 159, 160];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-rs',
    type: 'starters',
    region: 'hoenn',
    label: 'Starters de Hoenn',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Arcko, Poussifeu, Gobou et leurs évolutions.',
    check: (col) => [252, 253, 254, 255, 256, 257, 258, 259, 260].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [252, 253, 254, 255, 256, 257, 258, 259, 260];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-dp',
    type: 'starters',
    region: 'sinnoh',
    label: 'Starters de Sinnoh',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Tortipouss, Ouisticram, Tiplouf et leurs évolutions.',
    check: (col) => [387, 388, 389, 390, 391, 392, 393, 394, 395].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [387, 388, 389, 390, 391, 392, 393, 394, 395];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-bw',
    type: 'starters',
    region: 'unys',
    label: 'Starters d\'Unys',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Vipélierre, Gruikui, Moustillon et leurs évolutions.',
    check: (col) => [495, 496, 497, 498, 499, 500, 501, 502, 503].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [495, 496, 497, 498, 499, 500, 501, 502, 503];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-xy',
    type: 'starters',
    region: 'kalos',
    label: 'Starters de Kalos',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Marisson, Feunnec, Grenousse et leurs évolutions.',
    check: (col) => [650, 651, 652, 653, 654, 655, 656, 657, 658].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [650, 651, 652, 653, 654, 655, 656, 657, 658];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-sm',
    type: 'starters',
    region: 'alola',
    label: 'Starters d\'Alola',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Brindibou, Flamiaou, Otaquin et leurs évolutions.',
    check: (col) => [722, 723, 724, 725, 726, 727, 728, 729, 730].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [722, 723, 724, 725, 726, 727, 728, 729, 730];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-swsh',
    type: 'starters',
    region: 'galar',
    label: 'Starters de Galar',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Ouistempo, Flambino, Larméléon et leurs évolutions.',
    check: (col) => [810, 811, 812, 813, 814, 815, 816, 817, 818].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [810, 811, 812, 813, 814, 815, 816, 817, 818];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'starters-sv',
    type: 'starters',
    region: 'paldea',
    label: 'Starters de Paldea',
    icon: '🌱',
    color: '#4ade80',
    desc: 'Obtiens Poussacha, Chochodile, Coiffeton et leurs évolutions.',
    check: (col) => [906, 907, 908, 909, 910, 911, 912, 913, 914].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [906, 907, 908, 909, 910, 911, 912, 913, 914];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },

  // ==========================================
  // --- Rapports des Professeurs (Régions 50% & 100%) ---
  // ==========================================
  // Kanto
  {
    id: 'recherche-kanto-50',
    type: 'prof',
    region: 'kanto',
    label: 'Encouragements de Chen',
    icon: '🎓',
    color: '#ff375f',
    desc: 'Complète 50% du Pokédex régional de Kanto (75 Pokémon).',
    check: (col) => countOwnedRegion(col, 1, 151) >= 75,
    progress: (col) => ({ cur: Math.min(75, countOwnedRegion(col, 1, 151)), max: 75 })
  },
  {
    id: 'recherche-kanto-100',
    type: 'prof',
    region: 'kanto',
    label: 'Merci du Professeur Chen',
    icon: '🎓',
    color: '#ff375f',
    desc: 'Complète 100% du Pokédex régional de Kanto (151 Pokémon).',
    check: (col) => countOwnedRegion(col, 1, 151) >= 151,
    progress: (col) => ({ cur: countOwnedRegion(col, 1, 151), max: 151 })
  },
  // Johto
  {
    id: 'recherche-johto-50',
    type: 'prof',
    region: 'johto',
    label: 'Encouragements d’Orme',
    icon: '🎓',
    color: '#ffd60a',
    desc: 'Complète 50% du Pokédex régional de Johto (50 Pokémon).',
    check: (col) => countOwnedRegion(col, 152, 251) >= 50,
    progress: (col) => ({ cur: Math.min(50, countOwnedRegion(col, 152, 251)), max: 50 })
  },
  {
    id: 'recherche-johto-100',
    type: 'prof',
    region: 'johto',
    label: 'Merci du Professeur Orme',
    icon: '🎓',
    color: '#ffd60a',
    desc: 'Complète 100% du Pokédex régional de Johto (100 Pokémon).',
    check: (col) => countOwnedRegion(col, 152, 251) >= 100,
    progress: (col) => ({ cur: countOwnedRegion(col, 152, 251), max: 100 })
  },
  // Hoenn
  {
    id: 'recherche-hoenn-50',
    type: 'prof',
    region: 'hoenn',
    label: 'Encouragements de Seko',
    icon: '🎓',
    color: '#22c55e',
    desc: 'Complète 50% du Pokédex régional de Hoenn (67 Pokémon).',
    check: (col) => countOwnedRegion(col, 252, 386) >= 67,
    progress: (col) => ({ cur: Math.min(67, countOwnedRegion(col, 252, 386)), max: 67 })
  },
  {
    id: 'recherche-hoenn-100',
    type: 'prof',
    region: 'hoenn',
    label: 'Merci du Professeur Seko',
    icon: '🎓',
    color: '#22c55e',
    desc: 'Complète 100% du Pokédex régional de Hoenn (135 Pokémon).',
    check: (col) => countOwnedRegion(col, 252, 386) >= 135,
    progress: (col) => ({ cur: countOwnedRegion(col, 252, 386), max: 135 })
  },
  // Sinnoh
  {
    id: 'recherche-sinnoh-50',
    type: 'prof',
    region: 'sinnoh',
    label: 'Encouragements de Sorbier',
    icon: '🎓',
    color: '#38bdf8',
    desc: 'Complète 50% du Pokédex régional de Sinnoh (53 Pokémon).',
    check: (col) => countOwnedRegion(col, 387, 493) >= 53,
    progress: (col) => ({ cur: Math.min(53, countOwnedRegion(col, 387, 493)), max: 53 })
  },
  {
    id: 'recherche-sinnoh-100',
    type: 'prof',
    region: 'sinnoh',
    label: 'Étude validée par Prof. Sorbier',
    icon: '🎓',
    color: '#38bdf8',
    desc: 'Complète 100% du Pokédex régional de Sinnoh (107 Pokémon).',
    check: (col) => countOwnedRegion(col, 387, 493) >= 107,
    progress: (col) => ({ cur: countOwnedRegion(col, 387, 493), max: 107 })
  },
  // Unys
  {
    id: 'recherche-unys-50',
    type: 'prof',
    region: 'unys',
    label: 'Encouragements de Keteleeria',
    icon: '🎓',
    color: '#fb923c',
    desc: 'Complète 50% du Pokédex régional d’Unys (78 Pokémon).',
    check: (col) => countOwnedRegion(col, 494, 649) >= 78,
    progress: (col) => ({ cur: Math.min(78, countOwnedRegion(col, 494, 649)), max: 78 })
  },
  {
    id: 'recherche-unys-100',
    type: 'prof',
    region: 'unys',
    label: 'Rapport de Prof. Keteleeria',
    icon: '🎓',
    color: '#fb923c',
    desc: 'Complète 100% du Pokédex régional d’Unys (156 Pokémon).',
    check: (col) => countOwnedRegion(col, 494, 649) >= 156,
    progress: (col) => ({ cur: countOwnedRegion(col, 494, 649), max: 156 })
  },
  // Kalos
  {
    id: 'recherche-kalos-50',
    type: 'prof',
    region: 'kalos',
    label: 'Encouragements de Platane',
    icon: '🎓',
    color: '#a78bfa',
    desc: 'Complète 50% du Pokédex régional de Kalos (36 Pokémon).',
    check: (col) => countOwnedRegion(col, 650, 721) >= 36,
    progress: (col) => ({ cur: Math.min(36, countOwnedRegion(col, 650, 721)), max: 36 })
  },
  {
    id: 'recherche-kalos-100',
    type: 'prof',
    region: 'kalos',
    label: 'Merci du Professeur Platane',
    icon: '🎓',
    color: '#a78bfa',
    desc: 'Complète 100% du Pokédex régional de Kalos (72 Pokémon).',
    check: (col) => countOwnedRegion(col, 650, 721) >= 72,
    progress: (col) => ({ cur: countOwnedRegion(col, 650, 721), max: 72 })
  },
  // Alola
  {
    id: 'recherche-alola-50',
    type: 'prof',
    region: 'alola',
    label: 'Encouragements de Kukui',
    icon: '🎓',
    color: '#f472b6',
    desc: 'Complète 50% du Pokédex régional d’Alola (43 Pokémon).',
    check: (col) => countOwnedRegion(col, 722, 807) >= 43,
    progress: (col) => ({ cur: Math.min(43, countOwnedRegion(col, 722, 807)), max: 43 })
  },
  {
    id: 'recherche-alola-100',
    type: 'prof',
    region: 'alola',
    label: 'Merci du Professeur Kukui',
    icon: '🎓',
    color: '#f472b6',
    desc: 'Complète 100% du Pokédex régional d’Alola (86 Pokémon).',
    check: (col) => countOwnedRegion(col, 722, 807) >= 86,
    progress: (col) => ({ cur: countOwnedRegion(col, 722, 807), max: 86 })
  },
  // Galar
  {
    id: 'recherche-galar-50',
    type: 'prof',
    region: 'galar',
    label: 'Encouragements de Magnolia',
    icon: '🎓',
    color: '#888888',
    desc: 'Complète 50% du Pokédex régional de Galar (44 Pokémon).',
    check: (col) => countOwnedRegion(col, 810, 898) >= 44,
    progress: (col) => ({ cur: Math.min(44, countOwnedRegion(col, 810, 898)), max: 44 })
  },
  {
    id: 'recherche-galar-100',
    type: 'prof',
    region: 'galar',
    label: 'Merci du Professeur Magnolia',
    icon: '🎓',
    color: '#888888',
    desc: 'Complète 100% du Pokédex régional de Galar (89 Pokémon).',
    check: (col) => countOwnedRegion(col, 810, 898) >= 89,
    progress: (col) => ({ cur: countOwnedRegion(col, 810, 898), max: 89 })
  },
  // Paldea
  {
    id: 'recherche-paldea-50',
    type: 'prof',
    region: 'paldea',
    label: 'Encouragements de Sada/Turo',
    icon: '🎓',
    color: '#ec4899',
    desc: 'Complète 50% du Pokédex régional de Paldea (60 Pokémon).',
    check: (col) => countOwnedRegion(col, 906, 1025) >= 60,
    progress: (col) => ({ cur: Math.min(60, countOwnedRegion(col, 906, 1025)), max: 60 })
  },
  {
    id: 'recherche-paldea-100',
    type: 'prof',
    region: 'paldea',
    label: 'Merci du Prof. Sada/Turo',
    icon: '🎓',
    color: '#ec4899',
    desc: 'Complète 100% du Pokédex régional de Paldea (120 Pokémon).',
    check: (col) => countOwnedRegion(col, 906, 1025) >= 120,
    progress: (col) => ({ cur: countOwnedRegion(col, 906, 1025), max: 120 })
  },

  // ==========================================
  // --- Succès Légendaires ---
  // ==========================================
  {
    id: 'oiseaux-kanto',
    type: 'special',
    region: 'global',
    label: 'Le pouvoir des oiseaux',
    icon: '⚡',
    color: '#60a5fa',
    desc: 'Ranger Artikodin, Électhor et Sulfura dans la collection.',
    check: (col) => [144, 145, 146].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [144, 145, 146];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'createur-monde',
    type: 'special',
    region: 'global',
    label: 'Créateur du monde',
    icon: '☄️',
    color: '#e2e8f0',
    desc: 'Ranger Arceus, le Pokémon originel, dans la collection.',
    check: (col) => col[493] === 'rangé' || col[493] === 'en main',
    progress: (col) => ({ cur: col[493] === 'rangé' || col[493] === 'en main' ? 1 : 0, max: 1 })
  },
  {
    id: 'gardiens-oceans',
    type: 'special',
    region: 'global',
    label: 'Gardiens des océans',
    icon: '🌊',
    color: '#0284c7',
    desc: 'Ranger Kyogre, Lugia et Manaphy dans la collection.',
    check: (col) => [382, 249, 490].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [382, 249, 490];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'espace-temps',
    type: 'special',
    region: 'global',
    label: 'L’espace et le temps',
    icon: '⏳',
    color: '#6366f1',
    desc: 'Ranger Dialga et Palkia, maîtres des dimensions, dans la collection.',
    check: (col) => [483, 484].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [483, 484];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },
  {
    id: 'lumiere-obscurite',
    type: 'special',
    region: 'global',
    label: 'Lumière et obscurité',
    icon: '☯️',
    color: '#f59e0b',
    desc: 'Ranger Solgaleo et Lunala, émissaires du soleil et de la lune.',
    check: (col) => [791, 792].every(id => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const ids = [791, 792];
      return { cur: ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length, max: ids.length };
    }
  },

  // ==========================================
  // --- Maîtrises de Type ---
  // ==========================================
  {
    id: 'maitrise-normal',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Normal',
    icon: '🥋',
    color: '#a8a77a',
    desc: 'Range 20 Pokémon de type Normal dans ta collection.',
    check: (col) => countOwnedType(col, 'normal') >= 20,
    progress: (col) => ({ cur: Math.min(20, countOwnedType(col, 'normal')), max: 20 })
  },
  {
    id: 'maitrise-fire',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Feu',
    icon: '🔥',
    color: '#ee8130',
    desc: 'Range 15 Pokémon de type Feu dans ta collection.',
    check: (col) => countOwnedType(col, 'fire') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'fire')), max: 15 })
  },
  {
    id: 'maitrise-water',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de l’Eau',
    icon: '💧',
    color: '#6390f0',
    desc: 'Range 25 Pokémon de type Eau dans ta collection.',
    check: (col) => countOwnedType(col, 'water') >= 25,
    progress: (col) => ({ cur: Math.min(25, countOwnedType(col, 'water')), max: 25 })
  },
  {
    id: 'maitrise-grass',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de la Plante',
    icon: '🌿',
    color: '#7ac74c',
    desc: 'Range 20 Pokémon de type Plante dans ta collection.',
    check: (col) => countOwnedType(col, 'grass') >= 20,
    progress: (col) => ({ cur: Math.min(20, countOwnedType(col, 'grass')), max: 20 })
  },
  {
    id: 'maitrise-electric',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de l’Électrik',
    icon: '⚡',
    color: '#f7d02c',
    desc: 'Range 15 Pokémon de type Électrik dans ta collection.',
    check: (col) => countOwnedType(col, 'electric') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'electric')), max: 15 })
  },
  {
    id: 'maitrise-ice',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de la Glace',
    icon: '❄️',
    color: '#96d9d6',
    desc: 'Range 10 Pokémon de type Glace dans ta collection.',
    check: (col) => countOwnedType(col, 'ice') >= 10,
    progress: (col) => ({ cur: Math.min(10, countOwnedType(col, 'ice')), max: 10 })
  },
  {
    id: 'maitrise-fighting',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Combat',
    icon: '🥊',
    color: '#c22e28',
    desc: 'Range 15 Pokémon de type Combat dans ta collection.',
    check: (col) => countOwnedType(col, 'fighting') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'fighting')), max: 15 })
  },
  {
    id: 'maitrise-poison',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Poison',
    icon: '☠️',
    color: '#a33ea1',
    desc: 'Range 15 Pokémon de type Poison dans ta collection.',
    check: (col) => countOwnedType(col, 'poison') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'poison')), max: 15 })
  },
  {
    id: 'maitrise-ground',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Sol',
    icon: '🏜️',
    color: '#e2bf65',
    desc: 'Range 15 Pokémon de type Sol dans ta collection.',
    check: (col) => countOwnedType(col, 'ground') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'ground')), max: 15 })
  },
  {
    id: 'maitrise-flying',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Vol',
    icon: '🦅',
    color: '#a98ff3',
    desc: 'Range 20 Pokémon de type Vol dans ta collection.',
    check: (col) => countOwnedType(col, 'flying') >= 20,
    progress: (col) => ({ cur: Math.min(20, countOwnedType(col, 'flying')), max: 20 })
  },
  {
    id: 'maitrise-psychic',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Psy',
    icon: '🔮',
    color: '#f95587',
    desc: 'Range 15 Pokémon de type Psy dans ta collection.',
    check: (col) => countOwnedType(col, 'psychic') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'psychic')), max: 15 })
  },
  {
    id: 'maitrise-bug',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de l’Insecte',
    icon: '🐛',
    color: '#a6b91a',
    desc: 'Range 15 Pokémon de type Insecte dans ta collection.',
    check: (col) => countOwnedType(col, 'bug') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'bug')), max: 15 })
  },
  {
    id: 'maitrise-rock',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de la Roche',
    icon: '🧱',
    color: '#b6a136',
    desc: 'Range 15 Pokémon de type Roche dans ta collection.',
    check: (col) => countOwnedType(col, 'rock') >= 15,
    progress: (col) => ({ cur: Math.min(15, countOwnedType(col, 'rock')), max: 15 })
  },
  {
    id: 'maitrise-ghost',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Spectre',
    icon: '👻',
    color: '#735797',
    desc: 'Range 10 Pokémon de type Spectre dans ta collection.',
    check: (col) => countOwnedType(col, 'ghost') >= 10,
    progress: (col) => ({ cur: Math.min(10, countOwnedType(col, 'ghost')), max: 10 })
  },
  {
    id: 'maitrise-dragon',
    type: 'maitrise',
    region: 'global',
    label: 'Maître du Dragon',
    icon: '🐲',
    color: '#6f35fc',
    desc: 'Range 10 Pokémon de type Dragon dans ta collection.',
    check: (col) => countOwnedType(col, 'dragon') >= 10,
    progress: (col) => ({ cur: Math.min(10, countOwnedType(col, 'dragon')), max: 10 })
  },
  {
    id: 'maitrise-steel',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de l’Acier',
    icon: '⚙️',
    color: '#b7b7d0',
    desc: 'Range 12 Pokémon de type Acier dans ta collection.',
    check: (col) => countOwnedType(col, 'steel') >= 12,
    progress: (col) => ({ cur: Math.min(12, countOwnedType(col, 'steel')), max: 12 })
  },
  {
    id: 'maitrise-dark',
    type: 'maitrise',
    region: 'global',
    label: 'Maître des Ténèbres',
    icon: '🌙',
    color: '#705746',
    desc: 'Range 12 Pokémon de type Ténèbres dans ta collection.',
    check: (col) => countOwnedType(col, 'dark') >= 12,
    progress: (col) => ({ cur: Math.min(12, countOwnedType(col, 'dark')), max: 12 })
  },
  {
    id: 'maitrise-fairy',
    type: 'maitrise',
    region: 'global',
    label: 'Maître de la Fée',
    icon: '🌸',
    color: '#d685ad',
    desc: 'Range 12 Pokémon de type Fée dans ta collection.',
    check: (col) => countOwnedType(col, 'fairy') >= 12,
    progress: (col) => ({ cur: Math.min(12, countOwnedType(col, 'fairy')), max: 12 })
  },

  // ==========================================
  // --- Dresseur Ultime (National Pokédex 100%) ---
  // ==========================================
  {
    id: 'dresseur-ultime',
    type: 'special',
    region: 'global',
    label: 'Attrapez-les tous !',
    icon: '🌟',
    color: '#c0a0ff',
    desc: 'Tous les Pokémon du Pokédex National rangés ou en main.',
    check: (col) => POKEMON_RAW.every(([id]) => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const cur = POKEMON_RAW.filter(([id]) => col[id] === 'rangé' || col[id] === 'en main').length;
      return { cur, max: POKEMON_RAW.length };
    }
  }
];
