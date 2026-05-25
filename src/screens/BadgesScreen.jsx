import React, { useState, useMemo } from 'react';
import PkImg from '../components/PkImg.jsx';
import { BADGES } from '../data/badges.js';
import { PKM, STATS, TYPE_COLORS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

const REGION_LABELS = {
  kanto:  { l: '🔴 Kanto',  order: 1 },
  johto:  { l: '⭐ Johto',  order: 2 },
  hoenn:  { l: '💚 Hoenn',  order: 3 },
  sinnoh: { l: '❄️ Sinnoh', order: 4 },
  unova:  { l: '⛰️ Unys',   order: 5 },
  kalos:  { l: '⚜️ Kalos',  order: 6 },
  alola:  { l: '☀️ Alola',  order: 7 },
  galar:  { l: '🛡️ Galar',  order: 8 },
  hisui:  { l: '🗻 Hisui',  order: 9 },
  paldea: { l: '🍊 Paldea', order: 10 },
};

const STAT_LABELS = ['PV', 'Atk', 'Déf', 'Atk.S', 'Dé.S', 'Vit'];
const STAT_COLORS = ['#ff5f5f', '#ff8c42', '#f0d060', '#7b8cde', '#7dd9a3', '#80cfff'];

// ─── Detail view (full screen, slide in) ─────────────────────────────────────
function BadgeDetail({ badge, col, theme, onBack }) {
  const [encIdx, setEncIdx] = useState(0);

  // Compute unlock per encounter
  const getUnlock = (enc) => {
    const ids = [...new Set((enc?.team || []).map(m => m.id).filter(Boolean))];
    const owned = ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length;
    return { ids, owned, isComplete: ids.length > 0 && owned === ids.length };
  };

  const enc = badge.encounters[encIdx] || badge.encounters[0];
  const { ids, owned, isComplete } = getUnlock(enc);
  const bc = badge.bc;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'auto',
      animation: 'slideIn .26s ease',
      background: theme.bg
    }}>
      {/* Gradient header */}
      <div style={{
        background: `linear-gradient(180deg, ${hexToRgba(bc, 0.20)}, transparent 55%)`,
        padding: '68px 16px 20px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,.1)', border: 'none',
            color: 'rgba(255,255,255,.8)', borderRadius: 20,
            padding: '7px 14px', cursor: 'pointer',
            fontSize: 12, fontFamily: 'inherit'
          }}
        >
          ← Badges
        </button>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {/* Badge icon circle */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, ${hexToRgba(bc, 0.30)}, ${hexToRgba(bc, 0.14)})`,
            border: `3px solid ${hexToRgba(bc, 0.48)}`,
            margin: '0 auto 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36
          }}>
            {isComplete ? '🏅' : '🔒'}
          </div>

          <div className={isComplete ? '' : 'blur-locked'}
            style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
            {badge.name}
          </div>
          <div className={isComplete ? '' : 'blur-locked'}
            style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>
            {badge.role} · {badge.city}
          </div>
          <div className={isComplete ? '' : 'blur-locked'}
            style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>
            {badge.place}
          </div>

          {badge.history && (
            <p className={isComplete ? '' : 'blur-locked'}
              style={{
                color: 'rgba(255,255,255,.5)', fontSize: 12,
                lineHeight: 1.55, margin: '10px auto 0', maxWidth: 280
              }}>
              {badge.history}
            </p>
          )}
        </div>

        {/* Badge unlock indicator */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: isComplete ? hexToRgba(bc, 0.18) : 'rgba(255,255,255,.06)',
            border: `1px solid ${isComplete ? hexToRgba(bc, 0.42) : 'rgba(255,255,255,.12)'}`,
            borderRadius: 24, padding: '10px 18px'
          }}>
            <span style={{ fontSize: 24 }}>{isComplete ? '🏅' : '🔒'}</span>
            <div>
              <div className={isComplete ? '' : 'blur-locked'}
                style={{ fontSize: 13, fontWeight: 700, color: isComplete ? bc : 'rgba(255,255,255,.4)' }}>
                {badge.role}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
                {isComplete ? 'Débloqué !' : `${owned}/${ids.length} capturés`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 14px 24px' }}>
        {/* Encounter tabs */}
        {badge.encounters.length > 1 && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 14, overflowX: 'auto' }}>
            {badge.encounters.map((e, i) => {
              const { isComplete: eComplete } = getUnlock(e);
              return (
                <button
                  key={e.id}
                  onClick={() => setEncIdx(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none', flexShrink: 0,
                    background: encIdx === i
                      ? (eComplete ? bc : theme.accent)
                      : 'rgba(255,255,255,.08)',
                    color: encIdx === i ? '#fff' : 'rgba(255,255,255,.38)',
                    cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit'
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Team label */}
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12
        }}>
          Équipe
        </div>

        {/* Pokemon grid – fully blurred if not complete */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {(enc?.team || []).map((member, i) => {
            const p = PKM[member.id];
            if (!p) return null;
            const s = col[member.id];
            const iok = s === 'rangé' || s === 'en main';
            const tc = TYPE_COLORS[p.types[0]] || '#888888';
            const st = STATS[member.id];

            return (
              <div
                key={`${member.id}-${i}`}
                className={isComplete ? '' : 'blur-locked'}
                style={{
                  background: 'rgba(255,255,255,.05)',
                  borderRadius: 10, padding: 10,
                  textAlign: 'center',
                  border: `1px solid ${isComplete ? hexToRgba(tc, 0.32) : 'rgba(255,255,255,.07)'}`,
                  opacity: isComplete ? 1 : 0.42,
                  position: 'relative'
                }}
              >
                {iok && (
                  <div style={{
                    position: 'absolute', top: 5, right: 5,
                    width: 16, height: 16, borderRadius: '50%',
                    background: s === 'rangé' ? '#22c55e' : '#f59e0b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: '#fff', fontWeight: 700
                  }}>✓</div>
                )}

                <PkImg p={p} sz={52} />
                <div style={{ fontSize: 9, color: '#fff', fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 5 }}>
                  Niv. {member.level}
                </div>

                {/* Stat bars */}
                {st && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
                    {STAT_LABELS.map((lbl, idx) => (
                      <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 6, color: 'rgba(255,255,255,.28)', width: 18, textAlign: 'right', flexShrink: 0 }}>{lbl}</span>
                        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, (st[idx] / 255) * 100)}%`,
                            height: '100%', background: STAT_COLORS[idx], borderRadius: 2
                          }} />
                        </div>
                        <span style={{
                          fontSize: 6, color: 'rgba(255,255,255,.38)', width: 16,
                          textAlign: 'right', flexShrink: 0,
                          fontFamily: "'Press Start 2P', monospace"
                        }}>{st[idx]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Moves */}
                {member.moves && member.moves.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                    {member.moves.map((mv, mi) => (
                      <span key={mi} style={{
                        fontSize: 8, padding: '2px 5px', borderRadius: 3,
                        background: hexToRgba(tc, 0.18),
                        border: `1px solid ${hexToRgba(tc, 0.28)}`,
                        color: 'rgba(255,255,255,.75)', fontWeight: 600
                      }}>
                        {mv}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Grid card (2-col list) ──────────────────────────────────────────────────
function BadgeGridCard({ badge, col, onClick }) {
  const enc = badge.encounters[0];
  const uniqueIds = enc ? [...new Set(enc.team.map(m => m.id).filter(Boolean))] : [];
  const owned = uniqueIds.filter(id => col[id] === 'rangé' || col[id] === 'en main').length;
  const isComplete = uniqueIds.length > 0 && owned === uniqueIds.length;
  const bc = badge.bc;

  return (
    <div
      onClick={onClick}
      className="trainer-card"
      style={{
        background: 'rgba(255,255,255,.05)',
        borderRadius: 14, overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${isComplete ? hexToRgba(bc, 0.38) : 'rgba(255,255,255,.08)'}`,
        transition: 'transform 0.12s'
      }}
      onPointerDown={ev => { ev.currentTarget.style.transform = 'scale(0.96)'; }}
      onPointerUp={ev => { ev.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={ev => { ev.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Top color bar */}
      <div style={{ height: 3, background: isComplete ? bc : 'rgba(255,255,255,.08)' }} />

      <div style={{ padding: '12px 14px 10px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 8
        }}>
          {/* Lock / Badge icon */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: isComplete ? hexToRgba(bc, 0.18) : 'rgba(255,255,255,.07)',
            border: `2px solid ${isComplete ? hexToRgba(bc, 0.45) : 'rgba(255,255,255,.12)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20
          }}>
            {isComplete ? '🏅' : '🔒'}
          </div>

          {/* Progress counter */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 16,
              color: isComplete ? bc : 'rgba(255,255,255,.25)', lineHeight: 1
            }}>
              {String(owned)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
              /{uniqueIds.length}
            </div>
          </div>
        </div>

        {/* Trainer name */}
        <div className={isComplete ? '' : 'blur-locked'}
          style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          {badge.name}
        </div>

        {/* Role */}
        <div className={isComplete ? '' : 'blur-locked'}
          style={{ fontSize: 10, color: 'rgba(255,255,255,.38)' }}>
          {badge.role}
        </div>

        {/* City */}
        <div className={isComplete ? '' : 'blur-locked'}
          style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>
          {badge.city}
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: 'rgba(255,255,255,.08)',
          borderRadius: 2, marginTop: 8, overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: uniqueIds.length ? `${(owned / uniqueIds.length) * 100}%` : '0%',
            background: isComplete ? bc : 'rgba(255,255,255,.25)',
            borderRadius: 2
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function BadgesScreen({ col, theme }) {
  const [sel, setSel] = useState(null);

  const regions = useMemo(() => {
    const regionSet = new Set(BADGES.map(b => b.region));
    return [...regionSet]
      .filter(r => REGION_LABELS[r])
      .sort((a, b) => (REGION_LABELS[a]?.order || 99) - (REGION_LABELS[b]?.order || 99));
  }, []);

  const [rTab, setRTab] = useState(regions[0] || 'kanto');

  const regionBadges = useMemo(() => BADGES.filter(b => b.region === rTab), [rTab]);

  const isUnlocked = (badge) => {
    const enc = badge.encounters[0];
    if (!enc) return false;
    const ids = [...new Set(enc.team.map(m => m.id).filter(Boolean))];
    return ids.length > 0 && ids.every(id => col[id] === 'rangé' || col[id] === 'en main');
  };

  const unlocked = regionBadges.filter(isUnlocked).length;
  const total = regionBadges.length;

  if (sel) {
    return (
      <BadgeDetail
        badge={sel}
        col={col}
        theme={theme}
        onBack={() => setSel(null)}
      />
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ flexShrink: 0, padding: '2px 16px 8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
          BADGES
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
          Arènes{' '}
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: theme.accent }}>
            {unlocked}
          </span>
          <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 16 }}>/{total}</span>
        </div>

        {/* Region tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRTab(r)}
              style={{
                padding: '5px 13px', borderRadius: 20, flexShrink: 0,
                border: rTab === r ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                background: rTab === r ? hexToRgba(theme.accent, 0.14) : 'transparent',
                color: rTab === r ? theme.accent : 'rgba(255,255,255,.42)',
                cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                transition: 'all 0.15s'
              }}
            >
              {REGION_LABELS[r]?.l || r}
            </button>
          ))}
        </div>
      </div>

      {/* 2-column grid */}
      <div style={{
        flex: '1 1 0%', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '8px 14px 14px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12, alignContent: 'start'
        }}>
          {regionBadges.map(badge => (
            <BadgeGridCard
              key={badge.id}
              badge={badge}
              col={col}
              onClick={() => setSel(badge)}
            />
          ))}
        </div>
        {regionBadges.length === 0 && (
          <div style={{
            textAlign: 'center', color: 'rgba(255,255,255,.22)',
            padding: '40px 0', fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, lineHeight: 2.5
          }}>
            Aucun badge dans cette région
          </div>
        )}
      </div>
    </div>
  );
}
