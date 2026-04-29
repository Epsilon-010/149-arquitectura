import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Reveal } from "../ui/Reveal";
import { gsap, prefersReducedMotion } from "../../lib/motion";

// Manifesto split into segments. Each segment carries its own emphasis
// (italic / muted) — words are individual spans so GSAP can scrub their
// opacity tied to scroll position. Each word fades from 0.18 → 1 as
// the user reads down the section.
const SEGMENTS: { text: string; italic?: boolean; muted?: boolean }[] = [
  { text: "Cada proyecto comienza con una pregunta. " },
  { text: "¿Cómo debería sentirse este lugar?", italic: true, muted: true },
  {
    text:
      " La respuesta define cada decisión que sigue: la luz, los materiales, la proporción.",
  },
];

export function Filosofia() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = pRef.current;
      if (!root) return;

      const words = root.querySelectorAll<HTMLSpanElement>("[data-word]");
      if (!words.length) return;

      // Words start as faint ghosts and resolve to full color as the
      // section scrolls through the viewport. Linear ease, scrub:true
      // → tied 1:1 to scroll position. Feels like the user is reading
      // the manifesto into existence.
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="filosofia" ref={sectionRef} className="section-pad relative bg-ink">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-y-14 px-5 sm:px-6 md:gap-y-20 md:px-10">
        <Reveal as="div" className="col-span-12 md:col-span-3">
          <span className="label-eyebrow">— 01 / Filosofía</span>
        </Reveal>

        <div className="col-span-12 md:col-span-9">
          <p
            ref={pRef}
            className="font-display font-light text-fg"
            style={{
              fontSize: "clamp(1.85rem, 4.2vw, 3.75rem)",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
            }}
          >
            {SEGMENTS.map((seg, segIdx) => {
              const cls = [
                seg.italic ? "italic" : "",
                seg.muted ? "text-fg-muted" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const tokens = seg.text.split(/(\s+)/); // keep whitespace tokens
              return (
                <Fragment key={segIdx}>
                  {tokens.map((tok, i) => {
                    if (/^\s+$/.test(tok))
                      return <Fragment key={i}>{tok}</Fragment>;
                    if (tok === "") return null;
                    return (
                      <span key={i} data-word className={cls}>
                        {tok}
                      </span>
                    );
                  })}
                </Fragment>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
