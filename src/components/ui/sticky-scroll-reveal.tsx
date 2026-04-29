import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

type Item = {
  /** Two-digit number — "01", "02", etc. */
  n: string;
  titulo: string;
  desc: string;
};

type Props = {
  items: Item[];
  /** Tagline shown above the active item title in the sticky pane.
      Defaults to "Servicio · 2025" — override per use. */
  paneEyebrow?: string;
  className?: string;
};

const EASE_LUXURY: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

// Brand-aligned sticky scroll-reveal. The left column is the
// scrolling editorial list; each item lives in a viewport-tall slot
// so it dominates as the user scrolls past it. Item opacity is
// animated based on which slot is closest to the page-scroll
// position. The right column is a sticky pane that stays parked at
// `top-32` and crossfades through a massive typographic preview of
// the active item — italic Caviar Dreams numeral + caption.
//
// Mobile (<lg): the pane is hidden and the list stacks normally.
// Desktop sticky behaviour kicks in only at lg+ where there's
// horizontal room for the two-column layout.
export function StickyScroll({
  items,
  paneEyebrow = "Servicio · 2025",
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Page-driven scroll progress. offset ["start start", "end end"]
  // maps progress 0 to "section top hits viewport top" and 1 to
  // "section bottom hits viewport bottom" — so the active index
  // sweeps through items linearly with the user's scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      items.length - 1,
      Math.max(0, Math.floor(latest * items.length)),
    );
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-12 gap-y-12 lg:gap-x-12 ${className}`}
    >
      {/* ===== LEFT — scrolling editorial list ===== */}
      <ul className="col-span-12 lg:col-span-7">
        {items.map((item, i) => (
          <li
            key={item.n}
            className="border-t border-line-subtle py-12 last:border-b lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:py-0"
          >
            <motion.div
              animate={{ opacity: activeIdx === i ? 1 : 0.28 }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-4 sm:gap-x-6"
            >
              <span className="font-mono col-span-2 text-[0.78rem] tracking-[0.28em] text-accent md:col-span-1 md:text-[0.85rem]">
                {item.n}
              </span>
              <h3
                className="font-display col-span-10 font-light leading-[1.05] text-fg md:col-span-11"
                style={{
                  fontSize: "clamp(1.85rem, 5.5vw, 4.75rem)",
                  letterSpacing: "-0.015em",
                }}
              >
                {item.titulo}
              </h3>
              <p className="col-span-12 text-lg leading-relaxed text-fg-muted md:col-span-11 md:col-start-2 md:text-xl lg:max-w-2xl">
                {item.desc}
              </p>
            </motion.div>
          </li>
        ))}
      </ul>

      {/* ===== RIGHT — sticky typographic preview, lg+ only =====
          Parks at top-32 (clears the fixed nav). The active item's
          numeral is rendered massive in italic Caviar Dreams; bottom
          labels and a top-right slide counter give the pane the air
          of a museum wall plate. */}
      <aside className="col-span-5 hidden lg:block">
        <div className="sticky top-32 flex h-[65vh] items-center justify-center overflow-hidden border border-line bg-ink">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: EASE_LUXURY }}
              className="absolute inset-0"
            >
              {/* Massive italic numeral — the typographic centerpiece */}
              <span
                className="font-display pointer-events-none absolute inset-0 flex items-center justify-center italic leading-none text-fg-muted"
                style={{
                  fontSize: "clamp(8rem, 22vw, 22rem)",
                  opacity: 0.22,
                  letterSpacing: "-0.02em",
                }}
              >
                {items[activeIdx].n}
              </span>

              {/* Bottom labels */}
              <div className="absolute bottom-8 left-8 right-8">
                <span className="label-eyebrow">{paneEyebrow}</span>
                <h4 className="font-display mt-3 text-2xl leading-snug text-fg">
                  {items[activeIdx].titulo}
                </h4>
              </div>

              {/* Top-right slide counter */}
              <div className="absolute right-8 top-8">
                <span className="font-mono text-[0.66rem] tracking-[0.28em] uppercase text-fg-faint">
                  {String(activeIdx + 1).padStart(2, "0")} ·{" "}
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
