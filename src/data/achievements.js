import { TRAINERS } from './trainers.js';
import { POKEMON_RAW } from './pokemon.js';

export const ACHIEVEMENTS = [
  // --- Kanto ---
  {
    id: 'champ-kanto',
    type: 'prof',
    region: 'kanto',
    label: 'Champion de Kanto',
    icon: '🔴',
    color: '#ff375f',
    desc: 'Décroche tous les badges de Kanto.',
    check: (col) => TRAINERS.filter(t => t.region === 'kanto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
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

  // --- Johto ---
  {
    id: 'champ-johto',
    type: 'prof',
    region: 'johto',
    label: 'Champion de Johto',
    icon: '⭐',
    color: '#ffd60a',
    desc: 'Décroche tous les badges de Johto.',
    check: (col) => TRAINERS.filter(t => t.region === 'johto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-gs',
    type: 'prof',
    region: 'johto',
    label: 'Champion de Gs',
    icon: '🏆',
    color: '#ffd60a',
    desc: 'Décroche tous les badges de Gs.',
    check: (col) => TRAINERS.filter(t => t.region === 'gs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Hoenn ---
  {
    id: 'champ-rs',
    type: 'prof',
    region: 'hoenn',
    label: 'Champion de Rs',
    icon: '🏆',
    color: '#22c55e',
    desc: 'Décroche tous les badges de Rs.',
    check: (col) => TRAINERS.filter(t => t.region === 'rs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Sinnoh ---
  {
    id: 'champ-dp',
    type: 'prof',
    region: 'sinnoh',
    label: 'Champion de Dp',
    icon: '🏆',
    color: '#38bdf8',
    desc: 'Décroche tous les badges de Dp.',
    check: (col) => TRAINERS.filter(t => t.region === 'dp' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Unys ---
  {
    id: 'champ-bw',
    type: 'prof',
    region: 'unys',
    label: 'Champion de Bw',
    icon: '🏆',
    color: '#fb923c',
    desc: 'Décroche tous les badges de Bw.',
    check: (col) => TRAINERS.filter(t => t.region === 'bw' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-b2w2',
    type: 'prof',
    region: 'b2w2',
    label: 'Champion de B2w2',
    icon: '🏆',
    color: '#fb923c',
    desc: 'Décroche tous les badges de B2w2.',
    check: (col) => TRAINERS.filter(t => t.region === 'b2w2' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Kalos ---
  {
    id: 'champ-xy',
    type: 'prof',
    region: 'kalos',
    label: 'Champion de Xy',
    icon: '🏆',
    color: '#a78bfa',
    desc: 'Décroche tous les badges de Xy.',
    check: (col) => TRAINERS.filter(t => t.region === 'xy' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Alola ---
  {
    id: 'champ-sm',
    type: 'prof',
    region: 'alola',
    label: 'Champion de Sm',
    icon: '🏆',
    color: '#f472b6',
    desc: 'Décroche tous les badges de Sm.',
    check: (col) => TRAINERS.filter(t => t.region === 'sm' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Galar ---
  {
    id: 'champ-swsh',
    type: 'prof',
    region: 'galar',
    label: 'Champion de Swsh',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Swsh.',
    check: (col) => TRAINERS.filter(t => t.region === 'swsh' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Paldea ---
  {
    id: 'champ-sv',
    type: 'prof',
    region: 'paldea',
    label: 'Champion de Sv',
    icon: '🏆',
    color: '#ec4899',
    desc: 'Décroche tous les badges de Sv.',
    check: (col) => TRAINERS.filter(t => t.region === 'sv' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
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

  // --- Globaux & Spéciaux ---
  {
    id: 'grand-maitre',
    type: 'special',
    label: 'Grand Maître',
    icon: '👑',
    color: '#ffd700',
    desc: 'Champion de toutes les régions.',
    check: (col) => ['kanto', 'johto', 'dp', 'rs', 'gs', 'swsh', 'xy', 'sv', 'bw', 'sm', 'b2w2'].every(r => TRAINERS.filter(t => t.region === r && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))),
    progress: (col) => {
      const regions = ['kanto', 'johto', 'dp', 'rs', 'gs', 'swsh', 'xy', 'sv', 'bw', 'sm', 'b2w2'];
      const cur = regions.filter(r => TRAINERS.filter(t => t.region === r && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))).length;
      return { cur, max: regions.length };
    }
  },
  {
    id: 'dresseur-ultime',
    type: 'special',
    label: 'Dresseur Ultime',
    icon: '🌟',
    color: '#c0a0ff',
    desc: 'Tous les Pokémon rangés ou en main.',
    check: (col) => POKEMON_RAW.every(([id]) => col[id] === 'rangé' || col[id] === 'en main'),
    progress: (col) => {
      const cur = POKEMON_RAW.filter(([id]) => col[id] === 'rangé' || col[id] === 'en main').length;
      return { cur, max: POKEMON_RAW.length };
    }
  }
];
