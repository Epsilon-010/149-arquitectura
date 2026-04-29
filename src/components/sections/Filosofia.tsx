import { Reveal } from "../ui/Reveal";
import { TextGenerateEffect } from "../ui/text-generate-effect";

// Manifesto split into segments — each segment carries its own emphasis
// (italic / muted). TextGenerateEffect flattens them into per-word
// spans and runs a blur+fade reveal once on scroll proximity.
const SEGMENTS = [
  { text: "Cada proyecto comienza con una pregunta." },
  { text: "¿Cómo debería sentirse este lugar?", italic: true, muted: true },
  {
    text:
      "La respuesta define cada decisión que sigue: la luz, los materiales, la proporción.",
  },
];

export function Filosofia() {
  return (
    <section id="filosofia" className="section-pad relative bg-surface">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-y-14 px-5 sm:px-6 md:gap-y-20 md:px-10">
        <Reveal as="div" className="col-span-12 md:col-span-3">
          <span className="label-eyebrow">— 01 / Filosofía</span>
        </Reveal>

        <div className="col-span-12 md:col-span-9">
          <TextGenerateEffect
            segments={SEGMENTS}
            // Slower stagger + per-word duration so the manifesto
            // reads as deliberate, meditative — each word resolves
            // before the next starts to clear up.
            staggerMs={140}
            duration={1.1}
            // Fires when the paragraph's bottom is ~20% above the
            // bottom of the viewport — so the user sees the reveal
            // start as they approach, not after they're already past.
            rootMargin="0px 0px -20% 0px"
            className="font-display text-fg text-[clamp(1.85rem,4.2vw,3.75rem)] leading-[1.4] tracking-[-0.01em]"
          />
        </div>
      </div>
    </section>
  );
}
