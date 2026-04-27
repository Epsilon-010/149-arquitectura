import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type Dir = "top" | "right" | "bottom" | "left";

type Props = {
  imageUrl: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  children?: ReactNode;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
};

// Aceternity's "direction-aware hover" adapted to the 149 system:
// - no border-radius
// - tokens (bg-surface, bg-ink, text-fg) instead of gray/black
// - flexes to its parent's aspect ratio (no fixed 96/60 sizes)
// - no console.log
// - typed for verbatimModuleSyntax + React 19
export function DirectionAwareHover({
  imageUrl,
  imageAlt = "",
  imageWidth = 1600,
  imageHeight = 1200,
  children,
  childrenClassName,
  imageClassName,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [direction, setDirection] = useState<Dir>("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!ref.current) return;
    setDirection(detectDirection(event, ref.current));
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "group/card relative h-full w-full overflow-hidden bg-surface",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          {/* Dark scrim that fades in on hover (independent of light/dark theme) */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{ background: "var(--color-scrim)" }}
          />

          {/* Image — slightly oversized so the directional pan has room */}
          <motion.div
            variants={imageVariants}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="h-full w-full"
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              loading="lazy"
              decoding="async"
              className={cn(
                "h-full w-full scale-[1.08] object-cover transition-[filter] duration-700",
                "filter-[grayscale(100%)_contrast(1.05)_brightness(0.9)]",
                "group-hover/card:filter-[grayscale(0%)_contrast(1)_brightness(0.95)]",
                imageClassName,
              )}
            />
          </motion.div>

          {/* Reveal content — slides in from the cursor side on hover.
              Forced bone-cream text so it reads over the dark scrim
              regardless of the page palette. */}
          {children ? (
            <motion.div
              variants={textVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 md:p-8",
                childrenClassName,
              )}
              style={{ color: "#f0eadb" }}
            >
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Maps the cursor's entry quadrant to a direction string used by motion variants.
function detectDirection(
  ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
  el: HTMLElement,
): Dir {
  const { width: w, height: h, left, top } = el.getBoundingClientRect();
  const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
  const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
  const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
  switch (d) {
    case 0:
      return "top";
    case 1:
      return "right";
    case 2:
      return "bottom";
    case 3:
    default:
      return "left";
  }
}

const imageVariants: Variants = {
  initial: { x: 0, y: 0 },
  exit: { x: 0, y: 0 },
  top: { y: 18 },
  bottom: { y: -18 },
  left: { x: 18 },
  right: { x: -18 },
};

const textVariants: Variants = {
  initial: { y: 16, x: 0, opacity: 0 },
  exit: { y: 16, x: 0, opacity: 0 },
  top: { y: 0, opacity: 1 },
  bottom: { y: 0, opacity: 1 },
  left: { x: 0, y: 0, opacity: 1 },
  right: { x: 0, y: 0, opacity: 1 },
};
