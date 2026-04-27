import { Reveal } from "../ui/Reveal";
import { RevealText } from "../ui/RevealText";

export function Filosofia() {
  return (
    <section id="filosofia" className="section-pad relative bg-ink">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-y-10 px-5 sm:gap-y-12 sm:px-6 md:px-10">
        <Reveal as="div" className="col-span-12 md:col-span-3">
          <span className="label-eyebrow">— 01 / Filosofía</span>
        </Reveal>

        <RevealText
          as="p"
          className="font-display col-span-12 text-[clamp(1.5rem,4.2vw,3.75rem)] leading-[1.15] text-fg md:col-span-9"
          staggerMs={45}
          segments={[
            { text: "Cada proyecto comienza con una pregunta. " },
            {
              text: "¿Cómo debería sentirse este lugar?",
              italic: true,
              muted: true,
            },
            {
              text: " La respuesta define cada decisión que sigue: la luz, los materiales, la proporción.",
            },
          ]}
        />
      </div>
    </section>
  );
}
