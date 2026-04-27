import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type ProjectSlide = {
  numero: string;
  titulo: string;
  meta: string; // e.g. "Residencial · Oaxaca · 2024"
  descripcion: string;
  src: string;
};

type Props = {
  slides: ProjectSlide[];
  autoplay?: boolean;
  /** ms between slides when autoplay is on. Default 5500. */
  interval?: number;
  className?: string;
};

// Aceternity's "animated testimonials" rebuilt for 149's portfolio carousel:
// - no border-radius (project rule §1)
// - tokens (text-fg, text-fg-muted, text-accent) instead of gray/black
// - replaces @tabler/icons-react with inline SVG (one less dep)
// - autoplay pauses on hover (good UX — rule §7 `interruptible`)
// - cleanup correct on unmount; respects prefers-reduced-motion
export function AnimatedTestimonials({
  slides,
  autoplay = false,
  interval = 5500,
  className,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current =
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const next = () => setActive((p) => (p + 1) % slides.length);
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!autoplay || paused || reduceMotionRef.current) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
    // intentionally not depending on `next` (stable ref via setActive)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, paused, interval, slides.length]);

  // Stable rotation per index so the stack doesn't reshuffle every render.
  const rotateFor = (i: number) => ((i * 31) % 7) - 3; // -3..3 deg

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn("mx-auto w-full font-sans", className)}
    >
      <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* ===== Image stack ===== */}
        <div className="relative aspect-4/5 w-full md:aspect-3/4">
          <AnimatePresence>
            {slides.map((slide, index) => {
              const isActive = index === active;
              return (
                <motion.div
                  key={slide.src}
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    rotate: rotateFor(index),
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.55,
                    scale: isActive ? 1 : 0.94,
                    rotate: isActive ? 0 : rotateFor(index),
                    zIndex: isActive ? 40 : slides.length - index,
                    y: isActive ? [0, -24, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.92, rotate: rotateFor(index) }}
                  transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full overflow-hidden border border-line-subtle bg-surface">
                    <img
                      src={slide.src}
                      alt={`${slide.titulo} — ${slide.meta}`}
                      width={1200}
                      height={1500}
                      draggable={false}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{
                        filter: "grayscale(35%) contrast(1.05) brightness(0.92)",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ===== Text panel ===== */}
        <div className="flex flex-col justify-between gap-10">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="font-mono text-[0.72rem] tracking-widest text-accent">
              {slides[active].numero}
            </span>
            <h3 className="font-display mt-3 text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] text-fg">
              {slides[active].titulo}
            </h3>
            <p className="font-mono mt-4 text-[0.7rem] tracking-widest uppercase text-fg-muted">
              {slides[active].meta}
            </p>
            <motion.p className="mt-8 max-w-md text-base leading-relaxed text-fg-muted">
              {slides[active].descripcion.split(" ").map((word, i) => (
                <motion.span
                  key={`${active}-${i}`}
                  initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                    delay: 0.02 * i,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={prev}
              aria-label="Proyecto anterior"
              className="group flex h-11 w-11 items-center justify-center border border-line-subtle text-fg-muted transition-colors duration-500 hover:border-accent hover:text-accent"
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Proyecto siguiente"
              className="group flex h-11 w-11 items-center justify-center border border-line-subtle text-fg-muted transition-colors duration-500 hover:border-accent hover:text-accent"
            >
              <ArrowIcon dir="right" />
            </button>
            <span className="font-mono text-[0.7rem] tracking-widest text-fg-muted">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : "none" }}
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
