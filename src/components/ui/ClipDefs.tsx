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
        {/* Hero — DESKTOP. Rectangular cutout, bottom-left, generous
            rounded inner corner. Occupies left 55% × bottom 38% of
            the viewport. Tuned for landscape (wider than tall). */}
        <clipPath id="hero-bite" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 1,0 L 1,1 L 0.55,1 L 0.55,0.70 Q 0.55,0.62 0.47,0.62 L 0,0.62 L 0,0 Z" />
        </clipPath>

        {/* Hero — MOBILE. Same shape language but tuned for portrait
            viewports: WIDER on x (so the headline fits) and SHORTER
            on y (so the photograph keeps presence above). Cutout
            occupies left 75% × bottom 25%. */}
        <clipPath id="hero-bite-mobile" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 1,0 L 1,1 L 0.78,1 L 0.78,0.79 Q 0.78,0.74 0.73,0.74 L 0,0.74 L 0,0 Z" />
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
