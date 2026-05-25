import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TabBar from './components/TabBar.jsx';
import PokedexScreen from './screens/PokedexScreen.jsx';
import TrainersScreen from './screens/TrainersScreen.jsx';
import BadgesScreen from './screens/BadgesScreen.jsx';
import SuccesScreen from './screens/SuccesScreen.jsx';
import BindersScreen from './screens/BindersScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import { INITCOL, BCFG, PLIST } from './data/index.js';
import { computeSnap } from './utils/binder.js';
import { hexToRgba } from './utils/color.js';

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

  // 1. Persistent Collection State
  const [col, setCol] = useState(() => {
    const cached = localStorage.getItem('pokeclasseur_collection');
    if (cached) {
      try {
        return JSON.parse(cached);
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
              <SuccesScreen col={col} theme={theme} />
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
              />
            )}
          </div>

          {/* Bottom Tab Navigation Bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <TabBar tab={tab} setTab={setTab} accent={theme.accent} />
          </div>
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
