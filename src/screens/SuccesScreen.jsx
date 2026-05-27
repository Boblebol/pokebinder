import { useState, useMemo, useCallback, useEffect } from 'react';
import PkImg from '../components/PkImg.jsx';
import { BADGES } from '../data/badges.js';
import { ACHIEVEMENTS, PKM, STATS, TYPE_COLORS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';
import { getBadgeImageUrl, getTrainerAvatarUrl, PROFESSOR_MAP } from '../utils/assets.js';

// ── Config régions ─────────────────────────────────────────────────────────
const REGION_LABELS = {
  kanto:  { l: '🔴 Kanto',   order: 1 },
  gs:     { l: '⭐ Johto',   order: 2 },
  rs:     { l: '💚 Hoenn',   order: 3 },
  dp:     { l: '❄️ Sinnoh',  order: 4 },
  bw:     { l: '⛰️ Unys',    order: 5 },
  b2w2:   { l: '⛰️ Unys 2',  order: 6 },
  xy:     { l: '⚜️ Kalos',   order: 7 },
  sm:     { l: '☀️ Alola',   order: 8 },
  swsh:   { l: '🛡️ Galar',   order: 9 },
  sv:     { l: '🍊 Paldea',  order: 10 },
};

const STAT_LABELS = ['PV', 'Atk', 'Déf', 'Atk.S', 'Dé.S', 'Vit'];
const STAT_COLORS = ['#ff5f5f', '#ff8c42', '#f0d060', '#7b8cde', '#7dd9a3', '#80cfff'];

// ── Utilitaire unlock ──────────────────────────────────────────────────────
function encUnlock(enc, col) {
  const ids = [...new Set((enc?.team || []).map(m => m.id).filter(Boolean))];
  const owned = ids.filter(id => col[id] === 'rangé' || col[id] === 'en main').length;
  return { ids, owned, isComplete: ids.length > 0 && owned === ids.length };
}

// ── Vue détail badge ───────────────────────────────────────────────────────
function BadgeDetail({ badge, col, theme, onBack }) {
  const [encIdx, setEncIdx] = useState(0);

  const enc = badge.encounters[encIdx] || badge.encounters[0];
  const { ids, owned, isComplete } = encUnlock(enc, col);
  const bc = badge.bc;

  const trainerImgUrl = getTrainerAvatarUrl(badge.name, badge.id);
  const badgeImgUrl = badge.badgeName ? getBadgeImageUrl(badge.badgeName) : null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'auto',
      animation: 'slideIn .26s ease',
      background: theme.bg
    }}>
      {/* Fond dégradé */}
      <div style={{
        background: `linear-gradient(180deg, ${hexToRgba(bc, 0.22)}, transparent 55%)`,
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
          ← Succès
        </button>

        {/* En-tête dresseur */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: isComplete 
              ? `linear-gradient(135deg, ${hexToRgba(bc, 0.20)}, ${hexToRgba(bc, 0.08)})` 
              : 'rgba(255,255,255,.05)',
            border: `3px solid ${isComplete ? hexToRgba(bc, 0.52) : 'rgba(255,255,255,.12)'}`,
            margin: '0 auto 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: isComplete ? `0 0 16px ${hexToRgba(bc, 0.25)}` : 'none'
          }}>
            <img 
              src={trainerImgUrl} 
              alt={badge.name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: isComplete ? 'none' : 'grayscale(100%) opacity(.35)'
              }} 
            />
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
            {badge.name}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.40)', marginTop: 4 }}>
            {badge.role}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>
            📍 {badge.city} · {badge.place}
          </div>

          {badge.history && (
            <p style={{
                color: 'rgba(255,255,255,.50)', fontSize: 12,
                lineHeight: 1.6, margin: '12px auto 0', maxWidth: 290,
                padding: '10px 14px',
                background: 'rgba(255,255,255,.04)',
                borderRadius: 10,
                borderLeft: `3px solid ${hexToRgba(bc, 0.45)}`,
                textAlign: 'left'
              }}>
                {badge.history}
            </p>
          )}
        </div>

        {/* Indicateur badge */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: isComplete ? hexToRgba(bc, 0.18) : 'rgba(255,255,255,.06)',
            border: `1px solid ${isComplete ? hexToRgba(bc, 0.42) : 'rgba(255,255,255,.12)'}`,
            borderRadius: 24, padding: '10px 20px'
          }}>
            <img 
              src={badgeImgUrl || trainerImgUrl} 
              alt="" 
              style={{
                width: 28,
                height: 28,
                objectFit: 'contain',
                filter: isComplete ? 'none' : 'grayscale(100%) opacity(.35)'
              }} 
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isComplete ? bc : 'rgba(255,255,255,.4)' }}>
                {badge.badgeName || badge.role}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.32)' }}>
                {isComplete ? 'Débloqué !' : `${owned}/${ids.length} Pokémon capturés`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 14px 28px' }}>
        {/* Sélecteur de rencontre */}
        {badge.encounters.length > 1 && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 14, overflowX: 'auto' }}>
            {badge.encounters.map((e, i) => {
              const { isComplete: ec } = encUnlock(e, col);
              return (
                <button key={e.id} onClick={() => setEncIdx(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none', flexShrink: 0,
                    background: encIdx === i ? (ec ? bc : theme.accent) : 'rgba(255,255,255,.08)',
                    color: encIdx === i ? '#fff' : 'rgba(255,255,255,.38)',
                    cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit'
                  }}>
                  {e.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Étiquette équipe */}
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,.30)', fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12
        }}>
          Équipe du dresseur
        </div>

        {/* Grille pokémon — entièrement floutée si pas débloqué */}
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
                  borderRadius: 10, padding: '10px 8px',
                  textAlign: 'center',
                  border: `1px solid ${isComplete ? hexToRgba(tc, 0.30) : 'rgba(255,255,255,.07)'}`,
                  opacity: isComplete ? 1 : 0.40,
                  position: 'relative'
                }}
              >
                {iok && isComplete && (
                  <div style={{
                    position: 'absolute', top: 5, right: 5,
                    width: 14, height: 14, borderRadius: '50%',
                    background: s === 'rangé' ? '#22c55e' : '#f59e0b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7, color: '#fff', fontWeight: 700
                  }}>✓</div>
                )}

                <PkImg p={p} sz={48} />
                <div style={{ fontSize: 9, color: '#fff', fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>
                  {p.name}
                </div>
                <div style={{
                  fontSize: 8, color: 'rgba(255,255,255,.35)',
                  marginBottom: 5,
                  fontFamily: "'Press Start 2P', monospace"
                }}>
                  Niv.{member.level}
                </div>

                {/* Barres de stats */}
                {st && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 7 }}>
                    {STAT_LABELS.map((lbl, idx) => (
                      <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 6, color: 'rgba(255,255,255,.30)', width: 18, textAlign: 'right', flexShrink: 0 }}>{lbl}</span>
                        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, (st[idx] / 255) * 100)}%`,
                            height: '100%', background: STAT_COLORS[idx], borderRadius: 2
                          }} />
                        </div>
                        <span style={{
                          fontSize: 6, color: 'rgba(255,255,255,.42)', width: 14,
                          textAlign: 'right', flexShrink: 0,
                          fontFamily: "'Press Start 2P', monospace"
                        }}>{st[idx]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attaques */}
                {member.moves && member.moves.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                    {member.moves.map((mv, mi) => (
                      <span key={mi} style={{
                        fontSize: 7, padding: '2px 5px', borderRadius: 3,
                        background: hexToRgba(tc, 0.20),
                        border: `1px solid ${hexToRgba(tc, 0.30)}`,
                        color: 'rgba(255,255,255,.78)', fontWeight: 600
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

function BadgeGridCard({ badge, col, onClick }) {
  const enc = badge.encounters[0];
  const { ids, owned, isComplete } = encUnlock(enc, col);
  const bc = badge.bc;
  const hasGymBadge = !!badge.badgeName;
  const trainerImgUrl = getTrainerAvatarUrl(badge.name, badge.id);
  const badgeImgUrl = badge.badgeName ? getBadgeImageUrl(badge.badgeName) : null;

  return (
    <div
      onClick={onClick}
      className="trainer-card"
      style={{
        background: 'rgba(255,255,255,.05)',
        borderRadius: 14, overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${isComplete ? hexToRgba(bc, 0.40) : 'rgba(255,255,255,.08)'}`,
        transition: 'transform 0.12s'
      }}
      onPointerDown={ev => { ev.currentTarget.style.transform = 'scale(0.96)'; }}
      onPointerUp={ev => { ev.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={ev => { ev.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Barre couleur */}
      <div style={{ height: 3, background: isComplete ? bc : 'rgba(255,255,255,.08)' }} />

      <div style={{ padding: '12px 12px 10px' }}>
        {/* Ligne haut : icône + compteur */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: isComplete 
              ? `linear-gradient(135deg, ${hexToRgba(bc, 0.15)}, ${hexToRgba(bc, 0.05)})` 
              : 'rgba(255,255,255,.06)',
            border: `2px solid ${isComplete ? hexToRgba(bc, 0.48) : 'rgba(255,255,255,.12)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src={trainerImgUrl} 
              alt="" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: isComplete ? 'none' : 'grayscale(100%) opacity(.35)'
              }} 
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 15,
              color: isComplete ? bc : 'rgba(255,255,255,.22)', lineHeight: 1
            }}>
              {owned}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.22)' }}>/{ids.length}</div>
          </div>
        </div>

        {/* Nom dresseur */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 1 }}>
          {badge.name}
        </div>

        {/* Rôle */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.38)', marginBottom: 2 }}>
          {badge.role}
        </div>

        {/* Ville */}
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,.26)', marginBottom: hasGymBadge ? 4 : 6 }}>
          📍 {badge.city}
        </div>

        {/* Nom du badge (si arène) */}
        {hasGymBadge && (
          <div style={{ marginBottom: 6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
              background: isComplete ? hexToRgba(bc, 0.20) : 'rgba(255,255,255,.06)',
              border: `1px solid ${isComplete ? hexToRgba(bc, 0.38) : 'rgba(255,255,255,.10)'}`,
              color: isComplete ? bc : 'rgba(255,255,255,.24)'
            }}>
              {badgeImgUrl ? (
                <img 
                  src={badgeImgUrl} 
                  alt="" 
                  style={{
                    width: 12,
                    height: 12,
                    objectFit: 'contain',
                    filter: isComplete ? 'none' : 'grayscale(100%) opacity(.35)'
                  }} 
                />
              ) : (
                <span>🏅</span>
              )}
              {badge.badgeName}
            </span>
          </div>
        )}

        {/* Barre de progression */}
        <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: ids.length ? `${(owned / ids.length) * 100}%` : '0%',
            background: isComplete ? bc : 'rgba(255,255,255,.22)',
            borderRadius: 2, transition: 'width 0.3s'
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Helpers de Catégorisation et Mapping ──────────────────────────────────────

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

const getBadgeCategory = (badge) => {
  const role = (badge.role || '').toLowerCase();
  const name = (badge.name || '').toLowerCase();
  if (role.includes('champion') && (role.includes('arène') || role.includes('arene') || role.includes('gym'))) {
    return 'arene';
  }
  if (role.includes('conseil') || role.includes('quatre') || role.includes('elite four') || role.includes('c4') || role.includes('d\'élite')) {
    return 'conseil 4';
  }
  if (role.includes('maître') || role.includes('maitre') || role.includes('rival') || role.includes('champion') || name.includes('maitre') || name.includes('maître')) {
    return 'maitre ligue';
  }
  return 'autre';
};

const getAchCategory = (ach) => {
  switch (ach.type) {
    case 'starters':
      return 'starter';
    case 'prof':
      return 'prof';
    case 'gyms':
      return 'arene';
    case 'maitrise':
      return 'maitrise';
    case 'meta':
    case 'stade':
      return 'pokedex';
    case 'special':
      if (ach.id === 'grand-maitre') return 'maitre ligue';
      if (ach.id === 'dresseur-ultime') return 'pokedex';
      return 'special';
    default:
      return 'autre';
  }
};

const CATEGORY_FILTERS = [
  { k: 'all',          l: 'Tout',           c: '#ffffff' },
  { k: 'starter',      l: '🌱 Starters',    c: '#4ade80' },
  { k: 'arene',        l: '🏅 Arènes',      c: '#38bdf8' },
  { k: 'conseil 4',    l: '⚔️ Conseil 4',   c: '#a78bfa' },
  { k: 'maitre ligue', l: '👑 Ligue/Maître', c: '#fbbf24' },
  { k: 'prof',         l: '🎓 Professeur',  c: '#f472b6' },
  { k: 'pokedex',      l: '📖 Pokédex',     c: '#fb923c' },
  { k: 'maitrise',     l: '🥋 Maîtrises',   c: '#e9d5ff' },
  { k: 'special',      l: '🌟 Spéciaux',    c: '#a78bfa' },
];


// ── Carte succès grille ────────────────────────────────────────────────────
function AchievementGridCard({ ach, col }) {
  const isOk = ach.check(col);
  const isSecret = ach.secret && !isOk;

  const cl = isSecret ? '#4b5563' : ach.color;
  const label = isSecret ? 'Succès Mystère' : ach.label;
  const desc = isSecret ? 'Débloquez ce succès mystère pour découvrir son secret.' : ach.desc;
  const icon = isSecret ? '🔒' : ach.icon;

  const deps = (ach.id === 'grand-maitre' && !isSecret)
    ? ACHIEVEMENTS.filter(a => a.id.startsWith('gyms-'))
    : [];

  const prg = (ach.progress && !isSecret) ? ach.progress(col) : null;
  const profKey = !isSecret ? PROFESSOR_MAP[ach.id] : null;
  const profUrl = profKey ? `https://play.pokemonshowdown.com/sprites/trainers/${profKey}.png` : null;

  return (
    <div style={{
      background: 'rgba(255,255,255,.05)',
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${isOk ? hexToRgba(cl, 0.38) : 'rgba(255,255,255,.08)'}`,
      display: 'flex', flexDirection: 'column',
      minHeight: 130
    }}>
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
            overflow: 'hidden',
            fontSize: 20
          }}>
            {profUrl ? (
              <img 
                src={profUrl} 
                alt="" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: isOk ? 'none' : 'grayscale(100%) opacity(.28)'
                }} 
              />
            ) : (
              isOk ? icon : (isSecret ? '🔒' : icon)
            )}
          </div>
          <div style={{
            fontSize: 9, fontWeight: 700,
            background: isOk ? hexToRgba(cl, 0.12) : 'rgba(255,255,255,.04)',
            color: isOk ? cl : 'rgba(255,255,255,.25)',
            borderRadius: 6, padding: '3px 7px',
            border: `1px solid ${isOk ? hexToRgba(cl, 0.25) : 'rgba(255,255,255,.08)'}`
          }}>
            {isOk ? 'Obtenu' : 'Bloqué'}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.38)', lineHeight: 1.4, flex: 1, marginBottom: (deps.length || prg) ? 10 : 0 }}>
          {desc}
        </div>

        {/* Barre de progression pour succès */}
        {prg && !isOk && (
          <div style={{ marginTop: 'auto', marginBottom: deps.length ? 10 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,.3)', marginBottom: 3 }}>
              <span>Progression</span>
              <span>{prg.cur}/{prg.max}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(prg.cur / prg.max) * 100}%`,
                background: cl,
                borderRadius: 2
              }} />
            </div>
          </div>
        )}

        {deps.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 'auto', flexWrap: 'wrap' }}>
            {deps.map(dep => {
              const dok = dep.check(col);
              const dc = dep.color;
              return (
                <div key={dep.id} title={dep.label} style={{
                  flex: 1, minWidth: 26, padding: '6px 4px', borderRadius: 6,
                  background: dok ? hexToRgba(dc, 0.10) : 'rgba(255,255,255,.04)',
                  border: `1px solid ${dok ? hexToRgba(dc, 0.28) : 'rgba(255,255,255,.08)'}`,
                  textAlign: 'center', fontSize: 13
                }}>
                  {dok ? dep.icon : '🔒'}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Écran principal ────────────────────────────────────────────────────────
export default function SuccesScreen({ col, theme, initialSelectedBadgeId, onClearInitialSelectedBadge, initialCatFilter, initialDexMode }) {
  const [sel, setSel] = useState(null);
  const [dexMode, setDexMode] = useState(initialDexMode || 'regional');
  const [catFilter, setCatFilter] = useState(initialCatFilter || 'all');

  // Auto-open badge details from toast notification
  useEffect(() => {
    if (initialSelectedBadgeId) {
      const badge = BADGES.find((b) => b.id === initialSelectedBadgeId);
      if (badge) {
        setTimeout(() => {
          setSel(badge);
        }, 0);
      }
      if (onClearInitialSelectedBadge) {
        onClearInitialSelectedBadge();
      }
    }
  }, [initialSelectedBadgeId, onClearInitialSelectedBadge]);

  // Normalisation des badges (Albert/Falkner johto -> gs)
  const normalizedBadges = useMemo(() => {
    return BADGES.map(b => {
      if (b.region === 'johto') {
        return { ...b, region: 'gs' };
      }
      return b;
    });
  }, []);

  const regions = useMemo(() => {
    const regionSet = new Set(normalizedBadges.map(b => b.region));
    return [...regionSet]
      .filter(r => REGION_LABELS[r])
      .sort((a, b) => (REGION_LABELS[a]?.order || 99) - (REGION_LABELS[b]?.order || 99));
  }, [normalizedBadges]);

  const ALL_TABS = useMemo(() => [
    ...regions.map(r => ({ id: r, l: REGION_LABELS[r]?.l || r, type: 'region' })),
    { id: 'tout', l: '🌍 Tout', type: 'tout' },
    { id: 'global', l: '🏆 Global', type: 'global' },
  ], [regions]);

  const [rTab, setRTab] = useState(ALL_TABS[0]?.id || 'kanto');

  const isUnlocked = useCallback(badge => {
    const enc = badge.encounters[0];
    if (!enc) return false;
    const ids = [...new Set(enc.team.map(m => m.id).filter(Boolean))];
    return ids.length > 0 && ids.every(id => col[id] === 'rangé' || col[id] === 'en main');
  }, [col]);

  // Base des badges et succès selon dexMode et rTab
  const { baseBadges, baseAchievements } = useMemo(() => {
    if (dexMode === 'national') {
      return {
        baseBadges: normalizedBadges,
        baseAchievements: ACHIEVEMENTS,
      };
    } else {
      if (rTab === 'tout') {
        const regionalAchs = ACHIEVEMENTS.filter(ach => ach.region !== undefined);
        return {
          baseBadges: normalizedBadges,
          baseAchievements: regionalAchs,
        };
      } else if (rTab === 'global') {
        const globalAchs = ACHIEVEMENTS.filter(ach => ach.region === undefined);
        return {
          baseBadges: [],
          baseAchievements: globalAchs,
        };
      } else {
        const badgesOfRegion = normalizedBadges.filter(b => b.region === rTab);
        const achsOfRegion = ACHIEVEMENTS.filter(ach => ach.region && mapAchRegionToBadgeRegion(ach.region) === rTab);
        return {
          baseBadges: badgesOfRegion,
          baseAchievements: achsOfRegion,
        };
      }
    }
  }, [dexMode, rTab, normalizedBadges]);

  // Filtrage selon la catégorie sélectionnée
  const { filteredBadges, filteredAchievements } = useMemo(() => {
    let fb = baseBadges;
    let fa = baseAchievements;

    if (catFilter !== 'all') {
      fb = baseBadges.filter(b => getBadgeCategory(b) === catFilter);
      fa = baseAchievements.filter(ach => getAchCategory(ach) === catFilter);
    }

    return {
      filteredBadges: fb,
      filteredAchievements: fa,
    };
  }, [baseBadges, baseAchievements, catFilter]);

  // Calcul du nombre de badges et succès débloqués
  const totalBadges = baseBadges.length;
  const unlockedBadges = useMemo(() => baseBadges.filter(isUnlocked).length, [baseBadges, isUnlocked]);

  const totalAchs = baseAchievements.length;
  const unlockedAchs = useMemo(() => baseAchievements.filter(a => a.check(col)).length, [baseAchievements, col]);

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

      {/* En-tête */}
      <div style={{ flexShrink: 0, padding: '2px 16px 8px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
          SUCCÈS
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.07)', borderRadius: 10, padding: 3, marginTop: 8, marginBottom: 8 }}>
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

        {/* Compteurs de progression */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginTop: 4, marginBottom: 4 }}>
          {totalBadges > 0 && (
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
              Badges{' '}
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: theme.accent }}>
                {unlockedBadges}
              </span>
              <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 13 }}>/{totalBadges}</span>
            </div>
          )}
          {totalAchs > 0 && (
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
              Succès{' '}
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: theme.accent }}>
                {unlockedAchs}
              </span>
              <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 13 }}>/{totalAchs}</span>
            </div>
          )}
        </div>

        {/* Onglets région (Régional uniquement) */}
        {dexMode === 'regional' && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
            {ALL_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setRTab(t.id)}
                style={{
                  padding: '5px 13px', borderRadius: 20, flexShrink: 0,
                  border: rTab === t.id ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                  background: rTab === t.id ? hexToRgba(theme.accent, 0.14) : 'transparent',
                  color: rTab === t.id ? theme.accent : 'rgba(255,255,255,.42)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {t.l}
              </button>
            ))}
          </div>
        )}

        {/* Filtres de catégorie */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginTop: 10, marginBottom: 2 }}>
          {CATEGORY_FILTERS.map(f => {
            const active = catFilter === f.k;
            return (
              <button
                key={f.k}
                onClick={() => setCatFilter(f.k)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  flexShrink: 0,
                  border: active ? `1px solid ${f.c}` : '1px solid rgba(255,255,255,.12)',
                  background: active ? hexToRgba(f.c.startsWith('#') ? f.c : '#888888', 0.14) : 'transparent',
                  color: active ? f.c : 'rgba(255,255,255,.42)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {f.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <div style={{
        flex: '1 1 0%', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '8px 14px 16px'
      }}>
        {filteredBadges.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              color: theme.accent, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
              fontFamily: "'Press Start 2P', monospace", fontSize: 8
            }}>
              Badges
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {filteredBadges.map(badge => (
                <BadgeGridCard
                  key={badge.id}
                  badge={badge}
                  col={col}
                  onClick={() => setSel(badge)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredAchievements.length > 0 && (
          <div>
            <div style={{
              color: theme.accent, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
              fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              marginTop: filteredBadges.length > 0 ? 20 : 0
            }}>
              Succès
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {filteredAchievements.map(ach => (
                <AchievementGridCard
                  key={ach.id}
                  ach={ach}
                  col={col}
                  theme={theme}
                />
              ))}
            </div>
          </div>
        )}

        {filteredBadges.length === 0 && filteredAchievements.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,.22)', padding: '40px 0',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, lineHeight: 2.5
          }}>
            Aucun résultat
          </div>
        )}
      </div>
    </div>
  );
}

