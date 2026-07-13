import React, { useState, useMemo } from 'react';
import PkImg from '../components/PkImg.jsx';
import { REGIONS, PKM, BCFG, TYPE_COLORS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function BindersScreen({ col, setCol, bcfg, theme, getLoc }) {
  const [ai, setAi] = useState(0);
  const cfg = bcfg || BCFG;
  const rt = REGIONS[ai] || REGIONS[0];

  const pages = useMemo(() => {
    const pm = {};
    Object.values(PKM).forEach(p => {
      const loc = getLoc(p.id);
      if (loc.classeurIdx !== rt.ci) return;
      const pg = loc.page;
      if (!pm[pg]) {
        pm[pg] = {
          R: Array(cfg.gridRows * cfg.gridCols).fill(null),
          V: Array(cfg.gridRows * cfg.gridCols).fill(null)
        };
      }
      const idx = (loc.row - 1) * cfg.gridCols + (loc.col - 1);
      const side = loc.side === 'Recto' ? 'R' : 'V';
      if (idx < cfg.gridRows * cfg.gridCols) {
        pm[pg][side][idx] = { ...p, status: col[p.id] };
      }
    });
    return Object.keys(pm).map(Number).sort((a, b) => a - b).map(n => ({ n, ...pm[n] }));
  }, [col, getLoc, rt.ci, cfg.gridRows, cfg.gridCols]);

  const sc = s => s === 'rangé' ? '#22c55e' : s === 'en main' ? '#f59e0b' : 'rgba(255,255,255,.06)';
  const cap = pages.reduce((a, pg) => a + pg.R.filter(c => c && c.status).length + pg.V.filter(c => c && c.status).length, 0);
  const tot = pages.reduce((a, pg) => a + pg.R.filter(Boolean).length + pg.V.filter(Boolean).length, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />
      
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '2px 16px 8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
          CLASSEURS
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {rt.name}
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', fontWeight: 400 }}>
            {cap}/{tot}
          </span>
        </div>
        
        {/* Region tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {REGIONS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setAi(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 10,
                flexShrink: 0,
                border: ai === i ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                background: ai === i ? hexToRgba(theme.accent, 0.14) : 'rgba(255,255,255,.05)',
                color: ai === i ? theme.accent : 'rgba(255,255,255,.42)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'inherit'
              }}
            >
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9 }}>
                {String.fromCharCode(65 + r.ci)}
              </span>
              {' — '}{r.name}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          {[
            { c: '#22c55e', l: 'Rangé' },
            { c: '#f59e0b', l: 'En main' },
            { c: 'rgba(255,255,255,.25)', l: 'Manquant' }
          ].map(x => (
            <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pages list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 24px' }}>
        {pages.map(pg => (
          <div 
            key={pg.n} 
            data-tour={pg.n === 1 ? "binder-page" : undefined}
            style={{ marginBottom: 16 }}
          >
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Page {pg.n}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['R', 'V'].map(k => (
                <div key={k} style={{
                  flex: 1,
                  background: 'rgba(255,255,255,.04)',
                  borderRadius: 10,
                  padding: 8,
                  border: '1px solid rgba(255,255,255,.07)'
                }}>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,.25)', fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase', marginBottom: 6 }}>
                    {k === 'R' ? 'Recto' : 'Verso'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cfg.gridCols}, 1fr)`, gap: 3 }}>
                    {pg[k].map((cell, ci) => {
                      if (!cell) {
                        return (
                          <div
                            key={ci}
                            style={{
                              aspectRatio: '1',
                              borderRadius: 3,
                              background: 'rgba(255,255,255,.03)',
                              border: '1px dashed rgba(255,255,255,.08)'
                            }}
                          />
                        );
                      }
                      const iok = cell.status === 'rangé' || cell.status === 'en main';
                      const tc2 = TYPE_COLORS[cell.types[0]] || '#888888';
                      return (
                        <div
                          key={ci}
                          title={`#${String(cell.id).padStart(3, '0')} ${cell.name}`}
                          onClick={() => {
                            if (setCol) {
                              const currentStatus = cell.status;
                              const nextStatus = !currentStatus ? 'en main' : currentStatus === 'en main' ? 'rangé' : null;
                              setCol(prev => ({ ...prev, [cell.id]: nextStatus }));
                            }
                          }}
                          style={{
                            aspectRatio: '1',
                            borderRadius: 3,
                            background: iok ? hexToRgba(tc2, 0.12) : 'rgba(255,255,255,.04)',
                            border: `1px solid ${iok ? hexToRgba(sc(cell.status), 0.5) : 'rgba(255,255,255,.07)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'all 0.1s'
                          }}
                          onPointerDown={(ev) => {
                            ev.currentTarget.style.transform = 'scale(0.92)';
                          }}
                          onPointerUp={(ev) => {
                            ev.currentTarget.style.transform = 'scale(1)';
                          }}
                          onPointerLeave={(ev) => {
                            ev.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <PkImg
                            p={cell}
                            sz={28}
                            xs={{ borderRadius: 3, opacity: iok ? 1 : 0.12 }}
                          />
                          {iok && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 2,
                              background: sc(cell.status)
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,.15)',
            padding: '40px 0',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            lineHeight: 2.5
          }}>
            Classeur vide
          </div>
        )}
      </div>
    </div>
  );
}
