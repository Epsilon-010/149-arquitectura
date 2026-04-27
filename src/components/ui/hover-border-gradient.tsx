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

  // Gold accent #c8a96e and warm fg #f0ede8 read clearly on bg-ink.
  // Each gradient is positioned at one of the 4 sides of the rect.
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(22% 50% at 50% 0%, #c8a96e 0%, rgba(200,169,110,0) 100%)",
    LEFT: "radial-gradient(18% 44% at 0% 50%, #c8a96e 0%, rgba(200,169,110,0) 100%)",
    BOTTOM:
      "radial-gradient(22% 50% at 50% 100%, #c8a96e 0%, rgba(200,169,110,0) 100%)",
    RIGHT:
      "radial-gradient(18% 44% at 100% 50%, #c8a96e 0%, rgba(200,169,110,0) 100%)",
  };

  // Hover state: a softer, larger highlight centered on the element.
  const highlight =
    "radial-gradient(80% 180% at 50% 50%, rgba(232,213,168,0.65) 0%, rgba(200,169,110,0) 100%)";

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
        "relative inline-flex w-fit items-center justify-center overflow-hidden border border-line-subtle bg-ink/40 p-px transition-colors duration-500 hover:bg-accent-dim",
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
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? highlight : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />
    </Tag>
  );
}
