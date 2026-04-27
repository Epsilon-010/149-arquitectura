import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ElementType,
  type PropsWithChildren,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const DIRECTIONS: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

// Hoisted at module scope: these are pure constants (CSS strings), so building
// them on every render is wasted work. Vercel rule `rendering-hoist-jsx` /
// `js-cache-function-results`.
const ACCENT = "var(--color-accent, #8e6a36)";
const ACCENT_TRANSPARENT = "rgba(142,106,54,0)";

const MOVING_MAP: Record<Direction, string> = {
  TOP: `radial-gradient(22% 50% at 50% 0%, ${ACCENT} 0%, ${ACCENT_TRANSPARENT} 100%)`,
  LEFT: `radial-gradient(18% 44% at 0% 50%, ${ACCENT} 0%, ${ACCENT_TRANSPARENT} 100%)`,
  BOTTOM: `radial-gradient(22% 50% at 50% 100%, ${ACCENT} 0%, ${ACCENT_TRANSPARENT} 100%)`,
  RIGHT: `radial-gradient(18% 44% at 100% 50%, ${ACCENT} 0%, ${ACCENT_TRANSPARENT} 100%)`,
};

const HIGHLIGHT = `radial-gradient(80% 180% at 50% 50%, var(--color-accent-soft, #b08e54) 0%, ${ACCENT_TRANSPARENT} 100%)`;

// Aceternity-UI's "hover border gradient" adapted to 149 Arquitectura's
// system: no border-radius, gold accent (instead of blue), and on-brand
// surface colors. The animated gradient travels along the rectangular
// border at idle; on hover it locks into a center highlight.
export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.4,
  clockwise = true,
  ...props
}: PropsWithChildren<
  {
    as?: ElementType;
    containerClassName?: string;
    className?: string;
    /** Time per side, in seconds */
    duration?: number;
    clockwise?: boolean;
  } & AnchorHTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setDirection((prev) => {
        const idx = DIRECTIONS.indexOf(prev);
        const next = clockwise
          ? (idx - 1 + DIRECTIONS.length) % DIRECTIONS.length
          : (idx + 1) % DIRECTIONS.length;
        return DIRECTIONS[next];
      });
    }, duration * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, clockwise, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        // No rounded-*: project rule is zero border-radius.
        "relative inline-flex w-fit items-center justify-center overflow-hidden border border-line p-px transition-colors duration-500 hover:bg-accent-dim",
        containerClassName,
      )}
      {...props}
    >
      {/* Inner content sits above the gradient layer */}
      <div
        className={cn(
          "label-eyebrow relative z-10 bg-ink px-6 py-3 text-fg",
          className,
        )}
      >
        {children}
      </div>

      {/* Animated gradient — fills the 1px gap between border and inner div */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          filter: "blur(2px)",
        }}
        initial={{ background: MOVING_MAP[direction] }}
        animate={{
          background: hovered ? HIGHLIGHT : MOVING_MAP[direction],
        }}
        transition={{ ease: "linear", duration }}
      />
    </Tag>
  );
}
