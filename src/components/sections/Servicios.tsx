import { Reveal } from "../ui/Reveal";
import { RevealText } from "../ui/RevealText";
import { SERVICIOS } from "../../data/servicios";

export function Servicios() {
  return (
    <section
      id="servicios"
      className="section-pad relative border-t border-line-subtle bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="label-eyebrow">— 03 / Servicios</span>
            </Reveal>
            <RevealText
              as="h2"
              className="font-display mt-6 block text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] text-fg"
              staggerMs={70}
              text="Disciplinas"
            />
          </div>

          <ul className="col-span-12 md:col-span-9">
            {SERVICIOS.map((s, i) => (
              <Reveal
                key={s.n}
                as="li"
                delay={(i % 4) as 0 | 1 | 2 | 3}
                className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-t border-line-subtle py-8 last:border-b sm:gap-x-6 md:py-10"
              >
                <span className="font-mono col-span-2 text-xs text-accent sm:text-sm md:col-span-1">
                  {s.n}
                </span>
                <h3 className="font-display col-span-10 text-2xl text-fg sm:text-3xl md:col-span-4 md:text-4xl">
                  {s.titulo}
                </h3>
                <p className="col-span-12 text-sm text-fg-muted transition-colors duration-700 group-hover:text-fg md:col-span-7 md:text-base">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
