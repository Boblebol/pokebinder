/**
 * Convertit une couleur HEX en format RGBA avec l'opacité spécifiée.
 */
export function hexToRgba(hex, opacity) {
  let h = (hex || '#888888').replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const r = parseInt(h.slice(0, 2), 16) || 128;
  const g = parseInt(h.slice(2, 4), 16) || 128;
  const b = parseInt(h.slice(4, 6), 16) || 128;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
