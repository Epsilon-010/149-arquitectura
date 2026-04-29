import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

export type CarouselSlide = {
  numero: string;
  titulo: string;
  categoria: string;
  ciudad: string;
  ano: number;
  src: string;
};

type Props = {
  slides: CarouselSlide[];
  /** ms between auto-advance. Default 5000. */
  interval?: number;
  className?: string;
};

const SWIPE_THRESHOLD = 60;
const EASE_LUXURY: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
// If a remote image (Unsplash, etc.) fails to load — bad network, blocked
// host, dead photo ID — drop in this local image so the slide is never
// blank. The fallback lives in /public/proyectos/.
const FALLBACK_IMG = "/proyectos/casa-Photoroom.webp";

// Directional wipe transition. A vertical line travels across the image
// in the navigation direction, revealing the new slide and covering the
// outgoing one. Going forward (→), the line moves left-to-right; going
// back (←), right-to-left. Felt heavily editorial — closer to a luxury
// magazine page-turn than a video crossfade.
const slideVariants: Variants = {
  initial: (direction: 1 | -1) => ({
    clipPath:
      direction === 1
        ? "inset(0% 100% 0% 0%)" // hidden from the right (will reveal left → right)
        : "inset(0% 0% 0% 100%)", // hidden from the left (will reveal right → left)
    scale: 1.06,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
  },
  exit: (direction: 1 | -1) => ({
    clipPath:
      direction === 1
        ? "inset(0% 0% 0% 100%)" // wipe out from left → right
        : "inset(0% 100% 0% 0%)", // wipe out from right → left
    scale: 1.02,
  }),
};

// 149's hero carousel.
//
// - Auto-advances on a loop.
// - User interactions (arrow click, dot click, swipe) RESET the timer so the
//   user always gets the full interval to read after navigating manually.
// - Hover only reveals the info card; the carousel keeps moving.
// - Mobile (no hover): info card sits below the image, always visible.
// - Touch swipe with 60px threshold.
// - Compact aspect ratios so the image fits in the viewport without scroll.
// - Respects prefers-reduced-motion (no auto-play).
export function ProjectCarousel({
  slides,
  interval = 5000,
  className = "",
}: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Bumped on any user navigation; the progress bar is keyed to it so it
  // restarts in sync with the timer reset.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setReduceMotion(
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Preload all slide images on mount so cross-fades are instant — no flicker
  // when the timer advances or the user clicks an arrow. Only the first slide
  // gets `fetchPriority="high"` (LCP); the rest are warmed in idle time.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
        .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    idle(() => {
      slides.forEach((s, i) => {
        if (i === 0) return; // first one is already loaded by the visible <img>
        const img = new Image();
        img.decoding = "async";
        img.src = s.src;
      });
    });
  }, [slides]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reduceMotion) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % slides.length);
      setTick((t) => t + 1);
    }, interval);
  }, [reduceMotion, interval, slides.length]);

  // Boot + cleanup the auto-play timer.
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (idx: number, dir: 1 | -1) => {
    setDirection(dir);
    setActive(((idx % slides.length) + slides.length) % slides.length);
    setTick((t) => t + 1);
    startTimer(); // user interacted → restart the auto-advance window
  };
  const next = () => goTo(active + 1, 1);
  const prev = () => goTo(active - 1, -1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const slide = slides[active];

  return (
    <div
      className={`group/carousel relative w-full ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ===== Image stage ===== */}
      <div className="relative aspect-3/2 w-full border border-line-subtle bg-surface md:aspect-video">
        {/* Crop marks — small L-shaped ticks at each corner of the
            image stage. Architectural drafting reference (the marks a
            printer leaves so the page knows where to be cut). Sits
            outside the image but inside the carousel root, so they
            stay rock-still while the slides wipe behind. */}
        <CropMark className="absolute -top-2 -left-2" rotate={0} />
        <CropMark className="absolute -top-2 -right-2" rotate={90} />
        <CropMark className="absolute -bottom-2 -right-2" rotate={180} />
        <CropMark className="absolute -bottom-2 -left-2" rotate={270} />

        <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={`${slide.titulo} — ${slide.ciudad}`}
            width={1600}
            height={1000}
            decoding="async"
            loading={active === 0 ? "eager" : "lazy"}
            draggable={false}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="center"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0 : 1.3,
              ease: EASE_LUXURY,
            }}
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.dataset.fellback) {
                t.dataset.fellback = "1";
                t.src = FALLBACK_IMG;
              }
            }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: "grayscale(15%) contrast(1.02) brightness(0.97)",
            }}
          />
        </AnimatePresence>

        {/* Bottom scrim — readability for the always-on info on mobile / hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to top, rgba(28,24,19,0.78) 0%, rgba(28,24,19,0.40) 35%, transparent 100%)",
          }}
        />

        {/* Info card — hover-revealed on desktop only.
            Hidden on mobile because the same data is shown below the image
            (the always-visible mobile block) and would otherwise duplicate. */}
        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden p-6
            sm:p-8 md:block md:translate-y-2 md:p-10 md:opacity-0
            md:transition-all md:duration-1000 md:ease-out
            md:group-hover/carousel:translate-y-0 md:group-hover/carousel:opacity-100
          "
          style={{ color: "#f0eadb" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${active}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_LUXURY }}
            >
              <div
                className="font-mono text-[0.7rem] tracking-[0.28em]"
                style={{ color: "var(--color-accent-soft)" }}
              >
                {slide.numero}
              </div>
              <h3 className="font-display mt-3 text-3xl font-light leading-[0.95] sm:text-4xl md:text-5xl">
                {slide.titulo}
              </h3>
              <p className="font-mono mt-3 text-[0.68rem] tracking-[0.28em] uppercase opacity-75">
                {slide.categoria} · {slide.ciudad} · {slide.ano}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Per-slide progress — keyed to (active, tick) so manual nav resets it */}
        {!reduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px overflow-hidden"
            style={{ background: "rgba(240,234,219,0.10)" }}
          >
            <motion.div
              key={`progress-${active}-${tick}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: interval / 1000, ease: "linear" }}
              className="h-full origin-left"
              style={{ background: "var(--color-accent-soft)" }}
            />
          </div>
        )}
        </div>
      </div>

      {/* ===== Controls — desktop only (mobile uses swipe + auto-play) ===== */}
      <div className="mt-8 hidden grid-cols-3 items-center gap-4 sm:mt-10 md:grid">
        <span className="font-mono justify-self-start whitespace-nowrap text-[0.7rem] tracking-[0.28em] text-fg-muted">
          {String(active + 1).padStart(2, "0")} ·{" "}
          {String(slides.length).padStart(2, "0")}
        </span>

        {/* Arrows — unified frame with internal divider for a single module feel.
            `active:` states give touch users immediate visual feedback (no hover on mobile). */}
        <div className="flex justify-self-center border border-line-subtle">
          <button
            type="button"
            onClick={prev}
            aria-label="Proyecto anterior"
            style={{ touchAction: "manipulation" }}
            className="group/btn flex h-11 w-14 items-center justify-center border-r border-line-subtle text-fg-muted transition-colors duration-700 hover:bg-accent-dim hover:text-accent active:bg-accent-dim active:text-accent"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Proyecto siguiente"
            style={{ touchAction: "manipulation" }}
            className="group/btn flex h-11 w-14 items-center justify-center text-fg-muted transition-colors duration-700 hover:bg-accent-dim hover:text-accent active:bg-accent-dim active:text-accent"
          >
            <Arrow dir="right" />
          </button>
        </div>

        <ul
          className="flex items-center justify-self-end gap-3"
          aria-label="Slides"
        >
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  aria-label={`Ir a ${s.titulo}`}
                  aria-current={isActive ? "true" : undefined}
                  className="block h-px transition-all duration-700 ease-out hover:opacity-100"
                  style={{
                    width: isActive ? 44 : 14,
                    background: isActive
                      ? "var(--color-accent)"
                      : "var(--color-line-subtle)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile-only: always-visible info card (no controls — swipe + auto-play) */}
      <div className="mt-6 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-info-${active}`}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -4, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_LUXURY }}
            className="grid grid-cols-12 gap-x-4 gap-y-3"
          >
            <span className="font-mono col-span-12 text-[0.68rem] tracking-[0.28em] text-accent">
              {slide.numero}
            </span>
            <h3 className="font-display col-span-12 text-3xl font-light leading-[0.95] text-fg">
              {slide.titulo}
            </h3>
            <p className="font-mono col-span-12 text-[0.66rem] tracking-[0.28em] uppercase text-fg-muted">
              {slide.categoria} · {slide.ciudad} · {slide.ano}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// 8px L-shaped corner mark — drafting reference. Drawn as two 1px
// strokes meeting at a corner, rotated to fit each of the four
// corners. Pure decoration; pointer-events stay through.
function CropMark({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: 0 | 90 | 180 | 270;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <line
        x1="0"
        y1="0.5"
        x2="14"
        y2="0.5"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
      <line
        x1="0.5"
        y1="0"
        x2="0.5"
        y2="14"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
    </svg>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : "none" }}
      className="transition-transform duration-500 group-hover/btn:translate-x-0.5"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
