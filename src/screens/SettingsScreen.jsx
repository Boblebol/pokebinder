import React, { useState, useEffect } from 'react';
import { hexToRgba } from '../utils/color.js';
import { CHANGELOG } from '../data/changelog.js';

export default function SettingsScreen({ bcfg, setBcfg, theme, themeKey, setThemeKey, themes, onReset, swReg, showUpdate, onReplayTour }) {
  const [localCfg, setLocalCfg] = useState(() => ({ ...bcfg }));
  const [okk, setOkk] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [lastCheck, setLastCheck] = useState(() => localStorage.getItem('pokeclasseur_last_update_check'));
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const checkStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsIOS(checkIOS);
    setIsStandalone(!!checkStandalone);
  }, []);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const formatLastCheck = (isoString) => {
    if (!isoString) return 'Jamais';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Jamais';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} à ${hours}:${minutes}`;
    } catch (e) {
      return 'Jamais';
    }
  };

  const handleCheckUpdate = () => {
    if (!swReg) {
      setChecking(true);
      setTimeout(() => {
        setChecking(false);
        alert("La détection de mise à jour n'est pas active dans cet environnement (ex: développement local).");
      }, 800);
      return;
    }
    setChecking(true);
    swReg.update()
      .then((registration) => {
        setTimeout(() => {
          setChecking(false);
          const nowStr = new Date().toISOString();
          localStorage.setItem('pokeclasseur_last_update_check', nowStr);
          setLastCheck(nowStr);
          if (registration.waiting) {
            alert("Une mise à jour est disponible et prête à être installée !");
          } else {
            alert("Votre application est déjà à jour !");
          }
        }, 1200);
      })
      .catch((err) => {
        setChecking(false);
        console.error(err);
        alert("Impossible de vérifier les mises à jour. Vérifiez votre connexion internet.");
      });
  };

  const handleInstallUpdate = () => {
    if (swReg && swReg.waiting) {
      swReg.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  const hasUpdate = !!(showUpdate || (swReg && swReg.waiting));

  const upd = (k, v) => {
    setLocalCfg(prev => ({ ...prev, [k]: v }));
  };

  const handleApply = () => {
    setBcfg({ ...localCfg });
    setOkk(true);
    setTimeout(() => setOkk(false), 2000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 62, flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: 'auto', padding: '2px 16px 24px' }}>
        
        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.accent, lineHeight: 1.6 }}>
            CONFIG
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -.5, lineHeight: 1.1 }}>
            Classeurs
          </div>
        </div>

        {/* Grid dimensions */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.07)',
          marginBottom: 12,
          padding: '12px 14px 14px'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Format de page
          </div>
          <div data-tour="page-format" style={{ display: 'flex', gap: 8 }}>
            {[[3, 3], [3, 4], [4, 4]].map(([r, c]) => {
              const on = localCfg.gridRows === r && localCfg.gridCols === c;
              return (
                <button
                  key={`${r}x${c}`}
                  onClick={() => {
                    upd('gridRows', r);
                    upd('gridCols', c);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 4px',
                    borderRadius: 10,
                    border: on ? `2px solid ${theme.accent}` : '1px solid rgba(255,255,255,.12)',
                    background: on ? hexToRgba(theme.accent, 0.18) : 'rgba(255,255,255,.04)',
                    color: on ? theme.accent : 'rgba(255,255,255,.4)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, marginBottom: 4 }}>
                    {r}×{c}
                  </div>
                  <div style={{ fontSize: 10, color: on ? hexToRgba(theme.accent, 0.8) : 'rgba(255,255,255,.25)' }}>
                    {r * c} cartes
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Family wrapping rule */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.07)',
          marginBottom: 12,
          padding: '12px 14px 14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.75)', marginBottom: 3 }}>
                Règle famille
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', lineHeight: 1.5 }}>
                Ne pas couper une famille sur une ligne.
              </div>
            </div>
            <div
              onClick={() => upd('familyRule', !localCfg.familyRule)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: localCfg.familyRule ? '#22c55e' : 'rgba(255,255,255,.12)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0
              }}
            >
              <div style={{
                position: 'absolute',
                top: 3,
                left: localCfg.familyRule ? 23 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,.35)',
                transition: 'left 0.2s'
              }} />
            </div>
          </div>
          {localCfg.familyRule && (
            <div style={{
              marginTop: 10,
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              fontSize: 10,
              color: 'rgba(251, 191, 36, 0.85)',
              lineHeight: 1.5
            }}>
              ⚠️ Avec la règle famille, <strong>Kanto</strong> et <strong>Unys</strong> nécessitent <strong>11 pages</strong> de classeur (au lieu de 10) pour loger tous leurs Pokémon sans les couper.
            </div>
          )}
        </div>

        {/* Theme select (added for in-app configuration) */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.07)',
          marginBottom: 16,
          padding: '12px 14px 14px'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Thème Visuel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(themes).map(([k, t]) => {
              const on = themeKey === k;
              return (
                <button
                  key={k}
                  onClick={() => setThemeKey(k)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: on ? `1.5px solid ${t.accent}` : '1px solid rgba(255,255,255,.12)',
                    background: on ? hexToRgba(t.accent, 0.15) : 'rgba(255,255,255,.04)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: t.accent,
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: on ? t.accent : 'rgba(255,255,255,.7)' }}>
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PWA Updates Panel */}
        <div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.07)',
          marginBottom: 16,
          padding: '12px 14px 14px'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Mise à jour (PWA)
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>Version installée</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: "'Press Start 2P', monospace" }}>
                v{CHANGELOG[0]?.version || '2.0.5'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>État</span>
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: isOffline ? '#ef4444' : (hasUpdate ? theme.accent : '#22c55e'),
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isOffline ? '#ef4444' : (hasUpdate ? theme.accent : '#22c55e'),
                  display: 'inline-block'
                }} />
                {isOffline ? 'Hors ligne' : (hasUpdate ? 'Mise à jour prête' : 'À jour')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
                Dernière vérification : {formatLastCheck(lastCheck)}
              </span>
            </div>
          </div>

          {hasUpdate ? (
            <button
              onClick={handleInstallUpdate}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                background: theme.accent,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: `0 4px 12px ${theme.accent}30`
              }}
            >
              ✨ Installer la mise à jour
            </button>
          ) : (
            <button
              onClick={handleCheckUpdate}
              disabled={checking || isOffline}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.04)',
                color: (checking || isOffline) ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.7)',
                cursor: (checking || isOffline) ? 'default' : 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
            >
              {checking ? '🔄 Vérification...' : '🔍 Rechercher une mise à jour'}
            </button>
          )}

          {/* Changelog collapsible */}
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setShowChangelog(v => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>Nouveautés &amp; Changelog</span>
              <span style={{
                fontSize: 14,
                color: 'rgba(255,255,255,.25)',
                transition: 'transform 0.2s',
                display: 'inline-block',
                transform: showChangelog ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>&#8964;</span>
            </button>

            {showChangelog && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CHANGELOG.map((entry, ei) => (
                  <div key={entry.version} style={{
                    borderRadius: 8,
                    background: ei === 0 ? hexToRgba(theme.accent, 0.06) : 'rgba(255,255,255,.03)',
                    border: `1px solid ${ei === 0 ? hexToRgba(theme.accent, 0.22) : 'rgba(255,255,255,.07)'}`,
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: ei === 0 ? theme.accent : 'rgba(255,255,255,.4)'
                      }}>v{entry.version}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: ei === 0 ? '#fff' : 'rgba(255,255,255,.55)' }}>
                        {entry.title}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 9, color: 'rgba(255,255,255,.2)' }}>
                        {entry.date}
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {entry.items.map((item, ii) => (
                        <li key={ii} style={{ fontSize: 10, color: 'rgba(255,255,255,.42)', lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* iOS Installation Panel */}
        {isIOS && !isStandalone && (
          <div style={{
            background: 'rgba(255,255,255,.05)',
            borderRadius: 12,
            border: `1.5px solid ${theme.accent}44`,
            marginBottom: 16,
            padding: '12px 14px 14px',
            boxShadow: `0 0 15px ${theme.accent}0a`
          }}>
            <div style={{ fontSize: 10, color: theme.accent, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
              Installer sur iPhone / iPad
            </div>
            
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Ajoutez l'application sur votre écran d'accueil pour l'utiliser en plein écran (sans les barres de navigation du navigateur) :
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>1️⃣</span>
                <span>Appuyez sur le bouton <strong>Partager</strong> 📤 (icône carré + flèche en bas de Safari).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>2️⃣</span>
                <span>Faites défiler le menu et sélectionnez <strong>Sur l'écran d'accueil</strong> 📲.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>3️⃣</span>
                <span>Cliquez sur <strong>Ajouter</strong> en haut à droite.</span>
              </div>
            </div>
          </div>
        )}

        {/* Recalculate button */}
        <button
          onClick={handleApply}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            border: 'none',
            background: okk ? '#22c55e' : theme.accent,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            transition: 'background 0.3s',
            marginBottom: 10
          }}
        >
          {okk ? '✓ Placement recalculé !' : '🔄 Recalculer le placement'}
        </button>

        {/* Replay Tour Button */}
        <button
          onClick={onReplayTour}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,.12)',
            background: 'rgba(255,255,255,.04)',
            color: 'rgba(255,255,255,.75)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            transition: 'all 0.3s',
            marginBottom: 10
          }}
          onPointerDown={ev => { ev.currentTarget.style.background = 'rgba(255,255,255,.08)'; }}
          onPointerUp={ev => { ev.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
          onPointerLeave={ev => { ev.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
        >
          ✨ Rejouer le guide d'accueil
        </button>

        {/* Reset application button */}
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            border: `1px solid ${theme.accent}`,
            background: 'transparent',
            color: theme.accent,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            transition: 'all 0.3s',
            marginBottom: 80
          }}
          onPointerDown={ev => {
            ev.currentTarget.style.background = hexToRgba(theme.accent, 0.15);
          }}
          onPointerUp={ev => {
            ev.currentTarget.style.background = 'transparent';
          }}
          onPointerLeave={ev => {
            ev.currentTarget.style.background = 'transparent';
          }}
        >
          ⚠️ Réinitialiser l'application
        </button>
      </div>
    </div>
  );
}
