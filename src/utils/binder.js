import { REGIONS } from '../data/regions.js';

/**
 * Traduit un slot d'affichage indexé à 0 en coordonnées physiques dans un classeur.
 */
export function slotToLoc(slot, cfg, ci) {
  const ps = cfg.gridRows * cfg.gridCols; // Cartes par page (ex: 3x3 = 9)
  const pp = ps * 2;                     // Cartes par page recto/verso (ex: 18)
  const pb = pp * cfg.pagesPerBinder;    // Cartes par classeur physique (ex: 180)
  
  const b = (ci || 0) + Math.floor(slot / pb);
  const bi = slot % pb;
  const pg = Math.floor(bi / pp) + 1;
  const si = Math.floor((bi % pp) / ps);
  const pos = bi % ps;
  
  return {
    classeur: String.fromCharCode(65 + b),
    classeurIdx: b,
    page: pg,
    side: si === 0 ? 'Recto' : 'Verso',
    row: Math.floor(pos / cfg.gridCols) + 1,
    col: (pos % cfg.gridCols) + 1
  };
}

/**
 * Calcule les positions de tous les Pokémon de la liste en fonction des règles de tri.
 */
export function computeSnap(list, fRule, cfg) {
  const snap = {};
  REGIONS.forEach(r => {
    // Pokémon de la région active
    const rp = list.filter(p => p.id >= r.range[0] && p.id <= r.range[1]);
    let slot = 0, i = 0;
    
    while (i < rp.length) {
      const p = rp[i];
      const cids = new Set(p.evoChain || [p.id]);
      
      // Trouver tous les membres de la chaîne d'évolution dans la liste de cette région
      let j = i;
      while (j < rp.length && cids.has(rp[j].id)) j++;
      const fs = j - i; // Taille de la famille présente
      
      // Règle famille : si activée et famille > 1
      if (fRule && fs > 1) {
        const pr = slot % cfg.gridCols;
        // Si la famille dépasse de la ligne courante, on saute à la ligne suivante
        if (pr !== 0 && pr + fs > cfg.gridCols) {
          slot += (cfg.gridCols - pr);
        }
      }
      
      // Placer chaque membre de la famille
      for (let k = i; k < j; k++) {
        snap[rp[k].id] = {
          ...slotToLoc(slot++, cfg, r.ci),
          regionName: r.name
        };
      }
      
      i = j;
    }
  });
  return snap;
}
