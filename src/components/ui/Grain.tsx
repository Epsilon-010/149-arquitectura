// Atmospheric film-grain overlay. SVG fractal noise rasterised into a
// tiled background image, held at very low opacity over the entire
// viewport. mix-blend-multiply tints the noise into the cream so it
// reads as analog texture rather than gray static. Sits below the
// custom cursor (z-200) and below the mobile menu (z-60) — so the
// menu stays clean — but above all section content. Pointer-events
// are off so it never interferes with input.
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] opacity-[0.07] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: "220px 220px",
      }}
    />
  );
}
