import React from 'react';
import { TYPE_COLORS, TYPE_LABELS } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function TBadge({ type, mult }) {
  const c = TYPE_COLORS[type] || '#888888';
  const suffix = mult !== undefined ? ` \u00d7${mult}` : '';
  return (
    <span style={{
      background: hexToRgba(c, 0.18),
      color: c,
      border: `1px solid ${hexToRgba(c, 0.30)}`,
      borderRadius: 4,
      padding: '1px 5px',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      lineHeight: 1.6,
      whiteSpace: 'nowrap'
    }}>
      {TYPE_LABELS[type] || type}{suffix}
    </span>
  );
}
