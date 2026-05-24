import React, { useState, useMemo } from 'react';
import { REGIONS, PLIST, TRAINERS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function DashboardScreen({ col, setCol, theme }) {
  const [rTab, setRTab] = useState('global');
  const RTABS = [
    { id: 'global', l: '🌍 Tout' },
    { id: 'kanto', l: '🔴 Kanto' },
    { id: 'johto', l: '⭐ Johto' },
    { id: 'hoenn', l: '💚 Hoenn' }
  ];

  const s = useMemo(() => {
    const reg = REGIONS.find(r => r.id === rTab);
    const base = reg ? PLIST.filter(p => p.id >= reg.range[0] && p.id <= reg.range[1]) : PLIST;
    const rv = base.map(p => col[p.id]);
    const r = rv.filter(s => s === 'rangé').length;
    const m = rv.filter(s => s === 'en main').length;
    const t = base.length;
    const trnrsBase = reg ? TRAINERS.filter(tr => tr.region === rTab) : TRAINERS;
    const ub = trnrsBase.filter(tr => tr.badge && tr.team.every(id => col[id] === 'rangé' || col[id] === 'en main')).length;
    const tb = trnrsBase.filter(tr => tr.badge).length;
    
    return {
      r,
      m,
      t,
      pct: Math.round(((r + m) / t) * 100) || 0,
      ub,
      tb
    };
  }, [col, rTab]);

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
    reader.readAsText(file);
    // Reset file input so user can import the same file again if needed
    event.target.value = '';
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

        {/* Badges progression */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 14,
          border: '1px solid rgba(255,255,255,.07)'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            Badges débloqués
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>🏅</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: theme.accent }}>
                  {String(s.ub)}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.25)' }}>
                  /{s.tb}
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${s.tb ? ((s.ub / s.tb) * 100) : 0}%`,
                  background: theme.accent,
                  borderRadius: 3
                }} />
              </div>
            </div>
          </div>
        </div>

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
