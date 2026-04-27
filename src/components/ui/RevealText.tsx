import { Fragment, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/motion";

type Segment = { text: string; italic?: boolean; muted?: boolean };

type Props = {
  /** Plain string — will be split into words. */
  text?: string;
  /** Or pass segments to mix italic/muted styles inline. */
  segments?: Segment[];
  className?: string;
  /** ms between word entrances. Default 50. */
  staggerMs?: number;
  /** When the trigger top crosses this viewport %, the reveal fires. */
  start?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  children?: ReactNode;
};

// Splits text into per-word spans wrapped in `overflow:hidden` masks, then
// animates each word from `translateY(110%)` to 0 with a stagger when the
// element scrolls into view. The mask gives the words a "rising into a
// frame" reveal — the editorial signature of luxury portfolios.
export function RevealText({
  text,
  segments,
  className = "",
  staggerMs = 50,
  start = "top 88%",
  as: Tag = "span",
  children,
}: Props) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const node = containerRef.current;
      if (!node) return;

      if (prefersReducedMotion()) {
        gsap.set(node.querySelectorAll("[data-word]"), { yPercent: 0, opacity: 1 });
        return;
      }

      const words = node.querySelectorAll<HTMLSpanElement>("[data-word]");
      if (!words.length) return;

      gsap.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: staggerMs / 1000,
          ease: "expo.out",
          scrollTrigger: {
            trigger: node,
            start,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [text, segments, staggerMs, start] },
  );

  // Build the segments. If `text` is given, treat it as one plain segment.
  const items: Segment[] = segments
    ? segments
    : text != null
      ? [{ text }]
      : [];

  return (
    <Tag
      ref={containerRef as never}
      className={className}
    >
      {items.map((seg, segIdx) => {
        const tokens = seg.text.split(/(\s+)/); // keep whitespace tokens
        return (
          <Fragment key={segIdx}>
            {tokens.map((tok, i) => {
              if (/^\s+$/.test(tok)) return <Fragment key={i}>{tok}</Fragment>;
              if (tok === "") return null;
              const cls = [
                "inline-block",
                seg.italic ? "italic" : "",
                seg.muted ? "text-fg-muted" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ lineHeight: "inherit" }}
                >
                  <span data-word className={cls}>
                    {tok}
                  </span>
                </span>
              );
            })}
          </Fragment>
        );
      })}
      {children}
    </Tag>
  );
}
