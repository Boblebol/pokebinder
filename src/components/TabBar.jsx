import React from 'react';
import { hexToRgba } from '../utils/color.js';

export default function TabBar({ tab, setTab, accent }) {
  const tabs = [
    { id: 'pokedex',   l: 'Pokédex',  ic: '📖' },
    { id: 'succes',    l: 'Succès',    ic: '🏆' },
    { id: 'binders',   l: 'Classeurs', ic: '📋' },
    { id: 'dashboard', l: 'Stats',     ic: '📊' },
    { id: 'settings',  l: 'Config',    ic: '⚙️' }
  ];

  return (
    <div data-tour="tabbar" style={{
      height: 82,
      background: 'rgba(6, 6, 12, .9)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: '1px solid rgba(255, 255, 255, .07)',
      display: 'flex',
      alignItems: 'flex-start',
      paddingTop: 6
    }}>
      {tabs.map(t => {
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '3px 0 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'transform .1s'
            }}
            onPointerDown={ev => {
              ev.currentTarget.style.transform = 'scale(0.82)';
            }}
            onPointerUp={ev => {
              ev.currentTarget.style.transform = 'scale(1)';
            }}
            onPointerLeave={ev => {
              ev.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              width: 22,
              height: 3,
              borderRadius: 2,
              background: on ? accent : 'transparent',
              marginBottom: 2,
              boxShadow: on ? `0 0 8px ${hexToRgba(accent, 0.6)}` : 'none',
              transition: 'all 0.22s'
            }} />
            <span style={{
              fontSize: 20,
              lineHeight: 1,
              filter: on ? 'none' : 'grayscale(100%) opacity(.3)',
              transition: 'filter 0.22s'
            }}>
              {t.ic}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: .3,
              color: on ? accent : 'rgba(255, 255, 255, .28)',
              transition: 'color 0.22s'
            }}>
              {t.l}
            </span>
          </button>
        );
      })}
    </div>
  );
}
