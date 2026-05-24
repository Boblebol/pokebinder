import React from 'react';

export default function Lbl({ children }) {
  return (
    <div style={{
      fontSize: 10,
      color: 'rgba(255, 255, 255, .32)',
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 10
    }}>
      {children}
    </div>
  );
}
