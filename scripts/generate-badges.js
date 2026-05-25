#!/usr/bin/env node
/**
 * generate-badges.js
 * Transforms file_imports/badge-battles.json → src/data/badges.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const raw = JSON.parse(readFileSync(resolve(ROOT, 'file_imports/badge-battles.json'), 'utf8'));

// ── Couleurs par région ──────────────────────────────────────────────────────
const REGION_COLORS = {
  kanto:  '#ff5555',
  johto:  '#ffd700',
  gs:     '#c8b400',
  hoenn:  '#55bb55',
  rs:     '#55bb55',
  sinnoh: '#4488ff',
  dp:     '#4488ff',
  unova:  '#888888',
  bw:     '#888888',
  b2w2:   '#666666',
  kalos:  '#aa44ff',
  xy:     '#aa44ff',
  alola:  '#ff8800',
  sm:     '#ff8800',
  galar:  '#4444cc',
  swsh:   '#4444cc',
  hisui:  '#8888cc',
  paldea: '#ff4488',
  sv:     '#ff4488',
};

// ── Noms de badges en français ───────────────────────────────────────────────
const BADGE_NAMES = {
  // Kanto (RB/Y/FRLG)
  kanto_brock:        'Badge Roc',
  kanto_misty:        'Badge Cascade',
  kanto_lt_surge:     'Badge Tonnerre',
  kanto_erika:        'Badge Arc-en-ciel',
  kanto_koga:         'Badge Âme',
  kanto_sabrina:      'Badge Marécage',
  kanto_blaine:       'Badge Volcan',
  kanto_giovanni:     'Badge Terre',
  kanto_lorelei:      null,
  kanto_bruno:        null,
  kanto_agatha:       null,
  kanto_lance:        null,
  kanto_rival_champion: null,
  // Johto (GSC)
  gs_falkner:         'Badge Plume',
  gs_bugsy:           'Badge Ruche',
  gs_whitney:         'Badge Plaine',
  gs_morty:           'Badge Brume',
  gs_chuck:           'Badge Tempête',
  gs_jasmine:         'Badge Minéral',
  gs_pryce:           'Badge Givre',
  gs_clair:           'Badge Montée',
  gs_brock:           null,
  gs_misty:           null,
  gs_lt_surge:        null,
  gs_erika:           null,
  gs_janine:          null,
  gs_sabrina:         null,
  gs_blaine:          null,
  gs_blue:            null,
  gs_will:            null,
  gs_koga:            null,
  gs_bruno:           null,
  gs_karen:           null,
  gs_lance:           null,
  gs_rival_silver:    null,
  // Hoenn (RS/ORAS)
  rs_roxanne:         'Badge Pierre',
  rs_brawly:          'Badge Poing',
  rs_wattson:         'Badge Dynamo',
  rs_flannery:        'Badge Chaleur',
  rs_norman:          'Badge Équilibre',
  rs_winona:          'Badge Plume',
  rs_tate_liza:       'Badge Esprit',
  rs_wallace:         'Badge Pluie',
  rs_sidney:          null,
  rs_phoebe:          null,
  rs_glacia:          null,
  rs_drake:           null,
  rs_steven:          null,
  rs_wally:           null,
  // Sinnoh (DP/BDSP)
  dp_roark:           'Badge Charbon',
  dp_gardenia:        'Badge Forêt',
  dp_maylene:         'Badge Pavé',
  dp_crasher_wake:    'Badge Palustre',
  dp_fantina:         'Badge Fantôme',
  dp_byron:           'Badge Mine',
  dp_candice:         'Badge Glaçon',
  dp_volkner:         'Badge Phare',
  dp_aaron:           null,
  dp_bertha:          null,
  dp_flint:           null,
  dp_lucian:          null,
  dp_cynthia:         null,
  dp_rival_barry:     null,
  // Unys (BW)
  bw_trio_badge:      'Badge Triple',
  bw_lenora:          'Badge Basique',
  bw_burgh:           'Badge Élytre',
  bw_elesa:           'Badge Volt',
  bw_clay:            'Badge Sismique',
  bw_skyla:           'Badge Jet',
  bw_brycen:          'Badge Stalactite',
  bw_opelucid:        'Badge Mythe',
  bw_shauntal:        null,
  bw_grimsley:        null,
  bw_caitlin:         null,
  bw_marshal:         null,
  bw_alder:           null,
  bw_ghetsis:         null,
  bw_n:               null,
  // Unys (B2W2)
  b2w2_cheren:        'Badge Basique',
  b2w2_roxie:         'Badge Toxique',
  b2w2_burgh:         'Badge Élytre',
  b2w2_elesa:         'Badge Volt',
  b2w2_clay:          'Badge Sismique',
  b2w2_skyla:         'Badge Jet',
  b2w2_drayden:       'Badge Mythe',
  b2w2_marlon:        'Badge Vague',
  b2w2_shauntal:      null,
  b2w2_grimsley:      null,
  b2w2_caitlin:       null,
  b2w2_marshal:       null,
  b2w2_iris:          null,
  b2w2_hugh:          null,
  // Kalos (XY)
  xy_viola:           'Badge Insecte',
  xy_grant:           'Badge Falaise',
  xy_korrina:         'Badge Lutte',
  xy_ramos:           'Badge Végétal',
  xy_clemont:         'Badge Tension',
  xy_valerie:         'Badge Nymphe',
  xy_olympia:         'Badge Psychisme',
  xy_wulfric:         'Badge Glacier',
  xy_wikstrom:        null,
  xy_malva:           null,
  xy_drasna:          null,
  xy_siebold:         null,
  xy_diantha:         null,
  xy_rival:           null,
  // Alola (SM)
  sm_hala:            'Pectorium-Z',
  sm_olivia:          'Terrazélite',
  sm_nanu:            'Ténébrozélite',
  sm_hapu:            'Lougarozélite',
  sm_ilima:           'Normalium-Z',
  sm_lana:            'Aquazélite',
  sm_kiawe:           'Pyrozélite',
  sm_mallow:          'Florazélite',
  sm_mina:            'Nymphézélite',
  sm_elite_hala:      null,
  sm_elite_olivia:    null,
  sm_acerola:         null,
  sm_kahili:          null,
  sm_kukui:           null,
  sm_gladion:         null,
  sm_hau:             null,
  // Galar (SWSH)
  swsh_milo:          'Badge Plante',
  swsh_nessa:         'Badge Eau',
  swsh_kabu:          'Badge Feu',
  swsh_opal:          'Badge Fée',
  swsh_piers:         'Badge Ténèbres',
  swsh_raihan:        'Badge Dragon',
  swsh_bea:           'Badge Combat',
  swsh_allister:      'Badge Spectre',
  swsh_gordie:        'Badge Roche',
  swsh_melony:        'Badge Glace',
  swsh_bede:          null,
  swsh_marnie:        null,
  swsh_leon:          null,
  swsh_hop:           null,
  // Paldea (SV)
  sv_katy:            'Badge Insecte',
  sv_brassius:        'Badge Plante',
  sv_iono:            'Badge Électrik',
  sv_kofu:            'Badge Eau',
  sv_larry:           'Badge Normal',
  sv_ryme:            'Badge Spectre',
  sv_tulip:           'Badge Psy',
  sv_grusha:          'Badge Glace',
  sv_rika:            null,
  sv_poppy:           null,
  sv_elite_larry:     null,
  sv_hassel:          null,
  sv_geeta:           null,
  sv_nemona:          null,
  sv_arven:           null,
  sv_penny:           null,
};

// ── Rôles en français ────────────────────────────────────────────────────────
const ROLE_FR = {
  'Gym Leader':       'Champion d\'Arène',
  'Elite Four':       'Conseil des Quatre',
  'Champion':         'Maître de la Ligue',
  'Island Kahuna':    'Kahuna',
  'Trial Captain':    'Capitaine',
  'Rival':            'Rival',
};

function normaliseRole(raw) {
  return ROLE_FR[raw] || raw;
}

// Extract numeric pokemon ID from slug like "0074-geodude" -> 74
function slugToId(slug) {
  const match = slug.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

const badges = [];

for (const [key, data] of Object.entries(raw.badges)) {
  const region = data.location?.region || 'unknown';
  const nameFr = data.trainer?.name?.fr || key;
  const roleFr = normaliseRole(data.trainer?.role?.fr || data.trainer?.role?.en || '');
  const historyFr = data.trainer?.history?.fr || data.trainer?.history?.en || '';
  const cityFr = data.location?.city?.fr || data.location?.city?.en || '';
  const placeFr = data.location?.place?.fr || data.location?.place?.en || '';
  const badgeName = BADGE_NAMES[key] ?? null;

  const encounters = (data.encounters || []).map(enc => {
    const team = (enc.team || []).map(member => {
      const id = slugToId(member.slug);
      const moves = (member.moves || []).map(m => m.fr || m.en || '');
      return { id, level: member.level || 0, moves };
    }).filter(m => m.id !== null);

    return {
      id: enc.id,
      label: enc.label?.fr || enc.label?.en || '',
      games: enc.games || [],
      team,
    };
  });

  badges.push({
    id: key,
    name: nameFr,
    role: roleFr,
    badgeName,
    region,
    city: cityFr,
    place: placeFr,
    history: historyFr,
    bc: REGION_COLORS[region] || '#888888',
    encounters,
  });
}

const lines = [
  '// Auto-generated from file_imports/badge-battles.json',
  '// Do not edit manually – run scripts/generate-badges.js to regenerate',
  '',
  'export const BADGES = ' + JSON.stringify(badges, null, 2) + ';',
  '',
];

const outPath = resolve(ROOT, 'src/data/badges.js');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`✅ Generated ${badges.length} badges → src/data/badges.js`);
