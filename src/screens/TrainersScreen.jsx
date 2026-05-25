import React, { useState } from 'react';
import PkImg from '../components/PkImg.jsx';
import { TRAINERS, ACHIEVEMENTS, PKM, TYPE_COLORS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

const REGION_CFG = {
  kanto: { l: '🔴 Kanto' },
  johto: { l: '⭐ Johto' },
  gs: { l: '🌟 Johto (GSC)' },
  rs: { l: '💚 Hoenn' },
  dp: { l: '❄️ Sinnoh' },
  bw: { l: '⛰️ Unys' },
  b2w2: { l: '🏢 Unys 2' },
  xy: { l: '⚜️ Kalos' },
  sm: { l: '☀️ Alola' },
  swsh: { l: '🛡️ Galar' },
  sv: { l: '🍊 Paldea' }
};

export default function TrainersScreen({ col, theme }) {
  const [sel, setSel] = useState(null);
  const [rTab, setRTab] = useState('kanto');

  const ok = t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main');

  const pg = t => {
    const u = [...new Set(t.team)];
    return {
      c: u.filter(id => col[id] === 'rangé' || col[id] === 'en main').length,
      t: u.length
    };
  };

  const visTrnrs = rTab === 'global' ? [] : TRAINERS.filter(t => t.region === rTab);
  const ub = visTrnrs.filter(t => t.badge && ok(t)).length;
  const tb = visTrnrs.filter(t => t.badge).length;

  const RTABS = [
    ...Object.entries(REGION_CFG).map(([id, cfg]) => ({ id, l: cfg.l })),
    { id: 'global', l: '🌍 Tout' }
  ];

  if (sel) {
    const bc = sel.bc;
    const isOk = ok(sel);
    const prg = pg(sel);
    const team = [...new Set(sel.team)];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', animation: 'slideIn .26s ease', background: theme.bg }}>
        <div className="trainer-header" style={{ background: `linear-gradient(180deg, ${hexToRgba(bc, 0.20)}, transparent 55%)`, padding: '68px 16px 20px' }}>
          <button
            onClick={() => setSel(null)}
            style={{
              background: 'rgba(255,255,255,.1)',
              border: 'none',
              color: 'rgba(255,255,255,.8)',
              borderRadius: 20,
              padding: '7px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit'
            }}
          >
            ← Dresseurs
          </button>
          
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${hexToRgba(bc, 0.30)}, ${hexToRgba(bc, 0.14)})`,
              border: `3px solid ${hexToRgba(bc, 0.48)}`,
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36
            }}>
              {sel.role === 'Rival' ? '⚔️' : sel.role === 'Élite 4' ? '👑' : '🏆'}
            </div>
            <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{sel.name}</div>
            <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>
              {sel.role} · {sel.city}
            </div>
            <p className={isOk ? '' : 'blur-locked'} style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, lineHeight: 1.55, margin: '10px auto 0', maxWidth: 280 }}>
              {sel.desc}
            </p>
          </div>

          {sel.badge && (
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: isOk ? hexToRgba(bc, 0.18) : 'rgba(255,255,255,.06)',
                border: `1px solid ${isOk ? hexToRgba(bc, 0.42) : 'rgba(255,255,255,.12)'}`,
                borderRadius: 24,
                padding: '10px 18px'
              }}>
                <span style={{ fontSize: 24 }}>{isOk ? '🏅' : '🔒'}</span>
                <div>
                  <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 13, fontWeight: 700, color: isOk ? bc : 'rgba(255,255,255,.4)' }}>
                    Badge {sel.badge}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
                    {isOk ? 'Débloqué !' : `${prg.c}/${prg.t} capturés`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '0 14px 24px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            Équipe
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {team.map(pid => {
              const p = PKM[pid];
              if (!p) return null;
              const s = col[pid];
              const iok = s === 'rangé' || s === 'en main';
              const tc = TYPE_COLORS[p.types[0]] || '#888888';

              return (
                <div
                  key={pid}
                  className={iok ? '' : 'blur-locked'}
                  style={{
                    background: 'rgba(255,255,255,.05)',
                    borderRadius: 10,
                    padding: 10,
                    textAlign: 'center',
                    border: `1px solid ${iok ? hexToRgba(tc, 0.32) : 'rgba(255,255,255,.07)'}`,
                    opacity: iok ? 1 : 0.42,
                    position: 'relative'
                  }}
                >
                  {iok && (
                    <div style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: s === 'rangé' ? '#22c55e' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                      color: '#fff',
                      fontWeight: 700
                    }}>
                      ✓
                    </div>
                  )}
                  <PkImg p={p} sz={52} />
                  <div style={{ fontSize: 9, color: '#fff', fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>
                    {p.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />
      <div style={{ flexShrink: 0, padding: '2px 16px 8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
          DRESSEURS
        </div>
        {rTab !== 'global' ? (
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
            Badges{' '}
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: theme.accent }}>
              {String(ub)}
            </span>
            <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 16 }}>/{tb}</span>
          </div>
        ) : (
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
            Succès
            <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 16 }}> toutes régions</span>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
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
      </div>

      {rTab !== 'global' ? (
        <div style={{ flex: '1 1 0%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 14px 14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, alignContent: 'start' }}>
            {visTrnrs.map(tr => {
            const isOk = ok(tr);
            const prg = pg(tr);
            const bc = tr.bc;

            return (
              <div
                key={tr.id}
                onClick={() => setSel(tr)}
                className="trainer-card"
                style={{
                  background: 'rgba(255,255,255,.05)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `1px solid ${isOk ? hexToRgba(bc, 0.38) : 'rgba(255,255,255,.08)'}`,
                  transition: 'transform 0.12s'
                }}
                onPointerDown={ev => {
                  ev.currentTarget.style.transform = 'scale(0.96)';
                }}
                onPointerUp={ev => {
                  ev.currentTarget.style.transform = 'scale(1)';
                }}
                onPointerLeave={ev => {
                  ev.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ height: 3, background: isOk ? bc : 'rgba(255,255,255,.08)' }} />
                <div style={{ padding: '12px 14px 10px' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: isOk ? hexToRgba(bc, 0.18) : 'rgba(255,255,255,.07)',
                      border: `2px solid ${isOk ? hexToRgba(bc, 0.45) : 'rgba(255,255,255,.12)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}>
                      {isOk ? '🏅' : '🔒'}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: isOk ? bc : 'rgba(255,255,255,.25)', lineHeight: 1 }}>
                        {String(prg.c)}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
                        /{prg.t}
                      </div>
                    </div>
                  </div>
                  
                  <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{tr.name}</div>
                  <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 10, color: 'rgba(255,255,255,.38)' }}>{tr.role}</div>
                  {tr.badge && (
                    <div className={isOk ? '' : 'blur-locked'} style={{ fontSize: 10, color: isOk ? bc : 'rgba(255,255,255,.22)', marginTop: 3, fontWeight: 600 }}>
                      Badge {tr.badge}
                    </div>
                  )}
                  <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(prg.c / prg.t) * 100}%`, background: isOk ? bc : 'rgba(255,255,255,.25)', borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        <div style={{ flex: '1 1 0%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 14px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, alignContent: 'start' }}>
            {ACHIEVEMENTS.map(ach => {
              const isOk = ach.check(col);
              const cl = ach.color;
              const deps = ach.id === 'grand-maitre' ? ACHIEVEMENTS.filter(a => a.id.startsWith('champ-')) : [];

              return (
                <div
                  key={ach.id}
                  style={{
                    background: 'rgba(255,255,255,.05)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: `1px solid ${isOk ? hexToRgba(cl, 0.38) : 'rgba(255,255,255,.08)'}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: 3, background: isOk ? cl : 'rgba(255,255,255,.08)' }} />
                  <div style={{ padding: '12px 14px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: isOk ? hexToRgba(cl, 0.18) : 'rgba(255,255,255,.07)',
                        border: `2px solid ${isOk ? hexToRgba(cl, 0.45) : 'rgba(255,255,255,.12)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20
                      }}>
                        {isOk ? ach.icon : '🔒'}
                      </div>
                      {isOk ? (
                        <div style={{
                          fontSize: 9,
                          color: cl,
                          fontWeight: 700,
                          background: hexToRgba(cl, 0.12),
                          borderRadius: 6,
                          padding: '3px 7px',
                          border: `1px solid ${hexToRgba(cl, 0.25)}`
                        }}>
                          Obtenu
                        </div>
                      ) : (
                        <div style={{
                          fontSize: 9,
                          color: 'rgba(255,255,255,.25)',
                          fontWeight: 700,
                          background: 'rgba(255,255,255,.04)',
                          borderRadius: 6,
                          padding: '3px 7px',
                          border: '1px solid rgba(255,255,255,.08)'
                        }}>
                          Bloqu\u00e9
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                      {ach.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.38)', lineHeight: 1.4, flex: 1, marginBottom: deps.length ? 10 : 0 }}>
                      {ach.desc}
                    </div>

                    {deps.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 'auto', flexWrap: 'wrap' }}>
                        {deps.map(dep => {
                          const dok = dep.check(col);
                          const dc = dep.color;
                          return (
                            <div
                              key={dep.id}
                              title={dep.label}
                              style={{
                                flex: 1,
                                minWidth: 30,
                                padding: '6px 4px',
                                borderRadius: 6,
                                background: dok ? hexToRgba(dc, 0.1) : 'rgba(255,255,255,.04)',
                                border: `1px solid ${dok ? hexToRgba(dc, 0.28) : 'rgba(255,255,255,.08)'}`,
                                textAlign: 'center',
                                fontSize: 13
                              }}
                            >
                              {dok ? dep.icon : '🔒'}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
