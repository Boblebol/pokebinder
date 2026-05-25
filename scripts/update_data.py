# /// script
# dependencies = [
#   "typer",
#   "pydantic>=2.0",
#   "httpx",
#   "tqdm",
# ]
# ///

import os
import re
import ast
import json
import asyncio
from typing import List, Dict, Optional, Union
import typer
from pydantic import BaseModel, Field
import httpx

app = typer.Typer(help="PokéClasseur Data Update CLI")

# --- Type Translations & Colors ---
TYPE_MAP = {
    "Normal": "normal",
    "Feu": "fire",
    "Eau": "water",
    "Plante": "grass",
    "Électrik": "electric",
    "Électrique": "electric",
    "Glace": "ice",
    "Combat": "fighting",
    "Poison": "poison",
    "Sol": "ground",
    "Vol": "flying",
    "Psy": "psychic",
    "Insecte": "bug",
    "Roche": "rock",
    "Spectre": "ghost",
    "Dragon": "dragon",
    "Acier": "steel",
    "Fée": "fairy",
    "Ténèbres": "dark"
}

TYPE_COLORS = {
    "normal": "#a8a878",
    "fire": "#ff6b35",
    "water": "#4cc9f0",
    "grass": "#38b000",
    "electric": "#ffd60a",
    "ice": "#7ecef0",
    "fighting": "#c03028",
    "poison": "#a040a0",
    "ground": "#c8a440",
    "flying": "#a890f0",
    "psychic": "#f72585",
    "bug": "#a8b820",
    "rock": "#b8a038",
    "ghost": "#705898",
    "dragon": "#6038f8",
    "steel": "#b8b8d0",
    "fairy": "#ff85a1",
    "dark": "#5a3e28"
}

VERSION_MAP = {
    "black": "Noir",
    "white": "Blanc",
    "x": "X",
    "y": "Y",
    "omega-ruby": "Rubis Oméga",
    "alpha-sapphire": "Saphir Alpha",
    "lets-go-pikachu": "Let's Go Pikachu",
    "lets-go-eevee": "Let's Go Évoli",
    "sword": "Épée",
    "shield": "Bouclier",
    "sun": "Soleil",
    "moon": "Lune",
    "ultra-sun": "Ultra-Soleil",
    "ultra-moon": "Ultra-Lune",
    "diamond": "Diamant",
    "pearl": "Perle",
    "platinum": "Platine",
    "heartgold": "HeartGold",
    "soulsilver": "SoulSilver",
    "black-2": "Noir 2",
    "white-2": "Blanc 2",
    "scarlet": "Écarlate",
    "violet": "Violet",
    "legends-arceus": "Légendes Arceus"
}

BADGE_MAP = {
    # Kanto
    "kanto_brock": "Roc",
    "kanto_misty": "Cascade",
    "kanto_lt_surge": "Tonnerre",
    "kanto_erika": "Arc-en-ciel",
    "kanto_koga": "Âme",
    "kanto_sabrina": "Marécage",
    "kanto_blaine": "Volcan",
    "kanto_giovanni": "Terre",
    # Johto
    "gs_falkner": "Envol",
    "gs_bugsy": "Ruche",
    "gs_whitney": "Plaine",
    "gs_morty": "Brume",
    "gs_chuck": "Tempête",
    "gs_jasmine": "Minéral",
    "gs_pryce": "Givre",
    "gs_clair": "Montée",
    # Hoenn
    "rs_roxanne": "Pierre",
    "rs_brawly": "Poing",
    "rs_wattson": "Dynamo",
    "rs_flannery": "Chaleur",
    "rs_norman": "Équilibre",
    "rs_winona": "Plume",
    "rs_tate_liza": "Esprit",
    "rs_wallace": "Pluie",
    # Sinnoh
    "dp_roark": "Charbon",
    "dp_gardenia": "Forêt",
    "dp_maylene": "Pavé",
    "dp_crasher_wake": "Palustre",
    "dp_fantina": "Fantôme",
    "dp_byron": "Mine",
    "dp_candice": "Glaçon",
    "dp_volkner": "Phare",
    # Unys
    "bw_trio_badge": "Triple",
    "bw_lenora": "Basique",
    "bw_burgh": "Élytre",
    "bw_elesa": "Volt",
    "bw_clay": "Sismique",
    "bw_skyla": "Jet",
    "bw_brycen": "Stalactite",
    "bw_opelucid": "Mythe",
    "b2w2_cheren": "Basique",
    "b2w2_roxie": "Toxique",
    "b2w2_drayden": "Mythe",
    "b2w2_marlon": "Vague",
    # Kalos
    "xy_viola": "Insecte",
    "xy_grant": "Mur",
    "xy_korrina": "Lutte",
    "xy_ramos": "Végétal",
    "xy_clemont": "Tension",
    "xy_valerie": "Nymphe",
    "xy_olympia": "Psychisme",
    "xy_wulfric": "Glacier",
    # Alola
    "sm_hala": "Pectorium-Z",
    "sm_olivia": "Lougarozélite",
    "sm_nanu": "Ténébrozélite",
    "sm_hapu": "Terrazélite",
    "sm_ilima": "Normalium-Z",
    "sm_lana": "Aquazélite",
    "sm_kiawe": "Pyrozélite",
    "sm_mallow": "Florazélite",
    "sm_mina": "Nymphézélite",
    # Galar
    "swsh_milo": "Plante",
    "swsh_nessa": "Eau",
    "swsh_kabu": "Feu",
    "swsh_bea": "Combat",
    "swsh_allister": "Spectre",
    "swsh_opal": "Fée",
    "swsh_gordie": "Roche",
    "swsh_melony": "Glace",
    "swsh_piers": "Ténèbres",
    "swsh_raihan": "Dragon",
    # Paldea
    "sv_katy": "Insecte",
    "sv_brassius": "Plante",
    "sv_iono": "Électrik",
    "sv_kofu": "Eau",
    "sv_larry": "Normal",
    "sv_ryme": "Spectre",
    "sv_tulip": "Psy",
    "sv_grusha": "Glace"
}

# --- Pydantic Inputs (Consolidated Bundle) ---
class RegionMeta(BaseModel):
    id: str
    label_fr: str
    low: int
    high: int

class PokedexMeta(BaseModel):
    total: int
    regions: List[RegionMeta]

class DescriptionEntry(BaseModel):
    version: str
    text: str

class PokemonEntry(BaseModel):
    number: str
    slug: str
    names: Dict[str, str]
    types: List[str]
    form: Optional[str] = None
    image: str
    region: str
    region_dex: str
    region_label_fr: str
    region_native: bool
    descriptions: List[DescriptionEntry] = Field(default_factory=list)

class PokedexInput(BaseModel):
    meta: PokedexMeta
    pokemon: List[PokemonEntry]

class EvolutionFamily(BaseModel):
    id: str
    label_fr: str
    root_slug: str
    members: List[str]
    layout_rows: List[List[Optional[str]]]
    sort_key: int
    source_chain_id: int

class EvolutionFamiliesInput(BaseModel):
    version: Optional[Union[str, int]] = None
    families: List[EvolutionFamily]

class TrainerName(BaseModel):
    fr: str
    en: str

class TrainerRole(BaseModel):
    fr: str
    en: str

class TrainerHistory(BaseModel):
    fr: str
    en: str

class TrainerDetail(BaseModel):
    name: TrainerName
    role: TrainerRole
    history: TrainerHistory

class LocationCity(BaseModel):
    fr: str
    en: str

class LocationPlace(BaseModel):
    fr: str
    en: str

class TrainerLocation(BaseModel):
    region: str
    city: LocationCity
    place: LocationPlace

class EncounterMove(BaseModel):
    fr: str
    en: str

class EncounterTeamMember(BaseModel):
    slug: str
    level: int
    moves: List[EncounterMove]

class TrainerEncounter(BaseModel):
    id: str
    label: Dict[str, str]
    games: List[str]
    team: List[EncounterTeamMember]

class BadgeEntry(BaseModel):
    trainer: TrainerDetail
    location: TrainerLocation
    encounters: List[TrainerEncounter]

class BadgesInput(BaseModel):
    version: Optional[Union[str, int]] = None
    badges: Dict[str, BadgeEntry]

class ConsolidatedBundle(BaseModel):
    version: Optional[Union[str, int]] = None
    metadata: Dict[str, str]
    pokedex: PokedexInput
    badges: BadgesInput
    evolution_families: EvolutionFamiliesInput


# --- Helpers for JS Parsing ---
def load_existing_js(file_path: str, var_name: str):
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.search(rf"export\s+const\s+{var_name}\s*=\s*(.*?);", content, re.DOTALL)
        if not match:
            return None
        raw_val = match.group(1).strip()
        raw_val = re.sub(r"//.*", "", raw_val)
        raw_val = raw_val.replace("null", "None")
        raw_val = raw_val.replace("true", "True")
        raw_val = raw_val.replace("false", "False")
        
        # Robust JS-to-Python converter: match strings or keys
        pattern = r'(\"(?:\\.|[^"\\])*\"|\'(?:\\.|[^\'\\])*\')|([a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*:'
        def replacer(m):
            if m.group(1):
                return m.group(1)
            return f'"{m.group(2)}":'
            
        raw_val = re.sub(pattern, replacer, raw_val)
        parsed = ast.literal_eval(raw_val)
        if isinstance(parsed, dict):
            return {int(k) if str(k).isdigit() else k: v for k, v in parsed.items()}
        return parsed
    except Exception as e:
        typer.echo(f"Warning: could not parse existing JS variable {var_name} from {file_path}: {e}")
        return None


BASE_KEYWORDS = [
    "-normal-forme",
    "-normal-form",
    "-type-normal",
    "-confined",
    "-altered-forme",
    "-land-forme",
    "-standard-mode",
    "-spring-form",
    "-incarnate-forme",
    "-aria-forme",
    "-natural-form",
    "-male",
    "-shield-forme",
    "-medium-variety",
    "-50-forme",
    "-baile-style",
    "-midday-form",
    "-solo-form",
    "-meteor-form",
    "-disguised-form",
    "-amped-form",
    "-phony-form",
    "-ice-face",
    "-full-belly-mode",
    "-hero-of-many-battles",
    "-single-strike-style",
    "-family-of-four",
    "-green-plumage",
    "-zero-form",
    "-curly-form",
    "-two-segment-form",
    "-chest-form",
    "-apex-build",
    "-ultimate-mode",
    "-counterfeit-form",
    "-unremarkable-form",
    "-teal-mask",
    "-normal-mode",
]

def get_pokemon_sort_key(p):
    slug = p.slug.lower()
    if "mega" in slug or "gigantamax" in slug or "gmax" in slug:
        form_priority = 9999
    else:
        form_priority = 999
        for idx, keyword in enumerate(BASE_KEYWORDS):
            if keyword in slug:
                form_priority = idx
                break
    return (form_priority, len(slug), slug)

def deduplicate_pokemon(pokemon_entries):
    from collections import defaultdict
    grouped = defaultdict(list)
    for p in pokemon_entries:
        grouped[int(p.number)].append(p)
        
    deduped = []
    for pid in sorted(grouped.keys()):
        list_p = grouped[pid]
        list_p.sort(key=get_pokemon_sort_key)
        deduped.append(list_p[0])
    return deduped


# --- Typer CLI Commands ---
@app.command()
def import_data(
    bundle_path: str = typer.Option(
        "file_imports/pokevault_bundle.json",
        "--bundle",
        "-b",
        help="Path to consolidated pokevault bundle JSON file"
    )
):
    """
    Import and update regions, pokemons, evolutions, stats, pokedex descriptions, and trainers.
    """
    if not os.path.exists(bundle_path):
        typer.echo(f"Error: consolidated bundle not found at {bundle_path}")
        raise typer.Exit(1)

    typer.echo(f"Loading and validating {bundle_path}...")
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_data = json.load(f)

    # Validate using Pydantic
    bundle = ConsolidatedBundle.model_validate(bundle_data)
    typer.echo("Data successfully validated!")

    # 1. Map slugs to National Dex ID
    # Note: we map all variant slugs to their base ID to robustly support evolution chain resolution
    slug_to_id = {p.slug: int(p.number) for p in bundle.pokedex.pokemon}

    # Load existing objects to preserve values
    existing_stats = load_existing_js("src/data/stats.js", "STATS") or {}
    existing_pdex = load_existing_js("src/data/pokedexEntries.js", "PDEX") or {}

    # --- 1. Generate regions.js ---
    typer.echo("Generating src/data/regions.js...")
    regions = bundle.pokedex.meta.regions
    regions_code = "export const REGIONS = [\n"
    for idx, r in enumerate(regions):
        regions_code += f"  {{ id: '{r.id}', name: '{r.label_fr}', ci: {idx}, range: [{r.low}, {r.high}] }},\n"
    regions_code = regions_code.rstrip(",\n") + "\n];\n"
    with open("src/data/regions.js", "w", encoding="utf-8") as f:
        f.write(regions_code)

    # --- 2. Generate pokemon.js ---
    typer.echo("Generating src/data/pokemon.js...")
    pokemon_list = deduplicate_pokemon(bundle.pokedex.pokemon)
    pokemon_list.sort(key=lambda x: int(x.number))

    pokemon_code = "export const POKEMON_RAW = [\n"
    for p in pokemon_list:
        pid = int(p.number)
        name = p.names.get("fr", p.names.get("en", p.slug))
        t1 = TYPE_MAP.get(p.types[0], "normal")
        t2 = TYPE_MAP.get(p.types[1], None) if len(p.types) > 1 else None
        t2_str = f"'{t2}'" if t2 else "null"
        escaped_name = name.replace("'", "\\'")
        pokemon_code += f"  [{pid}, '{escaped_name}', '{t1}', {t2_str}],\n"
    pokemon_code = pokemon_code.rstrip(",\n") + "\n];\n"
    with open("src/data/pokemon.js", "w", encoding="utf-8") as f:
        f.write(pokemon_code)

    # --- 3. Generate evolutions.js ---
    typer.echo("Generating src/data/evolutions.js...")
    evolution_chains = []
    seen_chains = set()
    for fam in bundle.evolution_families.families:
        # Convert slugs to IDs
        chain = []
        for member in fam.members:
            if member in slug_to_id:
                chain.append(slug_to_id[member])
        if len(chain) > 1:
            chain_tuple = tuple(sorted(chain))
            if chain_tuple not in seen_chains:
                seen_chains.add(chain_tuple)
                evolution_chains.append(chain)

    evolution_chains.sort(key=lambda x: x[0])
    evolutions_code = "export const EVOLUTIONS_RAW = [\n"
    for chain in evolution_chains:
        evolutions_code += f"  {chain},\n"
    evolutions_code = evolutions_code.rstrip(",\n") + "\n];\n"
    with open("src/data/evolutions.js", "w", encoding="utf-8") as f:
        f.write(evolutions_code)

    # --- 4. Generate stats.js (merge existing stats) ---
    typer.echo("Generating src/data/stats.js...")
    max_id = max(slug_to_id.values())
    stats_code = "export const STATS = {\n"
    for pid in range(1, max_id + 1):
        # Preserve existing stats, or use default stats [60, 60, 60, 60, 60, 60]
        pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
        # Ensure stats are formatted correctly as a list of integers
        stats_code += f"  {pid}: {list(pstats)},\n"
    stats_code = stats_code.rstrip(",\n") + "\n};\n"
    with open("src/data/stats.js", "w", encoding="utf-8") as f:
        f.write(stats_code)

    # --- 5. Generate pokedexEntries.js (merge existing, populate rest) ---
    typer.echo("Generating src/data/pokedexEntries.js...")
    pokedex_entries = {}
    
    # Keep existing ones
    if existing_pdex:
        for pid, entries in existing_pdex.items():
            pokedex_entries[int(pid)] = entries

    # Add missing ones from descriptions
    for p in pokemon_list:
        pid = int(p.number)
        if pid not in pokedex_entries and p.descriptions:
            desc_list = []
            for d in p.descriptions[:2]: # Grab up to 2 entries
                v_name = VERSION_MAP.get(d.version, d.version.replace("-", " ").title())
                clean_text = d.text.replace("\n", " ").replace("\r", "").strip()
                # Clean up multiple whitespaces
                clean_text = re.sub(r"\s+", " ", clean_text)
                desc_list.append({"g": v_name, "t": clean_text})
            if desc_list:
                pokedex_entries[pid] = desc_list

    pokedex_code = "export const PDEX = {\n"
    for pid in sorted(pokedex_entries.keys()):
        entries = pokedex_entries[pid]
        entries_json = json.dumps(entries, ensure_ascii=False)
        pokedex_code += f"  {pid}: {entries_json},\n"
    pokedex_code = pokedex_code.rstrip(",\n") + "\n};\n"
    with open("src/data/pokedexEntries.js", "w", encoding="utf-8") as f:
        f.write(pokedex_code)

    # --- 6. Generate trainers.js ---
    typer.echo("Generating src/data/trainers.js...")
    trainers_list = []
    trainer_idx = 1
    
    # Map Pokémon slugs to their types to determine badge colors
    pokemon_type_map = {}
    for p in bundle.pokedex.pokemon:
        if p.form is None:
            pokemon_type_map[p.slug] = TYPE_MAP.get(p.types[0], "normal")

    # Sort badges to group them by region
    badges_items = list(bundle.badges.badges.items())
    # Sort order: order of regions in metadata
    region_order = {r.id: idx for idx, r in enumerate(regions)}
    
    def badge_sort_key(item):
        key, badge = item
        reg = badge.location.region
        return (region_order.get(reg, 999), key)

    badges_items.sort(key=badge_sort_key)

    trainers_code = "export const TRAINERS = [\n"
    for key, b in badges_items:
        trainer_name = b.trainer.name.fr or b.trainer.name.en
        
        # Normalize role
        role_fr = b.trainer.role.fr
        if "Champion" in role_fr:
            role = "Champion Arène"
        elif "Conseil" in role_fr or "Élite" in role_fr:
            role = "Élite 4"
        elif "Rival" in role_fr:
            role = "Rival"
        elif "Maître" in role_fr:
            role = "Maître"
        else:
            role = role_fr

        city = b.location.city.fr or b.location.city.en
        region = b.location.region
        
        # Map badge name if we have one, otherwise use the badge name from the key or leave None
        badge_name = BADGE_MAP.get(key, None)
        if badge_name:
            escaped_badge = badge_name.replace("'", "\\'")
            badge_str = f"'{escaped_badge}'"
        else:
            badge_str = "null"
        
        # Get team member IDs from the first encounter
        team_ids = []
        if b.encounters:
            first_team = b.encounters[0].team
            for member in first_team:
                if member.slug in slug_to_id:
                    team_ids.append(slug_to_id[member.slug])
        
        # If team is empty, skip or mock
        if not team_ids:
            continue
            
        # Determine background color based on first pokemon's primary type
        first_pk_slug = b.encounters[0].team[0].slug
        first_pk_type = pokemon_type_map.get(first_pk_slug, "normal")
        color = TYPE_COLORS.get(first_pk_type, "#888888")
        
        desc = b.trainer.history.fr or b.trainer.history.en or f"Dresseur de la région {region.upper()}."
        desc = desc.replace("\n", " ").replace("\r", "").replace("'", "\\'").strip()
        desc = re.sub(r"\s+", " ", desc)
        
        # Add to output code
        escaped_name = trainer_name.replace("'", "\\'")
        escaped_city = city.replace("'", "\\'")
        escaped_role = role.replace("'", "\\'")
        trainers_code += (
            f"  {{id:{trainer_idx},name:'{escaped_name}',role:'{escaped_role}',"
            f"city:'{escaped_city}',badge:{badge_str},bc:'{color}',"
            f"region:'{region}',team:{team_ids},desc:'{desc}'}},\n"
        )
        trainer_idx += 1

    trainers_code = trainers_code.rstrip(",\n") + "\n];\n"
    with open("src/data/trainers.js", "w", encoding="utf-8") as f:
        f.write(trainers_code)

    # --- 7. Generate achievements.js ---
    typer.echo("Generating src/data/achievements.js...")
    # Generate list of achievements dynamically based on regions that have trainers with badges
    badge_regions = set()
    for key, b in bundle.badges.badges.items():
        if key in BADGE_MAP:
            badge_regions.add(b.location.region)
            
    # Ordered by region index
    sorted_badge_regions = sorted(list(badge_regions), key=lambda r: region_order.get(r, 999))
    
    # Region achievements icons and colors map
    REGION_ACHIEVEMENTS_CFG = {
        "kanto": {"icon": "🔴", "color": "#ff375f"},
        "johto": {"icon": "⭐", "color": "#ffd60a"},
        "hoenn": {"icon": "💚", "color": "#38b000"},
        "sinnoh": {"icon": "❄️", "color": "#4cc9f0"},
        "unys": {"icon": "⛰️", "color": "#e0c068"},
        "kalos": {"icon": "⚜️", "color": "#f72585"},
        "alola": {"icon": "☀️", "color": "#ff9f1c"},
        "galar": {"icon": "🛡️", "color": "#b8a8d0"},
        "hisui": {"icon": "⏳", "color": "#a0a0a0"},
        "paldea": {"icon": "🍊", "color": "#ff6b35"}
    }
    
    achievements_code = """import { TRAINERS } from './trainers.js';
import { POKEMON_RAW } from './pokemon.js';

export const ACHIEVEMENTS = [
"""
    
    # Generate region achievements
    for reg_id in sorted_badge_regions:
        reg_meta = next((r for r in regions if r.id == reg_id), None)
        reg_name = reg_meta.label_fr if reg_meta else reg_id.capitalize()
        escaped_reg_name = reg_name.replace("'", "\\'")
        cfg = REGION_ACHIEVEMENTS_CFG.get(reg_id, {"icon": "🏆", "color": "#888888"})
        
        achievements_code += f"""  {{
    id: 'champ-{reg_id}',
    label: 'Champion de {escaped_reg_name}',
    icon: '{cfg["icon"]}',
    color: '{cfg["color"]}',
    desc: 'Décroche tous les badges de {escaped_reg_name}.',
    check: (col) => TRAINERS.filter(t => t.region === '{reg_id}' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  }},
"""

    # Generate Grand Maître achievement
    reg_list_str = ", ".join([f"'{r}'" for r in sorted_badge_regions])
    achievements_code += f"""  {{
    id: 'grand-maitre',
    label: 'Grand Maître',
    icon: '👑',
    color: '#ffd700',
    desc: 'Champion de toutes les régions.',
    check: (col) => [{reg_list_str}].every(r => TRAINERS.filter(t => t.region === r && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main')))
  }},
  {{
    id: 'dresseur-ultime',
    label: 'Dresseur Ultime',
    icon: '🌟',
    color: '#c0a0ff',
    desc: 'Tous les Pokémon rangés ou en main.',
    check: (col) => POKEMON_RAW.every(([id]) => col[id] === 'rangé' || col[id] === 'en main')
  }}
];
"""
    with open("src/data/achievements.js", "w", encoding="utf-8") as f:
        f.write(achievements_code)

    typer.echo("\nAll PokéClasseur data files successfully updated!")
    typer.echo(f"Total Pokémon imported: {len(pokemon_list)}")
    typer.echo(f"Total Evolution Chains: {len(evolution_chains)}")
    typer.echo(f"Total Trainers: {trainer_idx - 1}")


@app.command()
def status():
    """
    Display current PokéClasseur data files status.
    """
    regions = load_existing_js("src/data/regions.js", "REGIONS") or []
    pokemon = load_existing_js("src/data/pokemon.js", "POKEMON_RAW") or []
    evolutions = load_existing_js("src/data/evolutions.js", "EVOLUTIONS_RAW") or []
    stats = load_existing_js("src/data/stats.js", "STATS") or {}
    trainers = load_existing_js("src/data/trainers.js", "TRAINERS") or []
    pdex = load_existing_js("src/data/pokedexEntries.js", "PDEX") or {}

    typer.echo("=== PokéClasseur Current Data Status ===")
    typer.echo(f"Regions count: {len(regions)}")
    for r in regions:
        typer.echo(f"  - {r['name']} ({r['id']}): range {r['range'][0]} to {r['range'][1]}")
    typer.echo(f"Pokémon count: {len(pokemon)}")
    typer.echo(f"Evolution chains count: {len(evolutions)}")
    typer.echo(f"Stats populated: {len(stats)} / {len(pokemon)} Pokémon")
    typer.echo(f"Pokedex entries: {len(pdex)} / {len(pokemon)} Pokémon")
    typer.echo(f"Trainers count: {len(trainers)}")


def clean_variety_word(w: str) -> str:
    w = w.lower()
    if w == "gmax": return "gigantamax"
    if w == "hisuian": return "hisui"
    if w == "alolan": return "alola"
    if w == "galarian": return "galar"
    if w == "paldean": return "paldea"
    return w

def normalize_variety_name(s: str) -> set:
    return {clean_variety_word(w) for w in re.findall(r'[a-zA-Z0-9]+', s.lower())}

def match_variety_entry(variety_name: str, bundle_entries: list) -> Optional[dict]:
    variety_words = normalize_variety_name(variety_name)
    best_entry = None
    best_score = 0
    for entry in bundle_entries:
        slug_words = normalize_variety_name(entry.get("slug", ""))
        overlap = len(variety_words & slug_words)
        if overlap > best_score:
            best_score = overlap
            best_entry = entry
    return best_entry


async def fetch_pokemon_data(client: httpx.AsyncClient, pid: int, fetch_stats: bool, fetch_desc: bool, sem: asyncio.Semaphore):
    async with sem:
        stats = None
        descriptions = []
        varieties_list = []
        
        # 1. Fetch stats if requested
        if fetch_stats:
            url = f"https://pokeapi.co/api/v2/pokemon/{pid}/"
            for attempt in range(3):
                try:
                    res = await client.get(url, timeout=10.0)
                    if res.status_code == 200:
                        data = res.json()
                        # Extract the 6 base stats
                        stats_list = [0] * 6
                        name_to_index = {
                            "hp": 0,
                            "attack": 1,
                            "defense": 2,
                            "special-attack": 3,
                            "special-defense": 4,
                            "speed": 5
                        }
                        for s in data.get("stats", []):
                            stat_name = s["stat"]["name"]
                            if stat_name in name_to_index:
                                stats_list[name_to_index[stat_name]] = s["base_stat"]
                        stats = stats_list
                        break
                    elif res.status_code == 404:
                        break
                except Exception:
                    await asyncio.sleep(2 ** attempt)
        
        # 2. Fetch descriptions and varieties if requested
        if fetch_desc:
            url = f"https://pokeapi.co/api/v2/pokemon-species/{pid}/"
            for attempt in range(3):
                try:
                    res = await client.get(url, timeout=10.0)
                    if res.status_code == 200:
                        data = res.json()
                        desc_list = []
                        seen_texts = set()
                        for entry in data.get("flavor_text_entries", []):
                            if entry.get("language", {}).get("name") == "fr":
                                raw_text = entry.get("flavor_text", "")
                                clean_text = raw_text.replace("\n", " ").replace("\r", "").strip()
                                clean_text = re.sub(r"\s+", " ", clean_text)
                                if clean_text and clean_text not in seen_texts:
                                    seen_texts.add(clean_text)
                                    version_name = entry.get("version", {}).get("name", "")
                                    v_name = VERSION_MAP.get(version_name, version_name.replace("-", " ").title())
                                    desc_list.append({"g": v_name, "t": clean_text})
                        descriptions = desc_list[:2]
                        
                        # Extract varieties
                        varieties = data.get("varieties", [])
                        for v in varieties:
                            if not v.get("is_default", False):
                                v_name = v["pokemon"]["name"]
                                v_url = v["pokemon"]["url"]
                                poke_id_match = re.search(r"/pokemon/(\d+)/", v_url)
                                if poke_id_match:
                                    poke_id = int(poke_id_match.group(1))
                                    varieties_list.append({"name": v_name, "poke_id": poke_id})
                        break
                    elif res.status_code == 404:
                        break
                except Exception:
                    await asyncio.sleep(2 ** attempt)
                    
        return pid, stats, descriptions, varieties_list


async def scrape_api_async(all_stats: bool, all_desc: bool, concurrency: int, limit: Optional[int]):
    from collections import defaultdict
    pokemon_raw = load_existing_js("src/data/pokemon.js", "POKEMON_RAW")
    if not pokemon_raw:
        typer.echo("Error: src/data/pokemon.js not found or couldn't be parsed.")
        raise typer.Exit(1)
        
    pokemon_ids = [item[0] for item in pokemon_raw]
    if limit:
        pokemon_ids = pokemon_ids[:limit]
        
    existing_stats = load_existing_js("src/data/stats.js", "STATS") or {}
    existing_pdex = load_existing_js("src/data/pokedexEntries.js", "PDEX") or {}
    existing_forms = load_existing_js("src/data/pokemonForms.js", "POKEMON_FORMS") or {}
    
    needs_forms = not existing_forms or len(existing_forms) < 100
    
    stats_targets = []
    desc_targets = []
    
    for pid in pokemon_ids:
        pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
        if all_stats or pstats == [60, 60, 60, 60, 60, 60]:
            stats_targets.append(pid)
            
        pdesc = existing_pdex.get(pid, [])
        if all_desc or not pdesc or (needs_forms and pid not in existing_forms):
            desc_targets.append(pid)
            
    all_targets = sorted(list(set(stats_targets) | set(desc_targets)))
    
    if not all_targets:
        typer.echo("All stats, descriptions, and forms are already up to date! Nothing to scrape.")
        return
        
    typer.echo(f"Found {len(pokemon_ids)} total Pokémon in database.")
    typer.echo(f"Need to fetch stats for: {len(stats_targets)} Pokémon.")
    typer.echo(f"Need to fetch descriptions/forms for: {len(desc_targets)} Pokémon.")
    typer.echo(f"Querying PokéAPI for {len(all_targets)} Pokémon (concurrency={concurrency})...")
    
    bundle_by_id = defaultdict(list)
    bundle_path = "file_imports/pokevault_bundle.json"
    if os.path.exists(bundle_path):
        try:
            with open(bundle_path, "r", encoding="utf-8") as f:
                bundle_data = json.load(f)
            for p in bundle_data.get("pokedex", {}).get("pokemon", []):
                bundle_by_id[int(p["number"])].append(p)
        except Exception as e:
            typer.echo(f"Warning: could not load bundle for variety matching: {e}")
            
    sem = asyncio.Semaphore(concurrency)
    
    async with httpx.AsyncClient() as client:
        tasks = []
        for pid in all_targets:
            fetch_stats = pid in stats_targets
            fetch_desc = pid in desc_targets
            tasks.append(fetch_pokemon_data(client, pid, fetch_stats, fetch_desc, sem))
            
        from tqdm.asyncio import tqdm
        results = []
        for f in tqdm.as_completed(tasks, desc="Scraping PokéAPI"):
            pid, stats, descriptions, varieties = await f
            results.append((pid, stats, descriptions, varieties))
            
    stats_updated = 0
    desc_updated = 0
    forms_updated = 0
    
    for pid, stats, descriptions, varieties in results:
        if stats is not None:
            existing_stats[pid] = stats
            stats_updated += 1
        if descriptions:
            existing_pdex[pid] = descriptions
            desc_updated += 1
        if varieties:
            forms_list = []
            bundle_entries = bundle_by_id.get(pid, [])
            for var in varieties:
                matched_entry = match_variety_entry(var["name"], bundle_entries)
                if matched_entry:
                    form_name = matched_entry.get("names", {}).get("fr") or matched_entry.get("names", {}).get("en") or var["name"]
                    form_types = [TYPE_MAP.get(t, "normal") for t in matched_entry.get("types", [])]
                else:
                    form_name = var["name"].replace("-", " ").title()
                    form_types = ["normal"]
                forms_list.append({
                    "poke_id": var["poke_id"],
                    "name": form_name,
                    "types": form_types
                })
            if forms_list:
                existing_forms[pid] = forms_list
                forms_updated += 1
            
    if stats_updated > 0 or all_stats:
        typer.echo("Writing updated src/data/stats.js...")
        full_pokemon_ids = [item[0] for item in pokemon_raw]
        max_id = max(full_pokemon_ids)
        stats_code = "export const STATS = {\n"
        for pid in range(1, max_id + 1):
            pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
            stats_code += f"  {pid}: {list(pstats)},\n"
        stats_code = stats_code.rstrip(",\n") + "\n};\n"
        with open("src/data/stats.js", "w", encoding="utf-8") as f:
            f.write(stats_code)
            
    if desc_updated > 0 or all_desc:
        typer.echo("Writing updated src/data/pokedexEntries.js...")
        pokedex_code = "export const PDEX = {\n"
        for pid in sorted(existing_pdex.keys()):
            entries = existing_pdex[pid]
            if entries:
                entries_json = json.dumps(entries, ensure_ascii=False)
                pokedex_code += f"  {pid}: {entries_json},\n"
        pokedex_code = pokedex_code.rstrip(",\n") + "\n};\n"
        with open("src/data/pokedexEntries.js", "w", encoding="utf-8") as f:
            f.write(pokedex_code)
            
    if forms_updated > 0 or not os.path.exists("src/data/pokemonForms.js"):
        typer.echo("Writing updated src/data/pokemonForms.js...")
        forms_code = "export const POKEMON_FORMS = {\n"
        for pid in sorted(existing_forms.keys()):
            forms_list = existing_forms[pid]
            if forms_list:
                forms_json = json.dumps(forms_list, ensure_ascii=False)
                forms_code += f"  {pid}: {forms_json},\n"
        forms_code = forms_code.rstrip(",\n") + "\n};\n"
        with open("src/data/pokemonForms.js", "w", encoding="utf-8") as f:
            f.write(forms_code)
            
    typer.echo(f"\nScraping complete! Updated {stats_updated} stats, {desc_updated} descriptions, and {forms_updated} forms.")


@app.command()
def scrape_api(
    all_stats: bool = typer.Option(False, "--all-stats", help="Fetch stats for all Pokémon, overriding existing ones"),
    all_desc: bool = typer.Option(False, "--all-desc", help="Fetch descriptions for all Pokémon, overriding existing ones"),
    concurrency: int = typer.Option(5, "--concurrency", help="Number of concurrent requests to PokéAPI"),
    limit: Optional[int] = typer.Option(None, "--limit", help="Limit the number of Pokémon to scrape (useful for testing)")
):
    """
    Scrape missing base stats, French Pokédex descriptions, and specific forms from PokéAPI (pokeapi.co).
    """
    asyncio.run(scrape_api_async(all_stats, all_desc, concurrency, limit))


if __name__ == "__main__":
    app()
