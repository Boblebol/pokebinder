import { POKEMON_RAW } from './pokemon.js';
import { EVOLUTIONS_RAW } from './evolutions.js';

export { REGIONS } from './regions.js';
export { POKEMON_RAW } from './pokemon.js';
export { EVOLUTIONS_RAW } from './evolutions.js';
export { STATS } from './stats.js';
export { PDEX } from './pokedexEntries.js';
export { TRAINERS } from './trainers.js';
export { ACHIEVEMENTS } from './achievements.js';
export { TYPE_COLORS, TYPE_LABELS, TYPE_WEAKNESSES, STATUS_CONFIG } from './types.js';
export { POKEMON_FORMS } from './pokemonForms.js';


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

// Starter dataset defaults (Rangé / En main / Manquant)
const RANGIDS = new Set([
  1, 2, 3, 4, 7, 9, 12, 16, 17, 18, 19, 25, 26, 27, 35, 37, 39, 41, 45, 52, 58, 59, 60, 62, 63, 65, 74, 76, 79, 81, 83, 88, 94, 95, 100, 104, 106, 107, 112, 113, 120, 121, 129, 130, 133, 134, 135, 136, 143, 145, 146, 150, 151
]);
const MIDS = new Set([
  5, 8, 11, 23, 28, 33, 43, 64, 69, 72, 75, 80, 82, 92, 98, 102, 111, 117, 147, 148, 149
]);

export const INITCOL = {};
POKEMON_RAW.forEach(([id]) => {
  INITCOL[id] = RANGIDS.has(id) ? 'rangé' : MIDS.has(id) ? 'en main' : null;
});

// Binder grid configuration defaults
export const BCFG = {
  gridRows: 3,
  gridCols: 3,
  pagesPerBinder: 10,
  mode: 'by-region',
  familyRule: true
};
