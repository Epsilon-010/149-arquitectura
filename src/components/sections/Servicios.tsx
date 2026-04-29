import { Reveal } from "../ui/Reveal";
import { RevealText } from "../ui/RevealText";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import { SERVICIOS } from "../../data/servicios";

export function Servicios() {
  return (
    <section
      id="servicios"
      className="section-pad relative border-t border-line-subtle bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        {/* Section header — eyebrow + title sit above the sticky-scroll
            block. The block itself takes over the scroll for 4× viewports
            on lg+. */}
        <div className="mb-16 grid grid-cols-12 gap-y-6 md:mb-24">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="label-eyebrow">— 03 / Servicios</span>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-9">
            <RevealText
              as="h2"
              className="font-display block text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] text-fg"
              staggerMs={70}
              text="Disciplinas"
              scrub
            />
          </div>
        </div>

        <StickyScroll items={SERVICIOS} paneEyebrow="Servicio · 2025" />
      </div>
    </section>
  );
}
