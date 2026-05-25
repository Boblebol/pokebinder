import { BADGES } from './badges.js';
import { POKEMON_RAW } from './pokemon.js';
import { REGIONS } from './regions.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const owned = (col, id) => col[id] === 'rangé' || col[id] === 'en main';
const countOwned = col => POKEMON_RAW.filter(([id]) => owned(col, id)).length;

// Vérifie si tous les pokémon d'une plage de numéros nationaux sont capturés
const regionComplete = (col, range) =>
  POKEMON_RAW.filter(([id]) => id >= range[0] && id <= range[1]).every(([id]) => owned(col, id));

// Vérifie si toute une liste d'IDs est capturée
const allOwned = (col, ids) => ids.every(id => owned(col, id));

// Vérifie si un badge BADGES est débloqué (premier encounter, toute l'équipe capturée)
const badgeComplete = (col, badgeId) => {
  const b = BADGES.find(x => x.id === badgeId);
  if (!b) return false;
  const enc = b.encounters[0];
  if (!enc) return false;
  const ids = [...new Set(enc.team.map(m => m.id).filter(Boolean))];
  return ids.length > 0 && ids.every(id => owned(col, id));
};

// Toutes les arènes d'une région
const allGymsDone = (col, region) =>
  BADGES.filter(b => b.region === region && b.badgeName)
    .every(b => badgeComplete(col, b.id));

// ── Starters par région (toutes évolutions) ───────────────────────────────────
const STARTERS = {
  kanto:  { label: 'Starters de Kanto',  icon: '🔴', color: '#ff5555', ids: [1,2,3, 4,5,6, 7,8,9] },
  johto:  { label: 'Starters de Johto',  icon: '⭐', color: '#ffd700', ids: [152,153,154, 155,156,157, 158,159,160] },
  hoenn:  { label: 'Starters de Hoenn',  icon: '💚', color: '#55bb55', ids: [252,253,254, 255,256,257, 258,259,260] },
  sinnoh: { label: 'Starters de Sinnoh', icon: '❄️', color: '#4488ff', ids: [387,388,389, 390,391,392, 393,394,395] },
  unys:   { label: 'Starters d\'Unys',   icon: '⛰️', color: '#888888', ids: [495,496,497, 498,499,500, 501,502,503] },
  kalos:  { label: 'Starters de Kalos',  icon: '⚜️', color: '#aa44ff', ids: [650,651,652, 653,654,655, 656,657,658] },
  alola:  { label: 'Starters d\'Alola',  icon: '☀️', color: '#ff8800', ids: [722,723,724, 725,726,727, 728,729,730] },
  galar:  { label: 'Starters de Galar',  icon: '🛡️', color: '#4444cc', ids: [810,811,812, 813,814,815, 816,817,818] },
  paldea: { label: 'Starters de Paldea', icon: '🍊', color: '#ff4488', ids: [906,907,908, 909,910,911, 912,913,914] },
};

// ── Félicitations du Professeur (Pokédex régional complet) ────────────────────
const PROF_CONGRATS = [
  { region: 'kanto',  label: 'Félicitations du Prof. Chen',     icon: '🎓', color: '#ff5555', range: [1,   151] },
  { region: 'johto',  label: 'Félicitations du Prof. Elm',      icon: '🎓', color: '#ffd700', range: [152, 251] },
  { region: 'hoenn',  label: 'Félicitations du Prof. Sorbier',  icon: '🎓', color: '#55bb55', range: [252, 386] },
  { region: 'sinnoh', label: 'Félicitations du Prof. Sorbier',  icon: '🎓', color: '#4488ff', range: [387, 493] },
  { region: 'unys',   label: 'Félicitations du Prof. Aulne',    icon: '🎓', color: '#888888', range: [494, 649] },
  { region: 'kalos',  label: 'Félicitations du Prof. Platane',  icon: '🎓', color: '#aa44ff', range: [650, 721] },
  { region: 'alola',  label: 'Félicitations du Prof. Kukui',    icon: '🎓', color: '#ff8800', range: [722, 807] },
  { region: 'galar',  label: 'Félicitations du Prof. Magnolia', icon: '🎓', color: '#4444cc', range: [810, 898] },
  { region: 'paldea', label: 'Félicitations du Prof. Jacq',     icon: '🎓', color: '#ff4488', range: [906, 1025] },
];

// ── Stades de collection ──────────────────────────────────────────────────────
const MILESTONES = [
  { n: 30,   label: 'Apprenti Dresseur',   icon: '🌱', color: '#4ade80' },
  { n: 50,   label: 'Dresseur Confirmé',   icon: '⭐', color: '#22d3ee' },
  { n: 100,  label: 'Centurion',           icon: '💯', color: '#60a5fa' },
  { n: 150,  label: 'Expert de Kanto',     icon: '🔴', color: '#ff5555' },
  { n: 200,  label: 'Maître Régional',     icon: '🥈', color: '#94a3b8' },
  { n: 300,  label: 'Collecteur Sérieux',  icon: '💎', color: '#38bdf8' },
  { n: 400,  label: 'Vétéran',             icon: '🎖️', color: '#f59e0b' },
  { n: 500,  label: 'Demi-Chemin',         icon: '🏁', color: '#a78bfa' },
  { n: 600,  label: 'Grand Chasseur',      icon: '🦁', color: '#fb923c' },
  { n: 700,  label: 'Chasseur de Légende', icon: '⚡', color: '#facc15' },
  { n: 800,  label: 'Maître Pokémon',      icon: '🌟', color: '#e879f9' },
  { n: 900,  label: 'Quasi-Légendaire',    icon: '🔮', color: '#c084fc' },
  { n: 1000, label: 'Maître des Maîtres',  icon: '👑', color: '#fbbf24' },
  { n: 1025, label: 'Pokédex National Complet', icon: '🏆', color: '#ff375f' },
];

// ── Meta badges (par centaines) ───────────────────────────────────────────────
const META_BADGES = REGIONS.filter(r => !['meltan', 'hisui'].includes(r.id)).map(r => ({
  id:    `meta-${r.id}`,
  label: `Pokédex ${r.name} Complet`,
  icon:  '📖',
  color: '#ffd700',
  region: r.id,
  range:  r.range,
}));

// ── Export principal ──────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  // --- Stades ---
  ...MILESTONES.map(m => ({
    id:       `stade-${m.n}`,
    type:     'stade',
    label:    m.label,
    icon:     m.icon,
    color:    m.color,
    desc:     `${m.n} Pokémon capturés (rangés ou en main).`,
    target:   m.n,
    check:    col => countOwned(col) >= m.n,
    progress: col => ({ cur: Math.min(countOwned(col), m.n), max: m.n }),
  })),

  // --- Félicitations du Professeur ---
  ...PROF_CONGRATS.map(p => ({
    id:    `prof-${p.region}`,
    type:  'prof',
    label: p.label,
    icon:  p.icon,
    color: p.color,
    region: p.region,
    desc:  `Complète le Pokédex régional de ${p.label.replace('Félicitations du Prof. ', '').replace('Félicitations du Professeur ', '')} (toutes les espèces natives capturées).`,
    check: col => regionComplete(col, p.range),
    progress: col => {
      const ids = POKEMON_RAW.filter(([id]) => id >= p.range[0] && id <= p.range[1]);
      return { cur: ids.filter(([id]) => owned(col, id)).length, max: ids.length };
    },
  })),

  // --- Starters ---
  ...Object.entries(STARTERS).map(([region, s]) => ({
    id:     `starters-${region}`,
    type:   'starters',
    label:  s.label,
    icon:   s.icon,
    color:  s.color,
    region,
    desc:   `Capture toutes les évolutions des trois starters de ${s.label.replace('Starters de ', '').replace('Starters d\'', '')}.`,
    ids:    s.ids,
    check:  col => allOwned(col, s.ids),
    progress: col => ({ cur: s.ids.filter(id => owned(col, id)).length, max: s.ids.length }),
  })),

  // --- Champions d'arène par région ---
  ...['kanto','gs','rs','dp','bw','b2w2','xy','sm','swsh','sv'].map(region => ({
    id:    `gyms-${region}`,
    type:  'gyms',
    label: `Arènes de ${BADGES.find(b => b.region === region)?.city?.split('·')[0] || region.toUpperCase()}`,
    icon:  '🏅',
    color: BADGES.find(b => b.region === region)?.bc || '#888',
    region,
    desc:  `Décroche tous les badges des Champions d'Arène de la région.`,
    check: col => allGymsDone(col, region),
    progress: col => {
      const gyms = BADGES.filter(b => b.region === region && b.badgeName);
      return { cur: gyms.filter(b => badgeComplete(col, b.id)).length, max: gyms.length };
    },
  })),

  // --- Méta-badges Pokédex régional ---
  ...META_BADGES.map(m => ({
    id:     m.id,
    type:   'meta',
    label:  m.label,
    icon:   m.icon,
    color:  m.color,
    region: m.region,
    desc:   `Complète intégralement le Pokédex National pour la plage #${m.range[0]}–#${m.range[1]}.`,
    check:  col => regionComplete(col, m.range),
    progress: col => {
      const ids = POKEMON_RAW.filter(([id]) => id >= m.range[0] && id <= m.range[1]);
      return { cur: ids.filter(([id]) => owned(col, id)).length, max: ids.length };
    },
  })),

  // --- Grand Maître (toutes régions) ---
  {
    id:    'grand-maitre',
    type:  'special',
    label: 'Grand Maître Pokémon',
    icon:  '👑',
    color: '#ffd700',
    desc:  'Champion de toutes les régions principales.',
    check: col => ['kanto','gs','rs','dp','bw','b2w2','xy','sm','swsh','sv']
      .every(r => allGymsDone(col, r)),
    progress: col => {
      const regions = ['kanto','gs','rs','dp','bw','b2w2','xy','sm','swsh','sv'];
      return { cur: regions.filter(r => allGymsDone(col, r)).length, max: regions.length };
    },
  },

  // --- Dresseur Ultime ---
  {
    id:    'dresseur-ultime',
    type:  'special',
    label: 'Dresseur Ultime',
    icon:  '🌟',
    color: '#c0a0ff',
    desc:  'Tous les Pokémon du Pokédex National rangés ou en main.',
    check: col => POKEMON_RAW.every(([id]) => owned(col, id)),
    progress: col => ({ cur: countOwned(col), max: POKEMON_RAW.length }),
  },
];

// Accès rapide par ID
export const ACH_MAP = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));
