import React, { useState, useEffect } from 'react';
import PkImg from './PkImg.jsx';
import TBadge from './TBadge.jsx';
import Card from './Card.jsx';
import Lbl from './Lbl.jsx';
import {
  STATUS_CONFIG,
  TYPE_COLORS,
  TYPE_LABELS,
  PDEX,
  STATS,
  TRAINERS,
  PKM,
  POKEMON_FORMS,
  getTypeEffectiveness,
  PKM_DETAILS
} from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

function getFormDescription(p, form) {
  const name = form.name;
  const typesStr = form.types.map(t => TYPE_LABELS[t] || t).join('/');
  
  if (name.includes('M\u00e9ga-') || name.includes(' Mega')) {
    return `Sous l'effet de la M\u00e9ga-\u00c9volution, ${name} voit sa puissance d\u00e9cupl\u00e9e. Son type devient ${typesStr} et ses statistiques de combat sont consid\u00e9rablement am\u00e9lior\u00e9es.`;
  }
  if (name.includes('Gigamax')) {
    return `Sous sa forme Gigamax, ${name} atteint une taille gigantesque sous l'influence de l'\u00e9nergie Dynamax. Ses capacit\u00e9s de type principal se transforment en redoutables attaques G-Max.`;
  }
  if (name.includes("Forme d'Alola")) {
    return `Vari\u00e9t\u00e9 de ${p.name} adapt\u00e9e \u00e0 l'archipel d'Alola. Pour survivre dans ce nouvel environnement, ce Pok\u00e9mon a \u00e9volu\u00e9 pour devenir de type ${typesStr}.`;
  }
  if (name.includes("Forme de Galar")) {
    return `Vari\u00e9t\u00e9 de ${p.name} propre \u00e0 la r\u00e9gion de Galar. Son apparence et son comportement ont chang\u00e9, et son type est d\u00e9sormais ${typesStr}.`;
  }
  if (name.includes("Forme de Hisui")) {
    return `Forme ancienne de ${p.name} que l'on trouvait jadis dans la r\u00e9gion de Hisui. Adapt\u00e9 aux rudes conditions de cette \u00e9poque, son type est ${typesStr}.`;
  }
  if (name.includes("Forme de Paldea")) {
    return `Vari\u00e9t\u00e9 de ${p.name} que l'on trouve dans la r\u00e9gion de Paldea. Son mode de vie unique dans cette r\u00e9gion lui conf\u00e8re le type ${typesStr}.`;
  }
  if (name.includes("Forme Originelle")) {
    return `Forme originelle et v\u00e9ritable de ${p.name}, r\u00e9v\u00e9lant sa puissance divine dans sa dimension natale. Son type est ${typesStr}.`;
  }
  
  return `Forme alternative de ${p.name} de type ${typesStr}.`;
}

export default function PkDetail({ p, status, col = {}, onBack, onSet, onNavigate, theme, getLoc }) {
  const [ei, setEi] = useState(0);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    setEi(0);
    setSelectedForm(null);
  }, [p.id]);

  useEffect(() => {
    setEi(0);
  }, [selectedForm]);

  const loc = getLoc(p.id);
  const chain = p.evoChain || [p.id];
  const rel = TRAINERS.filter(t => t.team.includes(p.id));
  const st = selectedForm && selectedForm.stats ? selectedForm.stats : STATS[p.id];
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG[null];

  const currentName = selectedForm ? selectedForm.name : p.name;
  const currentTypes = selectedForm ? selectedForm.types : p.types;
  
  const eff = getTypeEffectiveness(currentTypes);
  const currentWeak = eff.weaknesses.sort((a, b) => b.mult - a.mult);
  const currentResist = eff.resistances.sort((a, b) => a.mult - b.mult);

  const currentImage = selectedForm ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedForm.poke_id}.png` : null;
  const currentTc = TYPE_COLORS[currentTypes[0]] || '#888888';

  const currentHeight = selectedForm && selectedForm.height !== undefined ? selectedForm.height : PKM_DETAILS[p.id]?.h;
  const currentWeight = selectedForm && selectedForm.weight !== undefined ? selectedForm.weight : PKM_DETAILS[p.id]?.w;

  const formEntries = React.useMemo(() => {
    const baseEntries = PDEX[p.id] || [];
    if (selectedForm) {
      const descText = getFormDescription(p, selectedForm);
      return [{ g: 'Forme', t: descText }, ...baseEntries];
    }
    return baseEntries.length ? baseEntries : [{ g: 'Pokédex', t: 'Aucune donnée.' }];
  }, [p, selectedForm]);

  const safeEi = Math.min(ei, formEntries.length - 1);

  const cycleStatus = () => {
    const next = !status ? 'en main' : status === 'en main' ? 'rangé' : null;
    onSet(next);
  };

  const handleEvoClick = (eid) => {
    if (eid !== p.id && onNavigate && PKM[eid]) {
      onNavigate(PKM[eid]);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      animation: 'slideIn .26s ease',
      background: theme.bg,
      zIndex: 10
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
          background: `linear-gradient(180deg, ${hexToRgba(currentTc, 0.28)}, transparent 60%)`,
          paddingTop: 68
        }}>
          <div style={{ height: 46 }} />
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
            <PkImg
              p={p}
              sz={170}
              imgUrl={currentImage}
              xs={{ filter: `drop-shadow(0 14px 36px ${hexToRgba(currentTc, 0.65)})` }}
            />
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 14 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: currentTc,
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
              {currentName}
            </div>
            {currentHeight != null && (
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 5 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', fontWeight: 600 }}>
                  {(currentHeight / 10).toFixed(1)} m
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.15)' }}>/</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', fontWeight: 600 }}>
                  {(currentWeight / 10).toFixed(1)} kg
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 8 }}>
              {currentTypes.map(t => (
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
              {currentWeak.length ? (
                currentWeak.map(w => <TBadge key={w.type} type={w.type} mult={w.mult} />)
              ) : (
                <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 12 }}>
                  Aucune
                </span>
              )}
            </div>
          </Card>

          {/* Resistances */}
          <Card>
            <Lbl>R\u00e9sistances & Immunit\u00e9s</Lbl>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {currentResist.length ? (
                currentResist.map(r => <TBadge key={r.type} type={r.type} mult={r.mult} />)
              ) : (
                <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 12 }}>
                  Aucune
                </span>
              )}
            </div>
          </Card>

          {/* Formes Spéciales */}
          {POKEMON_FORMS[p.id] && POKEMON_FORMS[p.id].length > 0 && (
            <Card>
              <Lbl>Formes alternatives</Lbl>
              <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                WebkitOverflowScrolling: 'touch'
              }}>
                {/* Base Form button */}
                <button
                  onClick={() => { setSelectedForm(null); setEi(0); }}
                  style={{
                    flexShrink: 0,
                    width: 90,
                    padding: '8px',
                    borderRadius: 8,
                    border: selectedForm === null ? `2px solid ${TYPE_COLORS[p.types[0]] || '#888888'}` : '1px solid rgba(255,255,255,.12)',
                    background: selectedForm === null ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.15)',
                    color: selectedForm === null ? '#fff' : 'rgba(255,255,255,.50)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.15s',
                    fontFamily: 'inherit'
                  }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                    alt="Normal"
                    style={{ width: 42, height: 42, objectFit: 'contain' }}
                  />
                  <span style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    Normal
                  </span>
                </button>

                {/* Other Forms */}
                {POKEMON_FORMS[p.id].map(form => {
                  const isActive = selectedForm?.poke_id === form.poke_id;
                  const formTc = TYPE_COLORS[form.types[0]] || '#888888';
                  return (
                    <button
                      key={form.poke_id}
                      onClick={() => { setSelectedForm(form); setEi(0); }}
                      style={{
                        flexShrink: 0,
                        width: 90,
                        padding: '8px',
                        borderRadius: 8,
                        border: isActive ? `2px solid ${formTc}` : '1px solid rgba(255,255,255,.12)',
                        background: isActive ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.15)',
                        color: isActive ? '#fff' : 'rgba(255,255,255,.50)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.15s',
                        fontFamily: 'inherit'
                      }}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.poke_id}.png`}
                        alt={form.name}
                        style={{ width: 42, height: 42, objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
                        }}
                      />
                      <span style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        {form.name.replace(p.name, '').trim() || 'Alternative'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

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
                    <button
                       key={eid}
                       disabled={isc}
                       onClick={() => handleEvoClick(eid)}
                       style={{
                         textAlign: 'center',
                         flexShrink: 0,
                         background: isc ? hexToRgba(currentTc, 0.18) : 'transparent',
                         borderRadius: 8,
                         padding: '4px 8px',
                         border: isc ? `1px solid ${hexToRgba(currentTc, 0.38)}` : '1px solid transparent',
                         minWidth: 58,
                         opacity: isc ? 1 : 0.75,
                         cursor: isc ? 'default' : 'pointer',
                         fontFamily: 'inherit',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: 2,
                         transition: 'all 0.15s'
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
                     </button>
                  ];
                }).filter(Boolean)}
              </div>
            </Card>
          )}

          {/* Pokédex Entries */}
          <Card>
            <Lbl>Entrées Pokédex</Lbl>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,.08)'
            }}>
              {formEntries.map((en, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    borderBottom: idx < formEntries.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.05)'
                  }}
                >
                  <div style={{
                    width: 95,
                    padding: '12px 10px',
                    background: 'rgba(255,255,255,.02)',
                    borderRight: '1px solid rgba(255,255,255,.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: theme.accent,
                      textAlign: 'center',
                      lineHeight: 1.3
                    }}>
                      {en.g}
                    </span>
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '12px 14px',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,.75)'
                  }}>
                    {en.t}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Related Trainers – only shown when fully unlocked */}
          {rel.filter(tr => tr.team.every(id => col[id] === 'rangé' || col[id] === 'en main')).length > 0 && (
            <Card>
              <Lbl>Dresseurs associés</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel
                  .filter(tr => tr.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
                  .map(tr => (
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
                        {tr.role === 'Rival' ? '⚔' : tr.role === 'Élite 4' ? '👑' : '🏆'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                          {tr.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.32)' }}>
                          {tr.role} · {tr.city}
                        </div>
                      </div>
                      {tr.badge && (
                        <div style={{
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
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
