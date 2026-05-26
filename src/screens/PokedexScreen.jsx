import React, { useState, useMemo } from 'react';
import PkCard from '../components/PkCard.jsx';
import PkDetail from '../components/PkDetail.jsx';
import { PLIST, REGIONS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function PokedexScreen({ col, setCol, theme, getLoc }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [sel, setSel] = useState(null);
  const [dexMode, setDexMode] = useState('national');
  const [regionId, setRegionId] = useState(REGIONS[0].id);

  const base = useMemo(() => {
    if (dexMode === 'national') return PLIST;
    if (dexMode === 'regional') {
      const r = REGIONS.find(x => x.id === regionId) || REGIONS[0];
      return PLIST.filter(p => p.id >= r.range[0] && p.id <= r.range[1]);
    }
    return PLIST;
  }, [dexMode, regionId]);

  const filtered = useMemo(() => base.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
    }
    const s = col[p.id];
    if (filter === 'rangé' && s !== 'rangé') return false;
    if (filter === 'en main' && s !== 'en main') return false;
    if (filter === 'manquant' && s) return false;
    return true;
  }), [base, search, filter, col]);

  const cnt = useMemo(() => {
    const v = base.map(p => col[p.id]);
    return {
      r: v.filter(s => s === 'rangé').length,
      m: v.filter(s => s === 'en main').length,
      t: base.length
    };
  }, [base, col]);



  const FLTS = [
    { k: 'tous', l: 'Tous', c: theme.accent },
    { k: 'rangé', l: '✓ Rangé', c: '#22c55e' },
    { k: 'en main', l: '✋ En main', c: '#f59e0b' },
    { k: 'manquant', l: 'Manquant', c: 'rgba(255,255,255,.35)' }
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />
      
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '2px 16px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
              POKÉDEX
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
              {cnt.r + cnt.m}
              <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 16 }}>/{cnt.t}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 4 }}>
            {[
              { c: '#22c55e', v: cnt.r },
              { c: '#f59e0b', v: cnt.m },
              { c: 'rgba(255,255,255,.2)', v: cnt.t - cnt.r - cnt.m }
            ].map((x, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,.45)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: x.c, display: 'inline-block' }} />
                {String(x.v)}
              </span>
            ))}
          </div>
        </div>

        {/* Pokedex Mode Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.07)', borderRadius: 10, padding: 3, marginBottom: 8 }}>
          {[
            { id: 'national', l: 'National' },
            { id: 'regional', l: 'Régional' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setDexMode(m.id)}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 7,
                border: 'none',
                background: dexMode === m.id ? theme.accent : 'transparent',
                color: dexMode === m.id ? '#fff' : 'rgba(255,255,255,.38)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {m.l}
            </button>
          ))}
        </div>

        {/* Region tabs (visible in regional mode only) */}
        {dexMode === 'regional' && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 4 }}>
            {REGIONS.map(r => (
              <button
                key={r.id}
                onClick={() => setRegionId(r.id)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  flexShrink: 0,
                  border: regionId === r.id ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                  background: regionId === r.id ? hexToRgba(theme.accent, 0.14) : 'transparent',
                  color: regionId === r.id ? theme.accent : 'rgba(255,255,255,.42)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}


        <div style={{
          background: 'rgba(255,255,255,.08)',
          borderRadius: 10,
          padding: '9px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
          border: '1px solid rgba(255,255,255,.1)'
        }}>
          <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={ev => setSearch(ev.target.value)}
            placeholder="Nom ou numéro..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 13,
              flex: 1,
              fontFamily: 'inherit'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,.35)',
                cursor: 'pointer',
                fontSize: 14,
                padding: 0
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {FLTS.map(f => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                flexShrink: 0,
                border: filter === f.k ? `1px solid ${f.c}` : '1px solid rgba(255,255,255,.12)',
                background: filter === f.k ? hexToRgba(f.c.startsWith('#') ? f.c : '#888888', 0.14) : 'transparent',
                color: filter === f.k ? f.c : 'rgba(255,255,255,.42)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'inherit'
              }}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.22)', marginTop: 5 }}>
          {filtered.length} Pokémon
        </div>
      </div>

      {/* Scroll Container */}
      <div style={{
        flex: '1 1 0%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '4px 14px 14px'
      }}>
        {/* Grid Child */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          alignContent: 'start'
        }}>
          {filtered.map(p => (
            <PkCard
              key={p.id}
              p={p}
              status={col[p.id]}
              onTap={setSel}
              onStatusCycle={(next) => setCol(c => ({ ...c, [p.id]: next }))}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,.22)',
            padding: '40px 0',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            lineHeight: 2.5
          }}>
            Aucun résultat
          </div>
        )}
      </div>

      {/* Detail Overlay */}
      {sel && (
        <PkDetail
          p={sel}
          status={col[sel.id]}
          col={col}
          onBack={() => {
            const lastId = sel.id;
            setSel(null);
            setTimeout(() => {
              const el = document.getElementById(`pk-card-${lastId}`);
              if (el) {
                el.scrollIntoView({ block: 'start', behavior: 'auto' });
              }
            }, 0);
          }}
          onSet={(s) => setCol(c => ({ ...c, [sel.id]: s }))}
          onNavigate={(nextP) => setSel(nextP)}
          theme={theme}
          getLoc={getLoc}
        />
      )}
    </div>
  );
}
