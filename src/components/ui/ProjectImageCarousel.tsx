import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const FALLBACK_IMG = "/proyectos/casa-Photoroom.webp";
// Preview pacing — fast enough that a hover/scroll-by glance reveals
// the whole set, slow enough that each image still reads as a frame.
// 1.6 s per slide with a 0.55 s crossfade gives ~1.05 s of steady
// display. Pure opacity crossfade (no scale, no translate) — adding
// motion on top of opacity made the swap read as a generic
// "PowerPoint zoom". The full project gallery (with no time limit)
// lives in the lightbox; this carousel is just a hint that the card
// has more depth.
const CYCLE_MS = 1600;
const CROSSFADE_S = 0.55;
const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

type Props = {
  /** Cloudinary URLs in display order. First entry is the cover. */
  images: string[];
  /** alt text used for every slide (the metadata is the same — only
      the angle changes). */
  alt: string;
};

// Per-card carousel for the project grid.
//
// Two interaction modes, picked at runtime by the device's input
// capability:
//
//   · Hover-capable (mouse/trackpad) — card stays on its cover image.
//     On hover the carousel auto-cycles through every photograph at
//     CYCLE_MS, and a row of slide-indicator dots fades in. When the
//     cursor leaves, the card snaps back to the cover so the grid
//     always returns to a coherent gallery of first frames.
//
//   · Touch / no-hover (phones, tablets) — the card auto-plays a
//     SINGLE pass through every image once it crosses 50% of the
//     viewport, then settles back on the cover. Reads as the card
//     "introducing itself" — the visitor gets a full preview of the
//     project without needing to tap or swipe. Each card only plays
//     once per page load (IntersectionObserver disconnects after the
//     first trigger) so scrolling back doesn't re-trigger.
//
// `prefers-reduced-motion` disables both modes — the user just sees
// the cover.
export function ProjectImageCarousel({ images, alt }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  /** True while the mobile single-pass auto-play is running. Drives
      the indicator dots' visibility on touch devices. */
  const [autoPlaying, setAutoPlaying] = useState(false);
  const canHoverRef = useRef(true);
  const reduceMotionRef = useRef(false);

  // Detect input capabilities once on mount. Keeping these in refs
  // (not state) avoids a second render — they don't affect markup
  // until the cycle effect actually runs.
  useEffect(() => {
    canHoverRef.current = window.matchMedia?.("(hover: hover)").matches ?? true;
    reduceMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  // Cycle while hovered (desktop). When the cursor leaves, snap back
  // to the cover so the grid always returns to a coherent gallery of
  // first images — no card "stuck" mid-cycle.
  useEffect(() => {
    if (!hovered) {
      setIndex(0);
      return;
    }
    if (!canHoverRef.current || reduceMotionRef.current) return;
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [hovered, images.length]);

  // Mobile-only viewport-trigger. When 50% of the card is visible we
  // arm the single-pass auto-play. Disconnects immediately after
  // firing so the cycle only happens once per page load.
  useEffect(() => {
    if (canHoverRef.current) return;
    if (reduceMotionRef.current) return;
    if (images.length <= 1) return;
    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setAutoPlaying(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [images.length]);

  // Drive the mobile single-pass cycle. Walks `index` from 1 → last,
  // then resets to 0 (cover) and clears `autoPlaying` so the dots
  // fade out and the counter fades back in.
  useEffect(() => {
    if (!autoPlaying) return;
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      if (i >= images.length) {
        setIndex(0);
        setAutoPlaying(false);
        window.clearInterval(id);
        return;
      }
      setIndex(i);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [autoPlaying, images.length]);

  const src = images[index] ?? FALLBACK_IMG;
  const showCounter = images.length > 1;
  /** Either of the two cycle modes is currently driving the index —
      so the dot indicators should be visible and the counter hidden. */
  const cycling = hovered || autoPlaying;

  return (
    <div
      ref={containerRef}
      // No background colour on the wrapper — any colour here would
      // peek through where the SVG bite's anti-aliased corner pixels
      // blend with the section background, producing a visible
      // hairline halo around the card. Leaving it transparent makes
      // the boundary indistinguishable from the section's paper bg.
      className="group/card relative h-full w-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pure cross-dissolve. Both images present in the DOM at the
          same time during the swap (default `sync` mode), each
          animating its opacity in/out — produces the soft "two
          slides bleed through each other" look you see in editorial
          photography books. No scale or translate so there's no
          residual "effect" feeling. */}
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSSFADE_S, ease: EASE }}
          onError={(e) => {
            const t = e.currentTarget;
            if (!t.dataset.fellback) {
              t.dataset.fellback = "1";
              t.src = FALLBACK_IMG;
            }
          }}
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 filter-[grayscale(70%)_contrast(1)_brightness(0.96)] group-hover/card:filter-[grayscale(0%)_contrast(1)_brightness(1)]"
        />
      </AnimatePresence>

      {/* Subtle scrim — barely visible on hover, just enough to
          anchor the slide-indicator dots against bright photographs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-15"
        style={{ background: "var(--color-scrim)" }}
      />

      {/* Top-right counter — quiet hint that the card has more depth.
          Hidden whenever a cycle is running (hover OR mobile auto-
          play) — the indicator dots take over the signalling role. */}
      {showCounter && (
        <div
          aria-hidden="true"
          className={`font-mono absolute right-3 top-3 z-20 flex h-7 items-center gap-1.5 px-3 text-[0.62rem] uppercase tracking-[0.28em] text-fg transition-opacity duration-300 ${
            cycling ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background: "rgba(248, 247, 242, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-accent" />
          {String(images.length).padStart(2, "0")}
        </div>
      )}

      {/* Slide-indicator dots — visible during any cycle (hover on
          desktop, auto-play on mobile). Active dot widens + accent
          colour. */}
      {showCounter && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 transition-opacity duration-500 ${
            cycling ? "opacity-100" : "opacity-0"
          }`}
        >
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-px transition-all duration-500 ${
                i === index ? "w-6 bg-accent" : "w-2 bg-fg-faint/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
