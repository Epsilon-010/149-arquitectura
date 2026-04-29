import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/motion";
import {
  ProjectCarousel,
  type CarouselSlide,
} from "../ui/ProjectCarousel";
import { FlipWords } from "../ui/flip-words";

const HERO_SLIDES: CarouselSlide[] = [
  {
    numero: "149.024",
    titulo: "Casa Pedregal",
    categoria: "Residencial",
    ciudad: "Oaxaca",
    ano: 2024,
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.022",
    titulo: "Atelier Centro",
    categoria: "Interiorismo",
    ciudad: "Oaxaca",
    ano: 2023,
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.019",
    titulo: "Pabellón Valle",
    categoria: "Residencial",
    ciudad: "Valle de Bravo",
    ano: 2022,
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    numero: "149.017",
    titulo: "Hotel Costera",
    categoria: "Hospitalidad",
    ciudad: "Tulum",
    ano: 2022,
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
  const ghostRef = useRef<HTMLDivElement | null>(null);

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
      gsap.set(carouselWrapRef.current, { opacity: 0, y: 64, scale: 1.02 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.05)
        .to(lineOneRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.1)
        .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.25)
        .to(
          carouselWrapRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 1.5 },
          0.4,
        )
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=1.0");

      // ===== Scroll-driven parallax — layered depth as the user scrolls
      // past the hero. Each element drifts up at a different rate, so the
      // headline escapes fast and the carousel/tagline lag behind, giving
      // the page a sense of weight and depth. Linear easing is required
      // for scrub — anything else feels jittery.
      const parallax = (target: Element | null, yPercent: number) => {
        if (!target) return;
        gsap.to(target, {
          yPercent,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      };
      parallax(lineOneRef.current, -22);
      parallax(lineTwoRef.current, -16);
      parallax(carouselWrapRef.current, -8);
      parallax(taglineRef.current, -4);
      // The ghost "149" sits deeper in space — it drifts harder than
      // the headline so the user feels the parallax depth directly.
      parallax(ghostRef.current, -38);
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-ink"
    >
      {/* Subtle gold halo behind the carousel — barely there */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[40%] z-0 mx-auto h-[55vw] max-h-[600px] w-[70%] bg-[radial-gradient(ellipse_at_center,rgba(142,106,54,0.07),transparent_65%)]"
      />

      {/* Ghost "149" — outline-only numeral acting as an architectural
          watermark. Sits at the bottom edge, partially clipped by the
          section overflow, drifts harder than the headline on scroll
          so it reads as living deeper in space. -webkit-text-stroke
          keeps it as pure trace, no fill. */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-6vw] right-[-2vw] z-0 hidden select-none md:block"
      >
        <span
          className="font-display block leading-[0.78]"
          style={{
            fontSize: "clamp(18rem, 32vw, 38rem)",
            letterSpacing: "-0.05em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(142, 106, 54, 0.18)",
          }}
        >
          149
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-16 px-5 pt-28 pb-14 sm:px-6 sm:gap-20 sm:pt-32 md:gap-28 md:px-10 md:pb-20">
        {/* ===== Top: headline + eyebrow / CTA ===== */}
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-6">
          <h1 className="font-display col-span-12 text-fg lg:col-span-9">
            <span
              ref={lineOneRef}
              className="block wrap-break-word leading-[0.88]"
              style={{
                fontSize: "clamp(1.85rem, 9vw, 8.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              ARQUITECTURA
            </span>
            <span
              ref={lineTwoRef}
              className="block wrap-break-word italic leading-[0.88] text-fg-muted"
              style={{
                fontSize: "clamp(1.85rem, 9vw, 8.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              que{" "}
              <FlipWords
                words={[
                  "permanece",
                  "respira",
                  "trasciende",
                  "dialoga",
                  "perdura",
                ]}
                intervalMs={3000}
              />
            </span>
          </h1>

          <div className="col-span-12 flex flex-col items-start gap-5 lg:col-span-3 lg:items-end">
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

        {/* ===== Project carousel — autoplay loop, smaller footprint ===== */}
        <div
          ref={carouselWrapRef}
          className="mx-auto w-full max-w-[1340px]"
        >
          <ProjectCarousel slides={HERO_SLIDES} interval={3500} />
        </div>

        {/* ===== Bottom: tagline + portfolio link ===== */}
        <div ref={taglineRef} className="grid grid-cols-12 gap-x-6 gap-y-3">
          <p className="font-display col-span-12 text-xl leading-[1.2] text-fg sm:text-2xl md:col-span-7">
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

        {/* Scroll cue — vertical animated tick at the foot of the hero,
            anchored to the section padding rhythm. Hidden on smaller
            screens where the carousel already sits at the fold edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto hidden md:block"
        >
          <div className="scroll-line mx-auto" />
        </div>
      </div>

      {/* Geographic coordinates of Oaxaca de Juárez — pinned to the
          bottom-left of the hero. Architectural-precision detail that
          rewards the reader who looks closely. Tabular nums + tiny
          mono caps so it reads as instrument data, not decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-5 z-10 hidden md:block sm:left-6 md:left-10"
      >
        <p
          className="font-mono text-[0.62rem] leading-normal uppercase tracking-[0.28em] text-fg-faint"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          17.0732° N
          <br />
          96.7266° W
        </p>
      </div>
    </section>
  );
}
