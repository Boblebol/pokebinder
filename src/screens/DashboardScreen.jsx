import React, { useState, useMemo, useCallback } from 'react';
import { REGIONS, PLIST, BADGES, ACHIEVEMENTS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function DashboardScreen({ col, setCol, theme }) {
  const [rTab, setRTab] = useState('global');
  
  const RTABS = [
    { id: 'global', l: '🌍 Tout' },
    { id: 'kanto', l: '🔴 Kanto' },
    { id: 'johto', l: '⭐ Johto' },
    { id: 'hoenn', l: '💚 Hoenn' },
    { id: 'sinnoh', l: '❄️ Sinnoh' },
    { id: 'unys', l: '⛰️ Unys' },
    { id: 'kalos', l: '⚜️ Kalos' },
    { id: 'alola', l: '☀️ Alola' },
    { id: 'meltan', l: '🔩 Meltan' },
    { id: 'galar', l: '🛡️ Galar' },
    { id: 'hisui', l: '🗻 Hisui' },
    { id: 'paldea', l: '🍊 Paldea' }
  ];

  const isBadgeUnlocked = useCallback((badge) => {
    const enc = badge.encounters[0];
    if (!enc) return false;
    const ids = [...new Set(enc.team.map(m => m.id).filter(Boolean))];
    return ids.length > 0 && ids.every(id => col[id] === 'rangé' || col[id] === 'en main');
  }, [col]);

  const mapAchRegionToBadgeRegion = (achRegion) => {
    switch (achRegion) {
      case 'kanto': return 'kanto';
      case 'johto': return 'gs';
      case 'hoenn': return 'rs';
      case 'sinnoh': return 'dp';
      case 'unys': return 'bw';
      case 'kalos': return 'xy';
      case 'alola': return 'sm';
      case 'galar': return 'swsh';
      case 'paldea': return 'sv';
      default: return achRegion;
    }
  };

  const normalizedBadges = useMemo(() => {
    return BADGES.map(b => {
      if (b.region === 'johto') {
        return { ...b, region: 'gs' };
      }
      return b;
    });
  }, []);

  const s = useMemo(() => {
    const reg = REGIONS.find(r => r.id === rTab);
    const base = reg ? PLIST.filter(p => p.id >= reg.range[0] && p.id <= reg.range[1]) : PLIST;
    const rv = base.map(p => col[p.id]);
    const r = rv.filter(st => st === 'rangé').length;
    const m = rv.filter(st => st === 'en main').length;
    const t = base.length;
    
    // Badges calculation
    const regionBadges = rTab === 'global'
      ? normalizedBadges
      : normalizedBadges.filter(b => b.region === rTab);
    const ub = regionBadges.filter(isBadgeUnlocked).length;
    const tb = regionBadges.length;

    // Achievements calculation
    const regionAchs = rTab === 'global'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter(ach => ach.region && mapAchRegionToBadgeRegion(ach.region) === rTab);

    const getAchCat = (ach) => {
      if (ach.type === 'starters') return 'starters';
      if (ach.type === 'prof') return 'prof';
      if (ach.type === 'gyms') return 'gyms';
      if (ach.type === 'meta') return 'meta';
      if (ach.type === 'stade') return 'stade';
      if (ach.type === 'special') return 'special';
      return 'autre';
    };

    const achStats = {
      starters: { cur: 0, total: 0, label: 'Starters complets', icon: '🌱' },
      prof: { cur: 0, total: 0, label: 'Félicitations Profs', icon: '🎓' },
      gyms: { cur: 0, total: 0, label: 'Succès Arènes', icon: '🏅' },
      meta: { cur: 0, total: 0, label: 'Meta-Badges Pokédex', icon: '📖' },
      stade: { cur: 0, total: 0, label: 'Milestones', icon: '💯' },
      special: { cur: 0, total: 0, label: 'Succès Spéciaux', icon: '👑' },
    };

    regionAchs.forEach(ach => {
      const cat = getAchCat(ach);
      if (achStats[cat]) {
        achStats[cat].total += 1;
        if (ach.check(col)) {
          achStats[cat].cur += 1;
        }
      }
    });
    
    return {
      r,
      m,
      t,
      pct: Math.round(((r + m) / t) * 100) || 0,
      ub,
      tb,
      achStats: Object.entries(achStats)
        .map(([key, data]) => ({ key, ...data }))
        .filter(cat => cat.total > 0)
    };
  }, [col, rTab, normalizedBadges, isBadgeUnlocked]);

  const R = 68;
  const ST = 13;
  const circ = 2 * Math.PI * R;
  const off = circ - (s.pct / 100) * circ;

  const handleExport = () => {
    const d = JSON.stringify({ collection: col, version: '1.0' }, null, 2);
    const bl = new Blob([d], { type: 'application/json' });
    const u = URL.createObjectURL(bl);
    const link = document.createElement('a');
    link.href = u;
    link.download = 'pokeclasseur.json';
    link.click();
    URL.revokeObjectURL(u);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed && typeof parsed.collection === 'object') {
          // Merge with current in case file lacks some keys
          setCol(prev => ({
            ...prev,
            ...parsed.collection
          }));
          alert('✓ Collection importée avec succès !');
        } else {
          alert('Format de fichier invalide (attribut "collection" manquant).');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.onloadend = () => {
      // Clean up input value
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: 'auto', padding: '2px 16px 24px' }}>
        
        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
            STATS
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
            Ma Progression
          </div>
        </div>

        {/* Region tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
          {RTABS.map(rt => (
            <button
              key={rt.id}
              onClick={() => setRTab(rt.id)}
              style={{
                padding: '5px 13px',
                borderRadius: 20,
                flexShrink: 0,
                border: rTab === rt.id ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                background: rTab === rt.id ? hexToRgba(theme.accent, 0.14) : 'transparent',
                color: rTab === rt.id ? theme.accent : 'rgba(255,255,255,.42)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'inherit',
                transition: 'all 0.15s'
              }}
            >
              {rt.l}
            </button>
          ))}
        </div>

        {/* Circular gauge */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 16,
          padding: '24px 20px',
          marginBottom: 12,
          border: '1px solid rgba(255,255,255,.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <svg width={175} height={175} style={{ overflow: 'visible' }}>
            <circle cx={87.5} cy={87.5} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={ST} />
            <circle
              cx={87.5}
              cy={87.5}
              r={R}
              fill="none"
              stroke={theme.accent}
              strokeWidth={ST}
              strokeDasharray={circ}
              strokeDashoffset={off}
              strokeLinecap="round"
              transform="rotate(-90 87.5 87.5)"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
            <text x={87.5} y={82} textAnchor="middle" fill="#fff" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 24 }}>
              {s.pct}%
            </text>
            <text x={87.5} y={102} textAnchor="middle" fill="rgba(255,255,255,.35)" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}>
              complet
            </text>
          </svg>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 8 }}>
            {s.r + s.m}
            <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 16 }}> / {s.t}</span>
          </div>
        </div>

        {/* Storage State grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
          {[
            { l: 'Rangé', v: s.r, c: '#22c55e', i: '✓' },
            { l: 'En main', v: s.m, c: '#f59e0b', i: '✋' },
            { l: 'Manquant', v: s.t - s.r - s.m, c: 'rgba(255,255,255,.25)', i: '○' }
          ].map(x => (
            <div
              key={x.l}
              style={{
                background: 'rgba(255,255,255,.05)',
                borderRadius: 12,
                padding: '14px 10px',
                border: `1px solid ${hexToRgba(x.c.startsWith('#') ? x.c : '#888888', 0.14)}`,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{x.i}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 15, color: x.c, lineHeight: 1.2, marginBottom: 4 }}>
                {String(x.v)}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Objectifs & Succès progression */}
        {(s.tb > 0 || s.achStats.length > 0) && (
          <div style={{
            background: 'rgba(255,255,255,.05)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 14,
            border: '1px solid rgba(255,255,255,.07)'
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              Objectifs & Succès
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Badges card */}
              {s.tb > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 32 }}>🏅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Badges Débloqués</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: theme.accent }}>
                          {s.ub}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
                          /{s.tb}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(s.ub / s.tb) * 100}%`,
                        background: theme.accent,
                        borderRadius: 3
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements cards */}
              {s.achStats.map(cat => {
                const color = cat.key === 'starters' ? '#4ade80' :
                              cat.key === 'prof' ? '#f472b6' :
                              cat.key === 'gyms' ? '#38bdf8' :
                              cat.key === 'meta' ? '#fb923c' :
                              cat.key === 'stade' ? '#22d3ee' : '#a78bfa';

                const pct = cat.total ? Math.round((cat.cur / cat.total) * 100) : 0;

                return (
                  <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                    <span style={{ fontSize: 32 }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{cat.label}</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: color }}>
                            {cat.cur}
                          </span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
                            /{cat.total}
                          </span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: color,
                          borderRadius: 3
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Export / Import Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 12,
              cursor: 'pointer',
              border: `1px solid ${hexToRgba(theme.accent, 0.44)}`,
              background: hexToRgba(theme.accent, 0.14),
              color: theme.accent,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s'
            }}
          >
            📤 Exporter ma collection (JSON)
          </button>

          <label style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.2s, border-color 0.2s'
          }}>
            📥 Importer une collection (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
