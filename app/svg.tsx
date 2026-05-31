/* ============================================
   Custom SVG marks — editorial decoration.
   All use currentColor so they adapt to theme.
   ============================================ */

type P = { className?: string; style?: React.CSSProperties; size?: number };

export function Plus({ className, style, size = 18 }: P) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function Asterisk({ className, style, size = 18 }: P) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  );
}

export function Globe({ className, style, size = 18 }: P) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

export function ArrowUpRight({ className, style, size = 18 }: P) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function CornerTick({ className, style, size = 22 }: P) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M4 4h7M4 4v7" />
    </svg>
  );
}

export function Dot({ className, style, size = 10 }: P) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 10 10" aria-hidden>
      <circle cx="5" cy="5" r="5" fill="currentColor" />
    </svg>
  );
}

/* On-brand gradient placeholders for the service hover-previews
   (no image assets needed; swap for real shots anytime). */
export function gradientPreview(i: number, label: string) {
  const palettes = [
    ["#e8a855", "#1a1410"],
    ["#5a78d8", "#0f1320"],
    ["#d8567f", "#1a1014"],
    ["#49c79a", "#0f1a14"],
  ];
  const [a, b] = palettes[i % palettes.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='400' height='300' fill='url(#g)'/><text x='28' y='274' font-family='monospace' font-size='20' fill='white' opacity='0.85'>${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* A subtle full-tile noise/grain using SVG turbulence, encoded as a data URI. */
export const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  );
