import { POKEMON_RAW } from './pokemon.js';
import { EVOLUTIONS_RAW } from './evolutions.js';

export { REGIONS } from './regions.js';
export { POKEMON_RAW } from './pokemon.js';
export { EVOLUTIONS_RAW } from './evolutions.js';
export { STATS } from './stats.js';
export { PDEX } from './pokedexEntries.js';
export { TRAINERS } from './trainers.js';
export { ACHIEVEMENTS } from './achievements.js';
export { TYPE_COLORS, TYPE_LABELS, TYPE_WEAKNESSES, STATUS_CONFIG, getTypeEffectiveness } from './types.js';
export { POKEMON_FORMS } from './pokemonForms.js';
export { PKM_DETAILS } from './pokemonDetails.js';
export { GAME_POKEDEXES } from './gamePokedexes.js';
export { BADGES } from './badges.js';


// Build the evolution lookup map
export const evoMap = {};
EVOLUTIONS_RAW.forEach(c => c.forEach(id => {
  if (!evoMap[id]) evoMap[id] = c;
}));

// Build the structured Pokémon object map
export const PKM = {};
POKEMON_RAW.forEach(([id, nm, t1, t2]) => {
  PKM[id] = {
    id,
    nm,
    name: nm,
    types: t2 ? [t1, t2] : [t1],
    evoChain: evoMap[id] || [id]
  };
});

// Flat list of Pokémon objects
export const PLIST = POKEMON_RAW.map(([id]) => PKM[id]);

export const INITCOL = {};
POKEMON_RAW.forEach(([id]) => {
  INITCOL[id] = null;
});

// Binder grid configuration defaults
export const BCFG = {
  gridRows: 3,
  gridCols: 3,
  pagesPerBinder: 11,
  mode: 'by-region',
  familyRule: true
};
