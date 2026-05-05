import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Proyecto } from "../../data/proyectos";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
// Minimum horizontal swipe distance (px) on touch devices to advance a
// slide. Lower than the typical 80–120 px threshold because lightbox
// users expect a quick flick, not a deliberate drag.
const SWIPE_THRESHOLD = 50;

type Props = {
  /** Active project — null means closed. Single shared lightbox renders
      one project at a time so the overlay is mounted only when needed. */
  project: Proyecto | null;
  onClose: () => void;
};

// Full-screen project gallery. One instance lives in <Proyectos /> and
// opens whenever any card is clicked. Replaces the previous
// `<a href="#">` cards (which scrolled to top) with a real "show me
// every photograph" interaction that works identically on laptop,
// tablet and phone.
//
// Inputs supported:
//   · click overlay / X button / Esc → close
//   · ← / → or on-screen chevrons → previous / next
//   · horizontal swipe on touch → previous / next
//
// While open, body scroll is locked so the page underneath doesn't
// drift on swipes or wheel events.
export function ProjectLightbox({ project, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const images = project?.imagenes ?? [];
  const total = images.length;

  const next = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Reset to the cover image whenever a different project opens, so the
  // gallery doesn't pick up where the previous project's index left off.
  useEffect(() => {
    if (project) setIndex(0);
  }, [project]);

  // Keyboard nav + body scroll lock — only mounted while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, next, prev, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería: ${project.titulo}`}
        >
          {/* Close — top-right. The whole overlay is also clickable to
              close, but an explicit X is universally readable. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center text-fg transition-colors hover:text-accent sm:right-6 sm:top-6"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>

          {/* Project info — top-left. Quiet metadata block: numero,
              titulo, ciudad. Same hierarchy as the grid card so opening
              the lightbox feels like a continuation, not a new screen. */}
          <div
            className="absolute left-4 top-4 z-30 max-w-[60%] sm:left-6 sm:top-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-[0.66rem] tracking-[0.28em] text-accent sm:text-[0.7rem]">
              {project.numero}
            </span>
            <h3 className="font-display mt-1 text-base font-light leading-tight text-fg sm:text-xl md:text-2xl">
              {project.titulo}
            </h3>
            <span className="font-mono mt-1 block text-[0.6rem] tracking-[0.28em] uppercase text-fg-muted sm:text-[0.66rem]">
              {project.ciudad}
            </span>
          </div>

          {/* Counter — bottom-center. Shown when a project has more than
              one photograph; otherwise the lightbox is just "open photo". */}
          {total > 1 && (
            <div
              className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 sm:bottom-6"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="font-mono text-[0.66rem] tracking-[0.28em] text-fg-muted sm:text-[0.7rem]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(index + 1).padStart(2, "0")} ·{" "}
                {String(total).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Prev / next chevrons — visible at sm+ where there's room
              to place them outside the photograph. On phones the user
              swipes instead (the on-screen arrows would crowd the
              image inside a ~360 px wide viewport). */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Imagen anterior"
                className="absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-fg transition-colors hover:text-accent sm:flex md:left-6"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Imagen siguiente"
                className="absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-fg transition-colors hover:text-accent sm:flex md:right-6"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}

          {/* Image stage. Generous padding above/below for the metadata
              and counter so the photograph never collides with them on
              short viewports. `object-contain` keeps the aspect ratio
              and never crops. */}
          <div className="relative flex h-full w-full items-center justify-center px-4 py-24 sm:px-20 sm:py-20">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${project.titulo} — imagen ${index + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
