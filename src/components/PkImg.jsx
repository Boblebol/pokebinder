import React, { useState, useEffect } from 'react';
import { TYPE_COLORS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function PkImg({ p, sz, xs, imgUrl }) {
  const [err, setErr] = useState(false);
  const tc = TYPE_COLORS[p.types[0]] || '#888888';
  const s = sz || 64;
  const pad = String(p.id).padStart(3, '0');

  useEffect(() => {
    setErr(false);
  }, [p.id, imgUrl]);

  const src = imgUrl || `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pad}.png`;

  if (!err) {
    return (
      <div style={{ width: s, height: s, flexShrink: 0, ...(xs || {}) }}>
        <img
          key={src}
          src={src}
          alt={p.name}
          loading="lazy"
          decoding="async"
          onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: s,
      height: s,
      flexShrink: 0,
      background: `linear-gradient(135deg, ${hexToRgba(tc, 0.75)}, ${hexToRgba(tc, 0.35)})`,
      borderRadius: s >= 100 ? 10 : 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(xs || {})
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: Math.max(7, Math.round(s * 0.155)),
        color: 'rgba(255, 255, 255, .9)',
        textShadow: '0 1px 4px rgba(0,0,0,.6)',
        letterSpacing: -1
      }}>
        {pad}
      </span>
    </div>
  );
}
