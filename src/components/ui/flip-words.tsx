import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  /** Words to rotate through. Cycles indefinitely. */
  words: string[];
  /** ms each word stays before the next swap. */
  intervalMs?: number;
  /** Extra classes on the wrapping span. */
  className?: string;
};

// Cycles through `words` in-place. Reserves horizontal space for the
// widest word via an invisible spacer so the surrounding line never
// reflows mid-flip — important when this sits inside a large display
// headline. Inherits font, color, italic from its parent. Respects
// prefers-reduced-motion (renders the first word static).
export function FlipWords({
  words,
  intervalMs = 3500,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((p) => (p + 1) % words.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [reduce, intervalMs, words.length]);

  // Widest word controls the box width — line stays stable.
  const widest = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span className={`relative inline-block ${className}`}>
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {widest}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: "0.35em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.35em", filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
