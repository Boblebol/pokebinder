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
    "red": "Rouge",
    "blue": "Bleu",
    "yellow": "Jaune",
    "gold": "Or",
    "silver": "Argent",
    "crystal": "Cristal",
    "ruby": "Rubis",
    "sapphire": "Saphir",
    "emerald": "Émeraude",
    "firered": "Rouge Feu",
    "leafgreen": "Vert Feuille",
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
        typer.secho(f"✗ Error: consolidated bundle not found at {bundle_path}", fg=typer.colors.RED, bold=True)
        raise typer.Exit(1)

    typer.secho(f"📦 Loading and validating {bundle_path}...", fg=typer.colors.CYAN, bold=True)
    try:
        with open(bundle_path, "r", encoding="utf-8") as f:
            bundle_data = json.load(f)
        bundle = ConsolidatedBundle.model_validate(bundle_data)
    except Exception as e:
        typer.secho(f"✗ Validation failed: {e}", fg=typer.colors.RED, bold=True)
        raise typer.Exit(1)
        
    typer.secho("✓ Data successfully validated!", fg=typer.colors.GREEN, bold=True)

    # 1. Map slugs to National Dex ID
    slug_to_id = {p.slug: int(p.number) for p in bundle.pokedex.pokemon}

    # Load existing objects to preserve values
    existing_stats = load_existing_js("src/data/stats.js", "STATS") or {}
    existing_pdex = load_existing_js("src/data/pokedexEntries.js", "PDEX") or {}

    # --- 1. Generate regions.js ---
    typer.secho("\n🌍 Generating src/data/regions.js...", fg=typer.colors.BLUE, bold=True)
    regions = bundle.pokedex.meta.regions
    regions_code = "export const REGIONS = [\n"
    for idx, r in enumerate(regions):
        regions_code += f"  {{ id: '{r.id}', name: '{r.label_fr}', ci: {idx}, range: [{r.low}, {r.high}] }},\n"
    regions_code = regions_code.rstrip(",\n") + "\n];\n"
    with open("src/data/regions.js", "w", encoding="utf-8") as f:
        f.write(regions_code)
    typer.secho(f"  ✓ Saved {len(regions)} regions.", fg=typer.colors.GREEN)

    # --- 1.1 Generate gamePokedexes.js ---
    typer.secho("🎮 Generating src/data/gamePokedexes.js...", fg=typer.colors.BLUE, bold=True)
    gp = bundle_data.get("game_pokedexes", {})
    gp_pokedexes = gp.get("pokedexes", [])
    gp_apps = gp.get("appearances_by_slug", {})
    
    pokedex_pokemon = {p["id"]: [] for p in gp_pokedexes}
    for slug, p_dex_ids in gp_apps.items():
        pid = slug_to_id.get(slug)
        if pid is not None:
            for dex_id in p_dex_ids:
                if dex_id in pokedex_pokemon:
                    pokedex_pokemon[dex_id].append(pid)
                    
    game_dex_code = "export const GAME_POKEDEXES = [\n"
    for p in gp_pokedexes:
        dex_id = p["id"]
        label_fr = p["label_fr"].replace("'", "\\'")
        region = p["region"].replace("'", "\\'")
        pids = sorted(list(set(pokedex_pokemon.get(dex_id, []))))
        game_dex_code += f"  {{ id: '{dex_id}', label_fr: '{label_fr}', region: '{region}', pokemon: {pids} }},\n"
    game_dex_code = game_dex_code.rstrip(",\n") + "\n];\n"
    with open("src/data/gamePokedexes.js", "w", encoding="utf-8") as f:
        f.write(game_dex_code)
    typer.secho(f"  ✓ Saved {len(gp_pokedexes)} game Pokédexes.", fg=typer.colors.GREEN)

    # --- 2. Generate pokemon.js ---
    typer.secho("🐱 Generating src/data/pokemon.js...", fg=typer.colors.BLUE, bold=True)
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
    typer.secho(f"  ✓ Saved {len(pokemon_list)} Pokémon species.", fg=typer.colors.GREEN)

    # --- 3. Generate evolutions.js ---
    typer.secho("🧬 Generating src/data/evolutions.js...", fg=typer.colors.BLUE, bold=True)
    evolution_chains = []
    seen_chains = set()
    for fam in bundle.evolution_families.families:
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
    typer.secho(f"  ✓ Saved {len(evolution_chains)} evolution chains.", fg=typer.colors.GREEN)

    # --- 4. Generate stats.js (merge existing stats) ---
    typer.secho("📊 Generating src/data/stats.js...", fg=typer.colors.BLUE, bold=True)
    max_id = max(slug_to_id.values())
    stats_code = "export const STATS = {\n"
    for pid in range(1, max_id + 1):
        pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
        stats_code += f"  {pid}: {list(pstats)},\n"
    stats_code = stats_code.rstrip(",\n") + "\n};\n"
    with open("src/data/stats.js", "w", encoding="utf-8") as f:
        f.write(stats_code)
    typer.secho(f"  ✓ Saved base stats for {max_id} Pokémon.", fg=typer.colors.GREEN)

    # --- 5. Generate pokedexEntries.js (merge existing, populate rest) ---
    typer.secho("📖 Generating src/data/pokedexEntries.js...", fg=typer.colors.BLUE, bold=True)
    pokedex_entries = {}
    
    # Merge existing ones and bundle descriptions
    for p in pokemon_list:
        pid = int(p.number)
        desc_list = []
        seen_versions = set()
        
        # 1. Add descriptions from the bundle
        if p.descriptions:
            for d in p.descriptions:
                v_name = VERSION_MAP.get(d.version, d.version.replace("-", " ").title())
                clean_text = d.text.replace("\n", " ").replace("\r", "").strip()
                clean_text = re.sub(r"\s+", " ", clean_text)
                if v_name not in seen_versions:
                    seen_versions.add(v_name)
                    desc_list.append({"g": v_name, "t": clean_text})
                    
        # 2. Merge existing ones if the version is not already present
        if existing_pdex and pid in existing_pdex:
            for ext in existing_pdex[pid]:
                v_name = ext.get("g")
                if v_name and v_name not in seen_versions:
                    seen_versions.add(v_name)
                    desc_list.append(ext)
                    
        if desc_list:
            pokedex_entries[pid] = desc_list

    # 3. Keep other existing descriptions not in the bundle list
    if existing_pdex:
        for pid, entries in existing_pdex.items():
            pid_int = int(pid)
            if pid_int not in pokedex_entries:
                pokedex_entries[pid_int] = entries

    pokedex_code = "export const PDEX = {\n"
    for pid in sorted(pokedex_entries.keys()):
        entries = pokedex_entries[pid]
        entries_json = json.dumps(entries, ensure_ascii=False)
        pokedex_code += f"  {pid}: {entries_json},\n"
    pokedex_code = pokedex_code.rstrip(",\n") + "\n};\n"
    with open("src/data/pokedexEntries.js", "w", encoding="utf-8") as f:
        f.write(pokedex_code)
    typer.secho(f"  ✓ Saved {len(pokedex_entries)} Pokédex descriptions entries.", fg=typer.colors.GREEN)

    # --- 6. Generate trainers.js ---
    typer.secho("⚔️ Generating src/data/trainers.js...", fg=typer.colors.BLUE, bold=True)
    trainers_list = []
    trainer_idx = 1
    
    pokemon_type_map = {}
    for p in bundle.pokedex.pokemon:
        if p.form is None:
            pokemon_type_map[p.slug] = TYPE_MAP.get(p.types[0], "normal")

    badges_items = list(bundle.badges.badges.items())
    region_order = {r.id: idx for idx, r in enumerate(regions)}
    
    def badge_sort_key(item):
        key, badge = item
        reg = badge.location.region
        return (region_order.get(reg, 999), key)

    badges_items.sort(key=badge_sort_key)

    trainers_code = "export const TRAINERS = [\n"
    for key, b in badges_items:
        trainer_name = b.trainer.name.fr or b.trainer.name.en
        
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
        
        badge_name = BADGE_MAP.get(key, None)
        if badge_name:
            escaped_badge = badge_name.replace("'", "\\'")
            badge_str = f"'{escaped_badge}'"
        else:
            badge_str = "null"
        
        team_ids = []
        if b.encounters:
            first_team = b.encounters[0].team
            for member in first_team:
                if member.slug in slug_to_id:
                    team_ids.append(slug_to_id[member.slug])
        
        if not team_ids:
            continue
            
        first_pk_slug = b.encounters[0].team[0].slug
        first_pk_type = pokemon_type_map.get(first_pk_slug, "normal")
        color = TYPE_COLORS.get(first_pk_type, "#888888")
        
        desc = b.trainer.history.fr or b.trainer.history.en or f"Dresseur de la région {region.upper()}."
        desc = desc.replace("\n", " ").replace("\r", "").replace("'", "\\'").strip()
        desc = re.sub(r"\s+", " ", desc)
        
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
    typer.secho(f"  ✓ Saved {trainer_idx - 1} trainers.", fg=typer.colors.GREEN)

    # --- 7. Generate achievements.js ---
    typer.secho("🏆 Generating src/data/achievements.js...", fg=typer.colors.BLUE, bold=True)
    badge_regions = set()
    for key, b in bundle.badges.badges.items():
        if key in BADGE_MAP:
            badge_regions.add(b.location.region)
            
    sorted_badge_regions = sorted(list(badge_regions), key=lambda r: region_order.get(r, 999))
    
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
    typer.secho("  ✓ Saved achievements.", fg=typer.colors.GREEN)

    typer.secho("\n✨ All PokéClasseur data files successfully updated!", fg=typer.colors.GREEN, bold=True)
    typer.echo(f"  - Total Pokémon: {len(pokemon_list)}")
    typer.echo(f"  - Total Evolution Chains: {len(evolution_chains)}")
    typer.echo(f"  - Total Trainers: {trainer_idx - 1}")


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

    typer.secho("\n📊 === PokéClasseur Current Data Status ===", fg=typer.colors.YELLOW, bold=True)
    typer.secho(f"📂 Regions count: {len(regions)}", fg=typer.colors.CYAN, bold=True)
    for r in regions:
        typer.echo(f"  - {r['name']} ({r['id']}): range {r['range'][0]} to {r['range'][1]}")
    typer.secho(f"🐱 Pokémon count: {len(pokemon)}", fg=typer.colors.CYAN, bold=True)
    typer.secho(f"🧬 Evolution chains count: {len(evolutions)}", fg=typer.colors.CYAN, bold=True)
    
    stats_pct = round(len(stats) / len(pokemon) * 100) if pokemon else 0
    typer.secho(f"📊 Stats populated: {len(stats)} / {len(pokemon)} Pokémon ({stats_pct}%)", fg=typer.colors.CYAN, bold=True)
    
    pdex_pct = round(len(pdex) / len(pokemon) * 100) if pokemon else 0
    typer.secho(f"📖 Pokédex entries: {len(pdex)} / {len(pokemon)} Pokémon ({pdex_pct}%)", fg=typer.colors.CYAN, bold=True)
    
    typer.secho(f"⚔️ Trainers count: {len(trainers)}", fg=typer.colors.CYAN, bold=True)


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


async def fetch_pokemon_data(client: httpx.AsyncClient, pid: int, fetch_stats: bool, fetch_desc: bool, fetch_details: bool, sem: asyncio.Semaphore):
    async with sem:
        stats = None
        height = None
        weight = None
        descriptions = []
        varieties_list = []
        
        # 1. Fetch stats and details if requested
        if fetch_stats or fetch_details:
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
                        height = data.get("height")
                        weight = data.get("weight")
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
                        descriptions = desc_list
                        
                        # Extract varieties
                        varieties = data.get("varieties", [])
                        for v in varieties:
                            if not v.get("is_default", False):
                                v_name = v["pokemon"]["name"]
                                v_url = v["pokemon"]["url"]
                                poke_id_match = re.search(r"/pokemon/(\d+)/", v_url)
                                if poke_id_match:
                                    poke_id = int(poke_id_match.group(1))
                                    # Query the stats of this variety
                                    var_stats = None
                                    var_height = None
                                    var_weight = None
                                    for v_attempt in range(3):
                                        try:
                                            v_res = await client.get(v_url, timeout=10.0)
                                            if v_res.status_code == 200:
                                                v_data = v_res.json()
                                                stats_list = [0] * 6
                                                name_to_index = {
                                                    "hp": 0,
                                                    "attack": 1,
                                                    "defense": 2,
                                                    "special-attack": 3,
                                                    "special-defense": 4,
                                                    "speed": 5
                                                }
                                                for s in v_data.get("stats", []):
                                                    stat_name = s["stat"]["name"]
                                                    if stat_name in name_to_index:
                                                        stats_list[name_to_index[stat_name]] = s["base_stat"]
                                                var_stats = stats_list
                                                var_height = v_data.get("height")
                                                var_weight = v_data.get("weight")
                                                break
                                        except Exception:
                                            await asyncio.sleep(1)
                                    varieties_list.append({
                                        "name": v_name,
                                        "poke_id": poke_id,
                                        "stats": var_stats,
                                        "height": var_height,
                                        "weight": var_weight
                                    })
                        break
                    elif res.status_code == 404:
                        break
                except Exception:
                    await asyncio.sleep(2 ** attempt)
                    
        return pid, stats, height, weight, descriptions, varieties_list


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
    existing_details = load_existing_js("src/data/pokemonDetails.js", "PKM_DETAILS") or {}
    
    needs_forms = not existing_forms or len(existing_forms) < 100
    
    stats_targets = []
    desc_targets = []
    details_targets = []
    
    for pid in pokemon_ids:
        if pid not in existing_details:
            details_targets.append(pid)
            
        pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
        if all_stats or pstats == [60, 60, 60, 60, 60, 60]:
            stats_targets.append(pid)
            
        pdesc = existing_pdex.get(pid, [])
        forms = existing_forms.get(pid, [])
        has_incomplete_forms = False
        if forms:
            has_incomplete_forms = any(
                f.get("stats") is None or f.get("height") is None or f.get("weight") is None
                for f in forms
            )
        if all_desc or not pdesc or (needs_forms and pid not in existing_forms) or has_incomplete_forms:
            desc_targets.append(pid)
            
    all_targets = sorted(list(set(stats_targets + desc_targets + details_targets)))
    if not all_targets:
        typer.secho("✓ All stats, descriptions, details, and forms are already up to date! Nothing to scrape.", fg=typer.colors.GREEN, bold=True)
        return
        
    typer.secho(f"ℹ Found {len(pokemon_ids)} total Pokémon in database.", fg=typer.colors.CYAN)
    typer.echo(f"  - Need to fetch details for: {len(details_targets)} Pokémon.")
    typer.echo(f"  - Need to fetch stats for: {len(stats_targets)} Pokémon.")
    typer.echo(f"  - Need to fetch descriptions/forms for: {len(desc_targets)} Pokémon.")
    typer.secho(f"🚀 Querying PokéAPI for {len(all_targets)} Pokémon (concurrency={concurrency})...", fg=typer.colors.MAGENTA, bold=True)
    
    bundle_by_id = defaultdict(list)
    bundle_path = "file_imports/pokevault_bundle.json"
    if os.path.exists(bundle_path):
        try:
            with open(bundle_path, "r", encoding="utf-8") as f:
                bundle_data = json.load(f)
            for p in bundle_data.get("pokedex", {}).get("pokemon", []):
                bundle_by_id[int(p["number"])].append(p)
        except Exception as e:
            typer.secho(f"⚠ Warning: could not load bundle for variety matching: {e}", fg=typer.colors.YELLOW)
            
    sem = asyncio.Semaphore(concurrency)
    
    async with httpx.AsyncClient() as client:
        tasks = []
        for pid in all_targets:
            fetch_stats = pid in stats_targets
            fetch_desc = pid in desc_targets
            fetch_details = pid in details_targets
            tasks.append(fetch_pokemon_data(client, pid, fetch_stats, fetch_desc, fetch_details, sem))
            
        from tqdm.asyncio import tqdm
        results = []
        for f in tqdm.as_completed(tasks, desc="Scraping PokéAPI"):
            pid, stats, height, weight, descriptions, varieties = await f
            results.append((pid, stats, height, weight, descriptions, varieties))
            
    stats_updated = 0
    details_updated = 0
    desc_updated = 0
    forms_updated = 0
    
    for pid, stats, height, weight, descriptions, varieties in results:
        if stats is not None:
            existing_stats[pid] = stats
            stats_updated += 1
        if height is not None and weight is not None:
            existing_details[pid] = {"h": height, "w": weight}
            details_updated += 1
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
                     "types": form_types,
                     "stats": var.get("stats"),
                     "height": var.get("height"),
                     "weight": var.get("weight")
                })
            if forms_list:
                existing_forms[pid] = forms_list
                forms_updated += 1
            
    if stats_updated > 0 or all_stats:
        typer.secho("📝 Writing updated src/data/stats.js...", fg=typer.colors.BLUE)
        full_pokemon_ids = [item[0] for item in pokemon_raw]
        max_id = max(full_pokemon_ids)
        stats_code = "export const STATS = {\n"
        for pid in range(1, max_id + 1):
            pstats = existing_stats.get(pid, [60, 60, 60, 60, 60, 60])
            stats_code += f"  {pid}: {list(pstats)},\n"
        stats_code = stats_code.rstrip(",\n") + "\n};\n"
        with open("src/data/stats.js", "w", encoding="utf-8") as f:
            f.write(stats_code)
            
    if details_updated > 0 or not os.path.exists("src/data/pokemonDetails.js"):
        typer.secho("📝 Writing updated src/data/pokemonDetails.js...", fg=typer.colors.BLUE)
        details_code = "export const PKM_DETAILS = {\n"
        for pid in sorted(existing_details.keys()):
            h_w = existing_details[pid]
            details_code += f"  {pid}: {{ h: {h_w['h']}, w: {h_w['w']} }},\n"
        details_code = details_code.rstrip(",\n") + "\n};\n"
        with open("src/data/pokemonDetails.js", "w", encoding="utf-8") as f:
            f.write(details_code)
 
    if desc_updated > 0 or all_desc:
        typer.secho("📝 Writing updated src/data/pokedexEntries.js...", fg=typer.colors.BLUE)
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
        typer.secho("📝 Writing updated src/data/pokemonForms.js...", fg=typer.colors.BLUE)
        forms_code = "export const POKEMON_FORMS = {\n"
        for pid in sorted(existing_forms.keys()):
            forms_list = existing_forms[pid]
            if forms_list:
                forms_json = json.dumps(forms_list, ensure_ascii=False)
                forms_code += f"  {pid}: {forms_json},\n"
        forms_code = forms_code.rstrip(",\n") + "\n};\n"
        with open("src/data/pokemonForms.js", "w", encoding="utf-8") as f:
            f.write(forms_code)
            
    typer.secho(f"\n✨ Scraping complete! Updated {stats_updated} stats, {desc_updated} descriptions, and {forms_updated} forms.", fg=typer.colors.GREEN, bold=True)


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


@app.command()
def sync(
    bundle_path: str = typer.Option(
        "file_imports/pokevault_bundle.json",
        "--bundle",
        "-b",
        help="Path to consolidated bundle file"
    ),
    scrape: bool = typer.Option(True, "--scrape/--no-scrape", help="Fetch missing stats and descriptions from PokéAPI after import")
):
    """
    Import local bundle file and scrape any remaining missing data from PokéAPI.
    """
    typer.secho("\n🔄 [1/2] Importing local bundle data...", fg=typer.colors.MAGENTA, bold=True)
    import_data(bundle_path)
    if scrape:
        typer.secho("\n🌐 [2/2] Scraping remaining missing data from PokéAPI...", fg=typer.colors.MAGENTA, bold=True)
        asyncio.run(scrape_api_async(all_stats=False, all_desc=False, concurrency=5, limit=None))
    typer.secho("\n✨ Synchronization fully completed successfully!", fg=typer.colors.GREEN, bold=True)


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context):
    """
    PokéClasseur Data CLI Tool - Update stats, dex, and trainers.
    """
    if ctx.invoked_subcommand is None:
        typer.secho("\n👋 Welcome to the PokéClasseur Data CLI!", fg=typer.colors.MAGENTA, bold=True)
        typer.secho("Please choose an operation to perform:", fg=typer.colors.CYAN)
        typer.echo("  1. 🔄 Full Synchronization (Import local bundle + Scrape missing PokéAPI entries)")
        typer.echo("  2. 📊 Show Status (Display count of imported resources)")
        typer.echo("  3. 📦 Import bundle data only")
        typer.echo("  4. 🌐 Scrape PokéAPI data only")
        typer.echo("  0. ❌ Exit")
        
        choice = typer.prompt("\nEnter choice (0-4)", default="1")
        if choice == "1":
            ctx.invoke(sync)
        elif choice == "2":
            ctx.invoke(status)
        elif choice == "3":
            ctx.invoke(import_data)
        elif choice == "4":
            ctx.invoke(scrape_api)
        elif choice == "0":
            typer.secho("👋 Goodbye!", fg=typer.colors.YELLOW)
            raise typer.Exit(0)
        else:
            typer.secho("❌ Invalid choice. Exiting.", fg=typer.colors.RED)


if __name__ == "__main__":
    app()
