import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/motion";
import {
  AnimatedTestimonials,
  type ProjectSlide,
} from "../ui/animated-testimonials";

// Placeholder slides — Unsplash. Cuando tengas los renders del estudio
// reemplaza `src` por `/proyectos/<slug>.webp`.
const HERO_SLIDES: ProjectSlide[] = [
  {
    numero: "149.024",
    titulo: "Casa Pedregal",
    meta: "Residencial · Oaxaca · 2024",
    descripcion:
      "Una vivienda contemporánea que dialoga con el contexto. Luz, materia y proporción en equilibrio.",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.022",
    titulo: "Atelier Centro",
    meta: "Interiorismo · Oaxaca · 2023",
    descripcion:
      "Intervención de un espacio histórico. Mobiliario a medida y carpintería local diseñados para el lugar.",
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.019",
    titulo: "Pabellón Valle",
    meta: "Residencial · Valle de Bravo · 2022",
    descripcion:
      "Un volumen único que se inserta en el paisaje. Concreto pulido, madera y vidrio del piso al techo.",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.017",
    titulo: "Hotel Costera",
    meta: "Hospitalidad · Tulum · 2022",
    descripcion:
      "Hospitalidad de bajo perfil. Trece llaves discretas integradas en la vegetación del trópico.",
    src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80",
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineOneRef = useRef<HTMLSpanElement | null>(null);
  const lineTwoRef = useRef<HTMLSpanElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const carouselWrapRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useGSAP(
    () => {
      const all = [
        eyebrowRef.current,
        ctaRef.current,
        lineOneRef.current,
        lineTwoRef.current,
        carouselWrapRef.current,
        taglineRef.current,
      ];
      if (reduceMotion) {
        gsap.set(all, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(all, { opacity: 0, y: 32 });
      gsap.set(carouselWrapRef.current, { opacity: 0, y: 80, scale: 1.03 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.05)
        .to(lineOneRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.1)
        .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.25)
        .to(
          carouselWrapRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 1.6 },
          0.4,
        )
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=1.0");
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[35%] z-0 mx-auto h-[60vw] max-h-[700px] w-[70%] bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.06),transparent_65%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-12 px-5 pt-28 pb-16 sm:px-6 sm:gap-14 sm:pt-32 md:gap-16 md:px-10 md:pb-20">
        {/* ===== Top: headline + eyebrow / CTA ===== */}
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-6">
          <h1 className="font-display col-span-12 text-fg lg:col-span-9">
            <span
              ref={lineOneRef}
              className="block leading-[0.86]"
              style={{
                fontSize: "clamp(2.75rem, 9.5vw, 9.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              ARQUITECTURA
            </span>
            <span
              ref={lineTwoRef}
              className="block leading-[0.86] italic text-fg-muted"
              style={{
                fontSize: "clamp(2.75rem, 9.5vw, 9.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              que permanece
            </span>
          </h1>

          <div className="col-span-12 flex flex-col items-start gap-6 lg:col-span-3 lg:items-end">
            <div ref={eyebrowRef} className="max-w-[14ch] lg:text-right">
              <p className="font-mono text-[0.72rem] tracking-widest uppercase leading-relaxed text-fg-muted">
                Estudio · Activo
                <br />
                Oaxaca · 2025
              </p>
            </div>

            <a
              ref={ctaRef}
              href="#contacto"
              className="link-underline label-eyebrow text-fg transition-colors duration-700 hover:text-accent"
            >
              Conversación
            </a>
          </div>
        </div>

        {/* ===== Project carousel — autoplay every 5.5s, pauses on hover ===== */}
        <div ref={carouselWrapRef}>
          <AnimatedTestimonials slides={HERO_SLIDES} autoplay interval={5500} />
        </div>

        {/* ===== Bottom: tagline + portfolio link ===== */}
        <div ref={taglineRef} className="grid grid-cols-12 gap-x-6 gap-y-4">
          <p className="font-display col-span-12 text-xl leading-[1.2] text-fg md:col-span-7 md:text-2xl">
            Estudio de arquitectura contemporánea desde Oaxaca.
            <span className="text-fg-muted"> Un solo estándar — el más alto.</span>
          </p>

          <div className="col-span-12 flex items-end md:col-span-5">
            <a
              href="#proyectos"
              className="link-underline label-eyebrow text-fg-muted hover:text-fg"
            >
              Explorar portafolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
