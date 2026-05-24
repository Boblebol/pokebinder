export const TYPE_COLORS = {
  normal: '#a8a878',
  fire: '#ff6b35',
  water: '#4cc9f0',
  grass: '#38b000',
  electric: '#ffd60a',
  ice: '#7ecef0',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#c8a440',
  flying: '#a890f0',
  psychic: '#f72585',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#6038f8',
  steel: '#b8b8d0',
  fairy: '#ff85a1',
  dark: '#5a3e28'
};

export const TYPE_LABELS = {
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Électrik',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  steel: 'Acier',
  fairy: 'Fée',
  dark: 'Ténèbres'
};

export const TYPE_WEAKNESSES = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  electric: ['ground'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel']
};

export const STATUS_CONFIG = {
  'rangé': { color: '#22c55e', label: 'Rangé', icon: '✓' },
  'en main': { color: '#f59e0b', label: 'En main', icon: '✋' },
  'manquant': { color: 'rgba(255,255,255,.2)', label: 'Manquant', icon: '○' },
  // Handle absolute null/undefined as well
  null: { color: 'rgba(255,255,255,.2)', label: 'Manquant', icon: '○' },
  undefined: { color: 'rgba(255,255,255,.2)', label: 'Manquant', icon: '○' }
};

