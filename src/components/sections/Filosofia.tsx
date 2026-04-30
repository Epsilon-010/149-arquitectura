import { Reveal } from "../ui/Reveal";
import { TextGenerateEffect } from "../ui/text-generate-effect";

// Bilingual manifesto — Spanish + English presented as parallel columns.
// Each column animates word-by-word via TextGenerateEffect. The wordmark
// "149ARQUITECTURA" is bolded inline at the start of each side.
const ES_SEGMENTS = [
  { text: "149ARQUITECTURA", bold: true },
  {
    text:
      "es un taller de diseño y construcción con base en la ciudad de Oaxaca, centramos nuestro esfuerzo en concebir la creación del espacio como un escenario para la vida, humanizante y significante, con responsabilidad social, ambiental y cultural, creemos en la arquitectura como un oficio y un trabajo multidisciplinar.",
  },
];

const EN_SEGMENTS = [
  { text: "149ARQUITECTURA", bold: true },
  {
    text:
      "is a design and construction workshop based in Oaxaca city. We focus our effort on conceiving the creation of space as a stage for life, humanizing and meaningful, with social, environmental, and cultural responsibility. We believe in architecture as a craft and a multidisciplinary profession.",
  },
];

export function Filosofia() {
  return (
    <section
      id="filosofia"
      className="section-pad relative overflow-hidden bg-surface"
    >
      {/* Background watermark — giant italic "149" in fg-faint at very
          low opacity, anchored off-canvas to the right. Adds editorial
          depth without competing with the manifesto. Hidden on mobile
          (would crowd the small viewport). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 select-none font-display italic leading-none text-fg-faint opacity-25 md:block"
        style={{
          fontSize: "clamp(20rem, 38vw, 36rem)",
          letterSpacing: "-0.05em",
        }}
      >
        149
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        {/* Eyebrow */}
        <Reveal as="div" className="mb-10 md:mb-14">
          <span className="label-eyebrow">— 01 / Filosofía</span>
        </Reveal>

        {/* Hairline divider above the manifesto — architectural rule
            that frames the bilingual block as a deliberate plane. */}
        <Reveal>
          <div className="mb-12 h-px w-full bg-line md:mb-16" />
        </Reveal>

        {/* Bilingual manifesto — ES left, EN right, side by side on
            EVERY breakpoint (including mobile). Hairline vertical
            divider between the columns reads as a fold or plan line.
            Both columns share the same scroll-proximity trigger so
            they resolve word-by-word in parallel. Type size, gap and
            inner padding all scale down on phones so two columns of
            running prose still fit comfortably in a 320–400 px
            viewport. */}
        <div className="grid grid-cols-2 gap-x-4 md:gap-x-12 lg:gap-x-20">
          <div className="pr-1 md:pr-2">
            <TextGenerateEffect
              segments={ES_SEGMENTS}
              // Faster than the original — there's a lot more copy
              // to resolve, so a meditative pace would feel tedious.
              // 50 ms stagger × ~62 words ≈ 3.1 s total reveal.
              staggerMs={50}
              duration={0.5}
              rootMargin="0px 0px -15% 0px"
              className="font-sans block text-fg text-[clamp(0.78rem,1.9vw,1.35rem)] leading-[1.55] md:leading-[1.65]"
            />
          </div>
          <div className="border-l border-line pl-4 md:pl-12 lg:pl-20">
            <TextGenerateEffect
              segments={EN_SEGMENTS}
              staggerMs={50}
              duration={0.5}
              rootMargin="0px 0px -15% 0px"
              className="font-sans block text-fg text-[clamp(0.78rem,1.9vw,1.35rem)] leading-[1.55] md:leading-[1.65]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
