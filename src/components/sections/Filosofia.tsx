import { Reveal } from "../ui/Reveal";

export function Filosofia() {
  return (
    <section
      id="filosofia"
      className="section-pad relative bg-ink"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-y-14 px-5 sm:px-6 md:gap-y-20 md:px-10">
        <Reveal as="div" className="col-span-12 md:col-span-3">
          <span className="label-eyebrow">— 01 / Filosofía</span>
        </Reveal>

        <Reveal as="div" delay={1} className="col-span-12 md:col-span-9">
          <p
            className="font-display font-light text-fg"
            style={{
              fontSize: "clamp(1.85rem, 4.2vw, 3.75rem)",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
            }}
          >
            Cada proyecto comienza con una pregunta.{" "}
            <span className="italic text-fg-muted">
              ¿Cómo debería sentirse este lugar?
            </span>{" "}
            La respuesta define cada decisión que sigue: la luz, los materiales,
            la proporción.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
