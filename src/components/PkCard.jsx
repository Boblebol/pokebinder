import React from 'react';
import PkImg from './PkImg.jsx';
import TBadge from './TBadge.jsx';
import { STATUS_CONFIG } from '../data/index.js';
import { hexToRgba } from '../utils/color.js';

export default function PkCard({ p, status, onTap, onStatusCycle, isFirst }) {
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG[null];

  return (
    <div
      id={`pk-card-${p.id}`}
      data-tour={isFirst ? 'first-card' : undefined}
      onClick={() => onTap(p)}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'transform 0.12s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onPointerDown={(ev) => {
        ev.currentTarget.style.transform = 'scale(0.94)';
      }}
      onPointerUp={(ev) => {
        ev.currentTarget.style.transform = 'scale(1)';
      }}
      onPointerLeave={(ev) => {
        ev.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 6px 0'
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            color: 'rgba(255, 255, 255, 0.28)'
          }}>
            #{String(p.id).padStart(3, '0')}
          </div>
          <button
            data-tour={isFirst ? 'status-btn' : undefined}
            onClick={(ev) => {
              ev.stopPropagation();
              if (onStatusCycle) {
                const next = !status ? 'en main' : status === 'en main' ? 'rangé' : null;
                onStatusCycle(next);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              color: sc.color,
              fontSize: 7.5,
              fontWeight: 700,
              opacity: 0.8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${status ? hexToRgba(sc.color, 0.25) : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12,
              padding: '2px 6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.12s'
            }}
          >
            <span style={{ fontSize: 9, lineHeight: 1 }}>{sc.icon}</span>
            <span style={{ fontFamily: 'inherit' }}>{sc.label}</span>
          </button>
        </div>
        <div style={{
          padding: '3px 6px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <PkImg p={p} sz={62} />
        </div>
        <div style={{
          padding: '0 5px 3px',
          textAlign: 'center',
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.88)',
          lineHeight: 1.3,
          minHeight: 24
        }}>
          {p.name}
        </div>
        <div style={{
          padding: '0 4px 6px',
          display: 'flex',
          gap: 3,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {p.types.map(t => (
            <TBadge key={t} type={t} />
          ))}
        </div>
      </div>
      <div style={{ height: 3, background: sc.color }} />
    </div>
  );
}
