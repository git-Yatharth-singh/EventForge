// Deterministic abstract "poster" art per event — no real images exist in
// the backend (no imageUrl field), so instead of inventing fake photos we
// generate an original gradient treatment from the event's own id/name.
// Same event always renders the same poster.

const PALETTES = [
  ["#7C5CFF", "#2A1B6B", "#12081F"],
  ["#FF6EC7", "#5B2A6B", "#12081F"],
  ["#34D3B0", "#164A5C", "#0A0F1A"],
  ["#F5A623", "#6B3A1B", "#1A0F08"],
  ["#5C8CFF", "#1B2E6B", "#080B1F"],
  ["#FB6B6B", "#6B1B3A", "#1F080F"],
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getEventPoster(event) {
  const seed = hashString(String(event?.id ?? event?.name ?? "eventforge"));
  const palette = PALETTES[seed % PALETTES.length];
  const angle = 120 + (seed % 5) * 24;
  const cx = 20 + (seed % 60);
  const cy = 10 + ((seed >> 3) % 50);

  return {
    background: `
      radial-gradient(circle at ${cx}% ${cy}%, ${palette[0]}55, transparent 55%),
      linear-gradient(${angle}deg, ${palette[1]}, ${palette[2]})
    `,
    accent: palette[0],
  };
}
