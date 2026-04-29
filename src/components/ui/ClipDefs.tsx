// Global SVG clipPath definitions. Mounted once at the App root so any
// element can reference these via `clip-path: url(#id)`.
//
// Path structure for project cards: every shape preserves all four
// rounded outer corners (Q quadratic curves at each corner) and adds
// ONE concave bite somewhere along an edge — between corners, never
// replacing them. The bite is a cubic bezier (C) that dips into the
// rectangle. Different cards bite different edges so the grid never
// repeats a silhouette.
//
// clipPathUnits="objectBoundingBox" → coords are 0–1 normalised, so
// each shape scales to whatever element it clips.
export function ClipDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Hero — DESKTOP. Rectangular cutout, bottom-left, with a
            true elliptical arc at the inner corner (A command). 55%
            wide × 38% tall, radius bumped to 0.14 for a softer,
            more visibly rounded transition. */}
        <clipPath id="hero-bite" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 1,0 L 1,1 L 0.53,1 L 0.53,0.76 A 0.14 0.14 0 0 0 0.39 0.62 L 0,0.62 L 0,0 Z" />
        </clipPath>

        {/* Hero — MOBILE. Wider cutout (78% on x) so both ARQUITECTURA
            and the longest flipping verb fit cleanly. Asymmetric arc
            radius (rx=0.10, ry=0.05) compensates for the portrait
            aspect ratio: in objectBoundingBox space, an x-unit on a
            tall viewport renders as fewer pixels than a y-unit, so a
            symmetric `A 0.08 0.08` would render as a vertically-
            stretched ellipse — the "hand-drawn" look. With rx > ry
            the rendered curve reads as a near-circular quarter on a
            ~9:16 viewport. */}
        <clipPath id="hero-bite-mobile" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 1,0 L 1,1 L 0.78,1 L 0.78,0.83 A 0.10 0.05 0 0 0 0.68 0.78 L 0,0.78 L 0,0 Z" />
        </clipPath>

        {/* === Project cards — all four corners rounded; ONE concave
            bite on a different edge per card === */}

        {/* bite-1 — bite on BOTTOM edge, centered.
            Project A — 16/10 large featured. */}
        <clipPath id="bite-1" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.95 Q 1,1 0.95,1 L 0.65,1 C 0.55,0.78 0.35,0.78 0.25,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>

        {/* bite-2 — bite on RIGHT edge, mid-height.
            Project B — 3/4 narrow tall. */}
        <clipPath id="bite-2" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.30 C 0.80,0.40 0.80,0.60 1,0.70 L 1,0.95 Q 1,1 0.95,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>

        {/* bite-3 — bite on TOP edge, centered.
            Project C — 4/5 medium portrait. */}
        <clipPath id="bite-3" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.30,0 C 0.40,0.20 0.60,0.20 0.70,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.95 Q 1,1 0.95,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>

        {/* bite-4 — bite on LEFT edge, mid-height.
            Project D — 16/10 wide. */}
        <clipPath id="bite-4" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.95 Q 1,1 0.95,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.70 C 0.20,0.60 0.20,0.40 0,0.30 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>

        {/* bite-5 — bite on BOTTOM edge, offset right.
            Project E — 16/10 large featured. */}
        <clipPath id="bite-5" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.95 Q 1,1 0.95,1 L 0.80,1 C 0.70,0.78 0.50,0.78 0.40,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>

        {/* bite-6 — bite on BOTTOM edge, offset left.
            Project F — 4/5 narrow. */}
        <clipPath id="bite-6" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0 L 0.95,0 Q 1,0 1,0.05 L 1,0.95 Q 1,1 0.95,1 L 0.65,1 C 0.55,0.78 0.30,0.78 0.20,1 L 0.05,1 Q 0,1 0,0.95 L 0,0.05 Q 0,0 0.05,0 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
