import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Segment = { text: string; italic?: boolean; muted?: boolean };

type Props = {
  /** Plain string — split into words. */
  words?: string;
  /** Or pass segments to mix italic/muted styles inline. */
  segments?: Segment[];
  className?: string;
  /** Apply blur(10px → 0) on top of the opacity fade. Default true. */
  filter?: boolean;
  /** Per-word fade duration in seconds. */
  duration?: number;
  /** ms between word animations. */
  staggerMs?: number;
  /** IntersectionObserver rootMargin — controls how far into the
      viewport the trigger fires. Default fires when the bottom of
      the element is ~15% above the bottom of the viewport. Pass
      something like "0px 0px -200px 0px" for a pixel-based threshold. */
  rootMargin?: string;
};

// Word-by-word blur+fade reveal. The animation is triggered ONCE via
// IntersectionObserver — when the user scrolls within `rootMargin` of
// the element, every word is animated in with a stagger and the
// observer disconnects (no re-trigger on re-entry, no scroll-coupled
// re-fire). Inherits typography and colour from the parent — no
// hardcoded styling.
export function TextGenerateEffect({
  words,
  segments,
  className = "",
  filter = true,
  duration = 0.6,
  staggerMs = 80,
  rootMargin = "0px 0px -15% 0px",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || fired) return;

    // Honour reduced motion — show all words immediately, no animation.
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFired(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setFired(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [fired, rootMargin]);

  // Flatten segments into a list of words tagged with their styling.
  const items: Segment[] =
    segments ?? (words != null ? [{ text: words }] : []);
  const wordList = items.flatMap((seg) =>
    seg.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({
        word,
        italic: seg.italic,
        muted: seg.muted,
      })),
  );

  return (
    <div ref={containerRef} className={className}>
      {wordList.map(({ word, italic, muted }, idx) => {
        const cls = [italic ? "italic" : "", muted ? "text-fg-muted" : ""]
          .filter(Boolean)
          .join(" ");
        // Span stays as default `inline` (no inline-block). Inline
        // boxes preserve the trailing whitespace between siblings,
        // so the words read as separate words. Inline-block would
        // collapse the trailing space at the edge of each box and
        // glue everything together. We only animate opacity and
        // filter — both are valid on inline boxes — so there's no
        // reason to force inline-block.
        return (
          <motion.span
            key={idx}
            className={cls}
            initial={false}
            animate={
              fired
                ? { opacity: 1, filter: filter ? "blur(0px)" : "none" }
                : { opacity: 0, filter: filter ? "blur(10px)" : "none" }
            }
            transition={{
              duration,
              delay: fired ? (idx * staggerMs) / 1000 : 0,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            {word}{" "}
          </motion.span>
        );
      })}
    </div>
  );
}
