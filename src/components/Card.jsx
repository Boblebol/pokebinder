import React from 'react';

export default function Card({ children }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, .05)',
      borderRadius: 12,
      padding: 14,
      border: '1px solid rgba(255, 255, 255, .08)'
    }}>
      {children}
    </div>
  );
}
