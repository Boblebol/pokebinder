import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import TabBar from './components/TabBar.jsx';
import PokedexScreen from './screens/PokedexScreen.jsx';
import SuccesScreen from './screens/SuccesScreen.jsx';
import BindersScreen from './screens/BindersScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import { INITCOL, BCFG, PLIST, BADGES, ACHIEVEMENTS } from './data/index.js';
import { computeSnap } from './utils/binder.js';
import { getBadgeImageUrl, getTrainerAvatarUrl, PROFESSOR_MAP } from './utils/assets.js';

const THEMES = {
  shadow: {
    name: 'Shadow',
    accent: '#ff375f',
    bg: '#0a0a0f',
    page: 'radial-gradient(ellipse at 50% -10%, #1c1c2e, #06060c)'
  },
  midnight: {
    name: 'Midnight',
    accent: '#4cc9f0',
    bg: '#050810',
    page: 'radial-gradient(ellipse at 50% -10%, #0a1530, #020408)'
  },
  ember: {
    name: 'Ember',
    accent: '#ff9f1c',
    bg: '#100a08',
    page: 'radial-gradient(ellipse at 50% -10%, #201008, #060302)'
  }
};

export default function App() {
  const [tab, setTab] = useState('pokedex');
  const [tweaks, setTweaks] = useState(false);
  const [swReg, setSwReg] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  // Achievement/Badge Unlock Toast States
  const [activeToast, setActiveToast] = useState(null);
  const [succesBadgeId, setSuccesBadgeId] = useState(null);
  const prevUnlocksRef = useRef({ badges: [], achievements: [], isInitialized: false });

  // 1. Persistent Collection State
  const [col, setCol] = useState(() => {
    const cached = localStorage.getItem('pokeclasseur_collection');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const merged = {};
        Object.keys(INITCOL).forEach((id) => {
          merged[id] = parsed[id] !== undefined ? parsed[id] : null;
        });
        return merged;
      } catch (err) {
        console.error('Error parsing collection from localStorage', err);
      }
    }
    return { ...INITCOL };
  });

  useEffect(() => {
    localStorage.setItem('pokeclasseur_collection', JSON.stringify(col));
  }, [col]);

  // 2. Persistent Binder Layout Configuration
  const [bcfg, setBcfg] = useState(() => {
    const cached = localStorage.getItem('pokeclasseur_bcfg');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        console.error('Error parsing config from localStorage', err);
      }
    }
    return { ...BCFG };
  });

  useEffect(() => {
    localStorage.setItem('pokeclasseur_bcfg', JSON.stringify(bcfg));
  }, [bcfg]);

  // 3. Persistent Theme Config
  const [tk, setTk] = useState(() => {
    return localStorage.getItem('pokeclasseur_theme') || 'shadow';
  });

  useEffect(() => {
    localStorage.setItem('pokeclasseur_theme', tk);
  }, [tk]);

  const theme = THEMES[tk] || THEMES.shadow;

  // 4. Reactive Placement Snapping calculations
  const snap = useMemo(() => {
    return computeSnap(PLIST, bcfg.familyRule, bcfg);
  }, [bcfg]);

  const getLoc = useCallback((id) => {
    return snap[id] || { classeur: '?', page: 1, side: 'Recto', row: 1, col: 1, regionName: '?' };
  }, [snap]);

  const handleReset = useCallback(() => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toute votre collection et vos paramètres ? Cette action est irréversible.")) {
      localStorage.removeItem('pokeclasseur_collection');
      localStorage.removeItem('pokeclasseur_bcfg');
      localStorage.removeItem('pokeclasseur_theme');
      
      const cleanCol = {};
      PLIST.forEach(p => {
        cleanCol[p.id] = null;
      });
      setCol(cleanCol);
      
      setBcfg({ ...BCFG });
      setTk('shadow');
      alert("✓ L'application a été réinitialisée avec succès !");
    }
  }, []);

  // PWA Service Worker Registration & Update Detection
  useEffect(() => {
    if ('serviceWorker' in navigator && !window.location.host.includes('localhost')) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setSwReg(reg);
          localStorage.setItem('pokeclasseur_last_update_check', new Date().toISOString());

          // Check if there is already a waiting worker
          if (reg.waiting) {
            setShowUpdate(true);
          }

          // Listen for future updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdate(true);
                }
              });
            }
          });
        })
        .catch((err) => console.error('PWA service worker registration failed:', err));

      // Reload page when the active service worker changes (new one takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Detect badge & achievement unlocks in real-time
  useEffect(() => {
    const currentBadges = BADGES.filter((b) => {
      const enc = b.encounters[0];
      if (!enc) return false;
      const ids = [...new Set(enc.team.map((m) => m.id).filter(Boolean))];
      return ids.length > 0 && ids.every((id) => col[id] === 'rangé' || col[id] === 'en main');
    }).map((b) => b.id);

    const currentAchs = ACHIEVEMENTS.filter((a) => a.check(col)).map((a) => a.id);

    if (!prevUnlocksRef.current.isInitialized) {
      prevUnlocksRef.current = {
        badges: currentBadges,
        achievements: currentAchs,
        isInitialized: true
      };
      return;
    }

    const newlyUnlockedBadges = currentBadges.filter((id) => !prevUnlocksRef.current.badges.includes(id));
    const newlyUnlockedAchs = currentAchs.filter((id) => !prevUnlocksRef.current.achievements.includes(id));

    if (newlyUnlockedBadges.length > 0) {
      const badgeId = newlyUnlockedBadges[0];
      const badgeObj = BADGES.find((b) => b.id === badgeId);
      if (badgeObj) {
        const imageUrl = getTrainerAvatarUrl(badgeObj.name, badgeObj.id);
        const badgeImageUrl = badgeObj.badgeName ? getBadgeImageUrl(badgeObj.badgeName) : null;
        setActiveToast({
          type: 'badge',
          id: badgeId,
          title: 'Badge Débloqué ! 🏅',
          subtitle: `${badgeObj.badgeName || 'Badge'} · ${badgeObj.name}`,
          icon: '🏅',
          imageUrl,
          badgeImageUrl,
          color: badgeObj.bc || '#38bdf8',
          badge: badgeObj
        });
      }
    } else if (newlyUnlockedAchs.length > 0) {
      const achId = newlyUnlockedAchs[0];
      const achObj = ACHIEVEMENTS.find((a) => a.id === achId);
      if (achObj) {
        const profKey = PROFESSOR_MAP[achId];
        const imageUrl = profKey ? `https://play.pokemonshowdown.com/sprites/trainers/${profKey}.png` : null;
        setActiveToast({
          type: 'achievement',
          id: achId,
          title: 'Succès Débloqué ! 🏆',
          subtitle: achObj.label,
          icon: achObj.icon || '🏆',
          imageUrl,
          color: achObj.color || '#fbbf24',
          achievement: achObj
        });
      }
    }

    prevUnlocksRef.current = {
      badges: currentBadges,
      achievements: currentAchs,
      isInitialized: true
    };
  }, [col]);

  // Toast Auto-Dismiss Timer
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Periodically check for updates if service worker is active
  useEffect(() => {
    if (swReg) {
      const runUpdate = () => {
        swReg.update()
          .then(() => {
            localStorage.setItem('pokeclasseur_last_update_check', new Date().toISOString());
          })
          .catch(() => {});
      };
      runUpdate();
      const interval = setInterval(runUpdate, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [swReg]);

  // 5. PostMessage event listener for external edits/integrations
  useEffect(() => {
    const handleMessage = (event) => {
      const type = event?.data?.type;
      if (type === '__activate_edit_mode') {
        setTweaks(true);
      } else if (type === '__deactivate_edit_mode') {
        setTweaks(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      background: theme.page,
      position: 'fixed',
      inset: 0,
      transition: 'background .5s'
    }}>
      <div className="dev" style={{ background: theme.bg }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
          {/* Main Screens Container */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 82, overflow: 'hidden' }}>
            {tab === 'pokedex' && (
              <PokedexScreen col={col} setCol={setCol} theme={theme} getLoc={getLoc} />
            )}
            {tab === 'succes' && (
              <SuccesScreen
                col={col}
                theme={theme}
                initialSelectedBadgeId={succesBadgeId}
                onClearInitialSelectedBadge={() => setSuccesBadgeId(null)}
              />
            )}
            {tab === 'binders' && (
              <BindersScreen col={col} bcfg={bcfg} theme={theme} getLoc={getLoc} />
            )}
            {tab === 'dashboard' && (
              <DashboardScreen col={col} setCol={setCol} theme={theme} />
            )}
            {tab === 'settings' && (
              <SettingsScreen
                bcfg={bcfg}
                setBcfg={setBcfg}
                theme={theme}
                themeKey={tk}
                setThemeKey={setTk}
                themes={THEMES}
                onReset={handleReset}
                swReg={swReg}
                showUpdate={showUpdate}
              />
            )}
          </div>

          {/* Bottom Tab Navigation Bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <TabBar tab={tab} setTab={setTab} accent={theme.accent} />
          </div>

          {/* PWA Update Banner */}
          {showUpdate && (
            <div style={{
              position: 'absolute',
              bottom: 96,
              left: 16,
              right: 16,
              background: 'rgba(16, 16, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1.5px solid ${theme.accent}44`,
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px ${theme.accent}22`,
              zIndex: 1000,
              animation: 'updateBannerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, animation: 'bounce 2s infinite', display: 'inline-block' }}>✨</span>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
                    Mise à jour disponible !
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10, marginTop: 2 }}>
                    Nouveaux Pokémon & badges prêts.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => {
                    if (swReg && swReg.waiting) {
                      swReg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    } else {
                      window.location.reload();
                    }
                  }}
                  style={{
                    background: theme.accent,
                    border: 'none',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${theme.accent}30`,
                    transition: 'transform 0.1s, opacity 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
                  onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Installer
                </button>
                <button
                  onClick={() => setShowUpdate(false)}
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    border: 'none',
                    color: 'rgba(255,255,255,.5)',
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'inherit'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Achievement / Badge Unlock Toast */}
          {activeToast && (
            <div style={{
              position: 'absolute',
              top: 76,
              left: 16,
              right: 16,
              background: 'rgba(18, 18, 30, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${activeToast.color}66`,
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px ${activeToast.color}22`,
              zIndex: 2000,
              animation: 'toastSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${activeToast.color}33, ${activeToast.color}11)`,
                  border: `2px solid ${activeToast.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${activeToast.color}33`,
                  animation: 'pulseGlow 2s infinite',
                  overflow: 'hidden'
                }}>
                  {activeToast.imageUrl ? (
                    <img 
                      src={activeToast.imageUrl} 
                      alt="" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }} 
                    />
                  ) : (
                    activeToast.icon
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: activeToast.color, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {activeToast.title}
                  </div>
                  <div style={{ 
                    color: '#fff', 
                    fontSize: 12, 
                    fontWeight: 600, 
                    marginTop: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6 
                  }}>
                    {activeToast.badgeImageUrl && (
                      <img src={activeToast.badgeImageUrl} alt="" style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }} />
                    )}
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeToast.subtitle}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => {
                    if (activeToast.type === 'badge') {
                      setSuccesBadgeId(activeToast.badge.id);
                    }
                    setTab('succes');
                    setActiveToast(null);
                  }}
                  style={{
                    background: activeToast.color,
                    border: 'none',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${activeToast.color}40`,
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Voir
                </button>
                <button
                  onClick={() => setActiveToast(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                    fontFamily: 'inherit'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tweaks Panel overlay (for iframe parent integrations) */}
      {tweaks && (
        <div style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          width: 240,
          background: 'rgba(250, 249, 247, .9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '.5px solid rgba(255,255,255,.6)',
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
          zIndex: 9999,
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderBottom: '1px solid rgba(0,0,0,.06)'
          }}>
            <strong style={{ fontSize: 12, fontWeight: 600 }}>Tweaks</strong>
            <button
              onClick={() => {
                setTweaks(false);
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
                }
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(0,0,0,.45)' }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: '10px 14px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .06, textTransform: 'uppercase', color: 'rgba(0,0,0,.45)', marginBottom: 8 }}>
              Thème
            </div>
            {Object.entries(THEMES).map(([k, t]) => (
              <button
                key={k}
                onClick={() => setTk(k)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  marginBottom: 5,
                  border: tk === k ? `1.5px solid ${t.accent}` : '1px solid rgba(0,0,0,.1)',
                  background: tk === k ? `${t.accent}18` : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: t.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: tk === k ? t.accent : '#333' }}>
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
