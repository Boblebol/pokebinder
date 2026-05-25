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

export const TYPE_CHART = {
  normal: { fighting: 2, ghost: 0 },
  fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, ground: 2, rock: 2, bug: 0.5, steel: 0.5, fairy: 0.5 },
  water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 },
  grass: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, poison: 2, ground: 0.5, flying: 2, bug: 2 },
  electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, bug: 0.5, rock: 0.5, dark: 0.5, fairy: 2 },
  poison: { grass: 0.5, fighting: 0.5, poison: 0.5, ground: 2, psychic: 2, bug: 0.5, fairy: 0.5 },
  ground: { water: 2, grass: 2, electric: 0, ice: 2, poison: 0.5, rock: 0.5 },
  flying: { grass: 0.5, electric: 2, fighting: 0.5, ground: 0, ice: 2, bug: 0.5, rock: 2 },
  psychic: { fighting: 0.5, psychic: 0.5, bug: 2, ghost: 2, dark: 2 },
  bug: { fire: 2, grass: 0.5, fighting: 0.5, ground: 0.5, flying: 2, rock: 2 },
  rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, steel: 2 },
  ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
  dragon: { fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, dragon: 2, fairy: 2 },
  dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
  steel: { normal: 0.5, fire: 2, grass: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
  fairy: { fighting: 0.5, poison: 2, dragon: 0, bug: 0.5, steel: 2, dark: 0.5 }
};

export function getTypeEffectiveness(types) {
  const effectiveness = {};
  const allTypes = Object.keys(TYPE_CHART);
  
  allTypes.forEach(atk => {
    let mult = 1;
    types.forEach(def => {
      const defChart = TYPE_CHART[def];
      if (defChart && defChart[atk] !== undefined) {
        mult *= defChart[atk];
      }
    });
    effectiveness[atk] = mult;
  });
  
  const weaknesses = [];
  const resistances = [];
  
  Object.entries(effectiveness).forEach(([type, mult]) => {
    if (mult > 1) {
      weaknesses.push({ type, mult });
    } else if (mult < 1) {
      resistances.push({ type, mult });
    }
  });
  
  return { weaknesses, resistances };
}

