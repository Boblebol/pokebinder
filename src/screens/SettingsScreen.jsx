import React, { useState } from 'react';
import { hexToRgba } from '../utils/color.js';

export default function SettingsScreen({ bcfg, setBcfg, theme, themeKey, setThemeKey, themes, onReset }) {
  const [localCfg, setLocalCfg] = useState(() => ({ ...bcfg }));
  const [okk, setOkk] = useState(false);

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
          <div style={{ display: 'flex', gap: 8 }}>
            {[[3, 3], [4, 3], [4, 4]].map(([r, c]) => {
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
