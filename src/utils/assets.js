const BADGE_IMAGE_MAP = {
  // Kanto
  'badge roc': 'https://archives.bulbagarden.net/media/upload/d/dd/Boulder_Badge.png',
  'badge cascade': 'https://archives.bulbagarden.net/media/upload/9/9c/Cascade_Badge.png',
  'badge tonnerre': 'https://archives.bulbagarden.net/media/upload/a/a6/Thunder_Badge.png',
  'badge arc-en-ciel': 'https://archives.bulbagarden.net/media/upload/b/b5/Rainbow_Badge.png',
  'badge ame': 'https://archives.bulbagarden.net/media/upload/7/7d/Soul_Badge.png',
  'badge marecage': 'https://archives.bulbagarden.net/media/upload/6/6b/Marsh_Badge.png',
  'badge volcan': 'https://archives.bulbagarden.net/media/upload/1/12/Volcano_Badge.png',
  'badge terre': 'https://archives.bulbagarden.net/media/upload/7/78/Earth_Badge.png',

  // Johto
  'badge zephyr': 'https://archives.bulbagarden.net/media/upload/b/bc/Zephyr_Badge.png',
  'badge ruche': 'https://archives.bulbagarden.net/media/upload/3/36/Hive_Badge.png',
  'badge plaine': 'https://archives.bulbagarden.net/media/upload/c/c0/Plain_Badge.png',
  'badge brume': 'https://archives.bulbagarden.net/media/upload/a/a5/Fog_Badge.png',
  'badge tempete': 'https://archives.bulbagarden.net/media/upload/4/48/Storm_Badge.png',
  'badge mineral': 'https://archives.bulbagarden.net/media/upload/4/4c/Mineral_Badge.png',
  'badge givre': 'https://archives.bulbagarden.net/media/upload/e/e6/Glacier_Badge.png',
  'badge montee': 'https://archives.bulbagarden.net/media/upload/5/58/Rising_Badge.png',

  // Hoenn
  'badge pierre': 'https://archives.bulbagarden.net/media/upload/6/63/Stone_Badge.png',
  'badge poing': 'https://archives.bulbagarden.net/media/upload/9/97/Knuckle_Badge.png',
  'badge dynamo': 'https://archives.bulbagarden.net/media/upload/3/35/Dynamo_Badge.png',
  'badge chaleur': 'https://archives.bulbagarden.net/media/upload/b/b4/Heat_Badge.png',
  'badge equilibre': 'https://archives.bulbagarden.net/media/upload/e/e4/Balance_Badge.png',
  'badge plume': 'https://archives.bulbagarden.net/media/upload/6/62/Feather_Badge.png',
  'badge esprit': 'https://archives.bulbagarden.net/media/upload/c/cc/Mind_Badge.png',
  'badge pluie': 'https://archives.bulbagarden.net/media/upload/7/77/Rain_Badge.png',

  // Sinnoh
  'badge charbon': 'https://archives.bulbagarden.net/media/upload/4/4a/Coal_Badge.png',
  'badge foret': 'https://archives.bulbagarden.net/media/upload/e/e9/Forest_Badge.png',
  'badge pave': 'https://archives.bulbagarden.net/media/upload/9/9b/Cobble_Badge.png',
  'badge palustre': 'https://archives.bulbagarden.net/media/upload/1/1d/Fen_Badge.png',
  'badge fantome': 'https://archives.bulbagarden.net/media/upload/0/0b/Relic_Badge.png',
  'badge mine': 'https://archives.bulbagarden.net/media/upload/1/12/Mine_Badge.png',
  'badge glacon': 'https://archives.bulbagarden.net/media/upload/c/c5/Icicle_Badge.png',
  'badge phare': 'https://archives.bulbagarden.net/media/upload/6/63/Beacon_Badge.png',

  // Unova
  'badge triple': 'https://archives.bulbagarden.net/media/upload/8/87/Trio_Badge.png',
  'badge basique': 'https://archives.bulbagarden.net/media/upload/a/a2/Basic_Badge.png',
  'badge toxique': 'https://archives.bulbagarden.net/media/upload/4/41/Toxic_Badge.png',
  'badge elytre': 'https://archives.bulbagarden.net/media/upload/7/72/Insect_Badge.png',
  'badge volt': 'https://archives.bulbagarden.net/media/upload/0/00/Bolt_Badge.png',
  'badge sismique': 'https://archives.bulbagarden.net/media/upload/8/85/Quake_Badge.png',
  'badge jet': 'https://archives.bulbagarden.net/media/upload/8/8a/Jet_Badge.png',
  'badge cryo': 'https://archives.bulbagarden.net/media/upload/7/7f/Freeze_Badge.png',
  'badge mythe': 'https://archives.bulbagarden.net/media/upload/c/c5/Legend_Badge.png',
  'badge vague': 'https://archives.bulbagarden.net/media/upload/4/4e/Wave_Badge.png',

  // Kalos
  'badge coleoptere': 'https://archives.bulbagarden.net/media/upload/7/74/Bug_Badge.png',
  'badge mur': 'https://archives.bulbagarden.net/media/upload/d/d4/Cliff_Badge.png',
  'badge combat': 'https://archives.bulbagarden.net/media/upload/2/23/Rumble_Badge.png',
  'badge vegetal': 'https://archives.bulbagarden.net/media/upload/0/0b/Plant_Badge.png',
  'badge tension': 'https://archives.bulbagarden.net/media/upload/f/fa/Voltage_Badge.png',
  'badge nymphe': 'https://archives.bulbagarden.net/media/upload/8/8e/Fairy_Badge.png',
  'badge psychique': 'https://archives.bulbagarden.net/media/upload/e/eb/Psychic_Badge.png',
  'badge iceberg': 'https://archives.bulbagarden.net/media/upload/6/63/Iceberg_Badge.png',

  // Alola (Z-Crystals)
  'pectorium-z': 'https://archives.bulbagarden.net/media/upload/2/26/Fightinium_Z.png',
  'rocazelite': 'https://archives.bulbagarden.net/media/upload/9/90/Rockium_Z.png',
  'tenebrozelite': 'https://archives.bulbagarden.net/media/upload/6/66/Darkium_Z.png',
  'terrazelite': 'https://archives.bulbagarden.net/media/upload/d/db/Groundium_Z.png',
  'alolazelite': 'https://archives.bulbagarden.net/media/upload/b/bd/Alolachium_Z.png',

  // Galar
  'badge plante': 'https://archives.bulbagarden.net/media/upload/a/ab/Grass_Badge.png',
  'badge eau': 'https://archives.bulbagarden.net/media/upload/f/fd/Water_Badge.png',
  'badge feu': 'https://archives.bulbagarden.net/media/upload/a/ab/Fire_Badge.png',
  'badge fee': 'https://archives.bulbagarden.net/media/upload/0/00/Fairy_Badge_VIII.png',
  'badge roche': 'https://archives.bulbagarden.net/media/upload/0/06/Rock_Badge.png',
  'badge glace': 'https://archives.bulbagarden.net/media/upload/1/1a/Ice_Badge.png',
  'badge tenebres': 'https://archives.bulbagarden.net/media/upload/f/fa/Dark_Badge.png',
  'badge dragon': 'https://archives.bulbagarden.net/media/upload/3/36/Dragon_Badge.png',

  // Paldea
  'badge insecte': 'https://archives.bulbagarden.net/media/upload/c/c5/Bug_Badge_SV.png',
  'badge electrik': 'https://archives.bulbagarden.net/media/upload/5/5b/Electric_Badge_SV.png',
  'badge normal': 'https://archives.bulbagarden.net/media/upload/5/52/Normal_Badge_SV.png',
  'badge psy': 'https://archives.bulbagarden.net/media/upload/4/45/Psychic_Badge_SV.png',
  'badge spectre': 'https://archives.bulbagarden.net/media/upload/e/ee/Ghost_Badge_SV.png',
  'badge glace': 'https://archives.bulbagarden.net/media/upload/4/4a/Ice_Badge_SV.png'
};

const TRAINER_NAME_MAP = {
  // Gym Leaders & Elite Four (French to Showdown)
  'pierre': 'brock',
  'ondine': 'misty',
  'major bob': 'ltsurge',
  'erika': 'erika',
  'koga': 'koga',
  'morgane': 'sabrina',
  'auguste': 'blaine',
  'giovanni': 'giovanni',
  'albert': 'falkner',
  'hector': 'bugsy',
  'blanche': 'whitney',
  'mortimer': 'morty',
  'chuck': 'chuck',
  'jasmine': 'jasmine',
  'fredo': 'pryce',
  'sandra': 'clair',
  'roxanne': 'roxanne',
  'bastien': 'brawly',
  'voltere': 'wattson',
  'adriane': 'flannery',
  'norman': 'norman',
  'alizee': 'winona',
  'levy': 'tate',
  'tatia': 'liza',
  'levy & tatia': 'tateliza',
  'marc': 'wallace',
  'juan': 'juan',
  'pierrick': 'roark',
  'gardenia': 'gardenia',
  'melina': 'maylene',
  'lovelas': 'crasherwake',
  'crasher wake': 'crasherwake',
  'kimera': 'fantina',
  'charles': 'byron',
  'gladys': 'candice',
  'tanguy': 'volkner',
  'rachid': 'cilan',
  'noa': 'chili',
  'armand': 'cress',
  'aloe': 'lenora',
  'aloe': 'lenora',
  'artie': 'burgh',
  'inika': 'elesa',
  'bardane': 'clay',
  'carolina': 'skyla',
  'zhu': 'brycen',
  'iris': 'iris',
  'aurelia': 'roxie',
  'rodrigue': 'marlon',
  'violette': 'viola',
  'lino': 'grant',
  'cornelia': 'korrina',
  'ramos': 'ramos',
  'valeriane': 'valerie',
  'olympe': 'olympia',
  'udonis': 'wulfric',
  'percy': 'milo',
  'chaz': 'gordie',
  'lona': 'melony',
  'faiza': 'bea',
  'spectval': 'allister',
  'dany': 'piers',
  'roy': 'raihan',
  'erable': 'brassius',
  'machin': 'kofu',
  'mashynn': 'iono',
  'okuba': 'larry',
  'rimba': 'ryme',
  'tulipe': 'tulip',
  'cayenne': 'rika',
  'cayenn': 'rika',
  'mora': 'poppy',
  'hassa': 'hassel',
  'meliss': 'geeta',
  
  // Elite Four & Champions
  'olga': 'lorelei',
  'lorelei': 'lorelei',
  'bruno': 'bruno',
  'agatha': 'agatha',
  'lance': 'lance',
  'clement': 'will',
  'marion': 'karen',
  'damien': 'sidney',
  'spectra': 'phoebe',
  'glacia': 'glacia',
  'aragon': 'drake',
  'pierre rochard': 'steven',
  'cynthia': 'cynthia',
  'guy': 'alder',
  'alder': 'alder',
  'sheena': 'caitlin',
  'chante': 'marshal',
  'anis': 'shauntal',
  'pieris': 'grimsley',
  'diantha': 'diantha',
  'sannah': 'shauna',
  'tierno': 'tierno',
  'trova': 'trevor',
  'maitre de la ligue': 'blue',
  'rival': 'blue',

  // Professors
  'chen': 'oak',
  'professeur chen': 'oak',
  'orme': 'elm',
  'professeur orme': 'elm',
  'seko': 'birch',
  'professeur seko': 'birch',
  'sorbier': 'rowan',
  'professeur sorbier': 'rowan',
  'keteleeria': 'juniper',
  'professeur keteleeria': 'juniper',
  'platane': 'sycamore',
  'professeur platane': 'sycamore',
  'kukui': 'kukui',
  'professeur kukui': 'kukui',
  'pimprenelle': 'burnet',
  'magnolia': 'magnolia',
  'sonia': 'sonia',
  'sada': 'sada',
  'turo': 'turo',
  'professeur sada': 'sada',
  'professeur turo': 'turo',

  // Extra mappings for Elite Four, Champions & Rivals (French/English to Showdown)
  'blue': 'blue',
  'silver': 'silver',
  'hugh': 'hugh',
  'matis': 'hugh',
  'hop': 'hop',
  'nabil': 'hop',
  'calem': 'calem',
  'serena': 'serena',
  'nemona': 'nemona',
  'menzi': 'nemona',
  'arven': 'arven',
  'pepper': 'arven',
  'penny': 'penny',
  'pania': 'penny',
  'aaron': 'aaron',
  'terry': 'bertha',
  'bertha': 'bertha',
  'adrien': 'flint',
  'flint': 'flint',
  'lucio': 'lucian',
  'lucian': 'lucian',
  'thierry': 'wikstrom',
  'wikstrom': 'wikstrom',
  'malva': 'malva',
  'dracena': 'drasna',
  'drasna': 'drasna',
  'narcisse': 'siebold',
  'siebold': 'siebold',
  'pectorius': 'hala',
  'hala': 'hala',
  'alyxia': 'olivia',
  'olivia': 'olivia',
  'margie': 'acerola',
  'acerola': 'acerola',
  'kahili': 'kahili',
  'travis': 'bede',
  'bede': 'bede',
  'rosemary': 'marnie',
  'marnie': 'marnie',
  'tarak': 'leon',
  'leon': 'leon',
  'cayenne': 'rika',
  'rika': 'rika',
  'mora': 'poppy',
  'poppy': 'poppy',
  'okuba': 'larry',
  'larry': 'larry',
  'hassa': 'hassel',
  'hassel': 'hassel',
  'meliss': 'geeta',
  'geeta': 'geeta',
  'tili': 'hau',
  'hau': 'hau',
  'timmy': 'wally',
  'wally': 'wally',
  'dianthea': 'diantha'
};

// Maps regional completion achievements to their respective professor keys
export const PROFESSOR_MAP = {
  'champ-kanto': 'oak',
  'champ-johto': 'elm',
  'champ-rs': 'birch',
  'champ-dp': 'rowan',
  'champ-bw': 'juniper',
  'champ-b2w2': 'juniper',
  'champ-xy': 'sycamore',
  'champ-sm': 'kukui',
  'champ-swsh': 'sonia',
  'champ-sv': 'sada'
};

// Remove accents and normalize strings for matching
const normalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export function getBadgeImageUrl(badgeName) {
  if (!badgeName) return null;
  const key = normalize(badgeName);
  return BADGE_IMAGE_MAP[key] || null;
}

export function getTrainerAvatarUrl(trainerName, id = null) {
  if (!trainerName && !id) return null;
  let key = normalize(trainerName);

  // If the trainer name is generic (like "Conseil 4", "Maitre de la Ligue", "Rival"), resolve using the ID
  if (key === 'conseil 4' || key === 'maitre de la ligue' || key === 'rival' || !key) {
    if (id) {
      const parts = id.toLowerCase().split('_');
      const lastPart = parts[parts.length - 1];
      if (lastPart === 'champion' && parts.includes('rival')) {
        key = 'blue';
      } else if (lastPart === 'hala' && parts.includes('elite')) {
        key = 'hala';
      } else if (lastPart === 'olivia' && parts.includes('elite')) {
        key = 'olivia';
      } else if (lastPart === 'larry' && parts.includes('elite')) {
        key = 'larry';
      } else {
        key = lastPart;
      }
    }
  }

  const mapped = TRAINER_NAME_MAP[key];
  if (mapped) {
    return `https://play.pokemonshowdown.com/sprites/trainers/${mapped}.png`;
  }

  // Clean name fallback attempt
  const fallback = key.replace(/[^a-z0-9]/g, '');
  return `https://play.pokemonshowdown.com/sprites/trainers/${fallback}.png`;
}

