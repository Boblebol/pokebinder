import React, { useState, useEffect } from 'react';
import PkImg from './PkImg.jsx';
import TBadge from './TBadge.jsx';
import Card from './Card.jsx';
import Lbl from './Lbl.jsx';
import {
  STATUS_CONFIG,
  TYPE_COLORS,
  TYPE_WEAKNESSES,
  PDEX,
  STATS,
  TRAINERS,
  PKM
} from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

function getWeak(types) {
  const w = new Set();
  types.forEach(t => (TYPE_WEAKNESSES[t] || []).forEach(x => w.add(x)));
  return [...w];
}

export default function PkDetail({ p, status, col = {}, onBack, onSet, theme, getLoc }) {
  const [ei, setEi] = useState(0);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    setApiData(null);
    setEi(0);
    let dead = false;
    
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}/`).then(r => r.json()).catch(() => null),
      fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}/`).then(r => r.json()).catch(() => null)
    ]).then(([sp, pk]) => {
      if (dead) return;
      const seen = new Set();
      const ents = [];
      (sp?.flavor_text_entries || []).forEach(x => {
        if (x.language.name === 'fr' && !seen.has(x.version.name)) {
          seen.add(x.version.name);
          ents.push({
            g: x.version.name,
            t: x.flavor_text.replace(/[\f\n]/g, ' ')
          });
        }
      });
      setApiData({
        entries: ents.length ? ents : null,
        h: pk?.height ?? null,
        w: pk?.weight ?? null
      });
    });

    return () => {
      dead = true;
    };
  }, [p.id]);

  const loc = getLoc(p.id);
  const weak = getWeak(p.types);
  const chain = p.evoChain || [p.id];
  const entries = PDEX[p.id] || (apiData?.entries) || [{ g: 'Pokédex', t: apiData === null ? 'Chargement…' : 'Aucune donnée.' }];
  const rel = TRAINERS.filter(t => t.team.includes(p.id));
  const tc = TYPE_COLORS[p.types[0]] || '#888888';
  const st = STATS[p.id];
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG[null];

  const cycleStatus = () => {
    const next = !status ? 'en main' : status === 'en main' ? 'rangé' : null;
    onSet(next);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      animation: 'slideIn .26s ease',
      background: theme.bg
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 68,
          left: 14,
          zIndex: 20,
          background: 'rgba(0,0,0,.50)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,.18)',
          color: 'rgba(255,255,255,.92)',
          borderRadius: 20,
          padding: '7px 13px',
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: 'inherit'
        }}
      >
        ← Pokédex
      </button>

      <button
        onClick={cycleStatus}
        style={{
          position: 'absolute',
          top: 68,
          right: 14,
          zIndex: 20,
          background: 'rgba(0,0,0,.50)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${status ? hexToRgba(sc.color, 0.4) : 'rgba(255,255,255,.18)'}`,
          color: status ? sc.color : 'rgba(255,255,255,.92)',
          borderRadius: 20,
          padding: '7px 13px',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          transition: 'all 0.15s'
        }}
      >
        <span>{sc.icon}</span>
        <span>{sc.label}</span>
      </button>

      <div style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{
          background: `linear-gradient(180deg, ${hexToRgba(tc, 0.28)}, transparent 60%)`,
          paddingTop: 68
        }}>
          <div style={{ height: 46 }} />
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
            <PkImg
              p={p}
              sz={170}
              xs={{ filter: `drop-shadow(0 14px 36px ${hexToRgba(tc, 0.65)})` }}
            />
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 14 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: tc,
              marginBottom: 6
            }}>
              No. {String(p.id).padStart(3, '0')}
            </div>
            <div style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: -.5
            }}>
              {p.name}
            </div>
            {apiData?.h != null && (
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 5 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', fontWeight: 600 }}>
                  {(apiData.h / 10).toFixed(1)} m
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.15)' }}>/</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', fontWeight: 600 }}>
                  {(apiData.w / 10).toFixed(1)} kg
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 8 }}>
              {p.types.map(t => (
                <TBadge key={t} type={t} />
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: '8px 14px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          {/* Status Selection */}
          <Card>
            <Lbl>Statut</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              {['rangé', 'en main', null].map(s => {
                const cfg = STATUS_CONFIG[s];
                const on = status === s;
                return (
                  <button
                    key={String(s)}
                    onClick={() => onSet(s)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: 8,
                      border: on ? `2px solid ${cfg.color}` : '1px solid rgba(255,255,255,.12)',
                      background: on ? hexToRgba(cfg.color, 0.15) : 'rgba(255,255,255,.04)',
                      color: on ? cfg.color : 'rgba(255,255,255,.38)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      fontFamily: 'inherit',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Placement in binder */}
          {status === 'rangé' && (
            <Card>
              <Lbl>Classeur {loc.classeur} — {loc.regionName || '?'}</Lbl>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  ['Page', loc.page],
                  ['Côté', loc.side],
                  ['Ligne', loc.row],
                  ['Col.', loc.col]
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(255,255,255,.08)',
                      borderRadius: 8,
                      padding: '7px 10px',
                      textAlign: 'center',
                      flex: '1 1 50px'
                    }}
                  >
                    <div style={{
                      fontSize: 8,
                      color: 'rgba(255,255,255,.30)',
                      fontWeight: 700,
                      letterSpacing: .5,
                      textTransform: 'uppercase',
                      marginBottom: 3
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 11,
                      color: theme.accent
                    }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Weaknesses */}
          <Card>
            <Lbl>Faiblesses</Lbl>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {weak.length ? (
                weak.map(w => <TBadge key={w} type={w} />)
              ) : (
                <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 12 }}>
                  Aucune
                </span>
              )}
            </div>
          </Card>

          {/* Base Stats */}
          {st && (
            <Card>
              <Lbl>Stats de base</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['PV', 'Attaque', 'Défense', 'Atk. Sp.', 'Déf. Sp.', 'Vitesse'].map((lbl, idx) => {
                  const v = st[idx];
                  const pct = Math.min(100, (v / 255) * 100);
                  const barColor = ['#ff5f5f', '#ff8c42', '#f0d060', '#7b8cde', '#7dd9a3', '#80cfff'][idx];
                  return (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 60,
                        fontSize: 9,
                        color: 'rgba(255,255,255,.38)',
                        fontWeight: 600,
                        textAlign: 'right',
                        flexShrink: 0
                      }}>
                        {lbl}
                      </div>
                      <div style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9,
                        color: '#fff',
                        width: 26,
                        textAlign: 'right',
                        flexShrink: 0,
                        lineHeight: 1.6
                      }}>
                        {v}
                      </div>
                      <div style={{
                        flex: 1,
                        height: 5,
                        background: 'rgba(255,255,255,.08)',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: pct + '%',
                          height: '100%',
                          background: barColor,
                          borderRadius: 3
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Evolutions */}
          {chain.length > 1 && (
            <Card>
              <Lbl>Évolutions</Lbl>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
                {chain.flatMap((eid, idx) => {
                  const ep = PKM[eid];
                  if (!ep) return [];
                  const isc = eid === p.id;
                  return [
                    idx > 0 && (
                      <span
                        key={`arr${idx}`}
                        style={{ color: 'rgba(255,255,255,.22)', fontSize: 14, flexShrink: 0 }}
                      >
                        →
                      </span>
                    ),
                    <div
                      key={eid}
                      style={{
                        textAlign: 'center',
                        flexShrink: 0,
                        background: isc ? hexToRgba(tc, 0.18) : 'transparent',
                        borderRadius: 8,
                        padding: '4px 8px',
                        border: isc ? `1px solid ${hexToRgba(tc, 0.38)}` : '1px solid transparent',
                        minWidth: 58,
                        opacity: isc ? 1 : 0.65
                      }}
                    >
                      <PkImg p={ep} sz={46} />
                      <div style={{
                        fontSize: 9,
                        color: isc ? '#fff' : 'rgba(255,255,255,.45)',
                        fontWeight: isc ? 700 : 400,
                        marginTop: 2,
                        lineHeight: 1.3
                      }}>
                        {ep.name}
                      </div>
                    </div>
                  ];
                }).filter(Boolean)}
              </div>
            </Card>
          )}

          {/* Pokédex Entries */}
          <Card>
            <Lbl>Entrées Pokédex</Lbl>
            <div style={{ display: 'flex', gap: 5, marginBottom: 11, overflowX: 'auto' }}>
              {entries.map((en, idx) => (
                <button
                  key={idx}
                  onClick={() => setEi(idx)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    flexShrink: 0,
                    background: ei === idx ? theme.accent : 'rgba(255,255,255,.09)',
                    color: ei === idx ? '#fff' : 'rgba(255,255,255,.42)',
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: 'inherit'
                  }}
                >
                  {en.g}
                </button>
              ))}
            </div>
            <p style={{
              color: 'rgba(255,255,255,.62)',
              fontSize: 13,
              lineHeight: 1.65,
              margin: 0
            }}>
              {entries[ei]?.t}
            </p>
          </Card>

          {/* Related Trainers */}
          {rel.length > 0 && (
            <Card>
              <Lbl>Dresseurs associés</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel.map(tr => {
                  const isTrOk = tr.team.every(id => col[id] === 'rangé' || col[id] === 'en main');
                  return (
                    <div
                      key={tr.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'rgba(255,255,255,.05)',
                        borderRadius: 8
                      }}
                    >
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: hexToRgba(tr.bc, 0.20),
                        border: `2px solid ${hexToRgba(tr.bc, 0.38)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0
                      }}>
                        {isTrOk ? (tr.role === 'Rival' ? '⚔' : tr.role === 'Élite 4' ? '👑' : '🏆') : '🔒'}
                      </div>
                      <div>
                        <div className={isTrOk ? '' : 'blur-locked'} style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                          {tr.name}
                        </div>
                        <div className={isTrOk ? '' : 'blur-locked'} style={{ fontSize: 10, color: 'rgba(255,255,255,.32)' }}>
                          {tr.role} · {tr.city}
                        </div>
                      </div>
                      {tr.badge && (
                        <div className={isTrOk ? '' : 'blur-locked'} style={{
                          marginLeft: 'auto',
                          fontSize: 10,
                          color: tr.bc,
                          fontWeight: 700,
                          background: hexToRgba(tr.bc, 0.18),
                          borderRadius: 6,
                          padding: '3px 7px'
                        }}>
                          {tr.badge}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
