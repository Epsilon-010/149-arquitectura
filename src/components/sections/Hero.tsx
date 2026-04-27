import { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/motion";

const HERO_CASA = "/proyectos/casa-Photoroom.webp";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineOneRef = useRef<HTMLSpanElement | null>(null);
  const lineTwoRef = useRef<HTMLSpanElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
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
        imageWrapRef.current,
        taglineRef.current,
      ];
      if (reduceMotion) {
        gsap.set(all, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(all, { opacity: 0, y: 32 });
      gsap.set(imageWrapRef.current, { opacity: 0, y: 80, scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.05)
        .to(lineOneRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.1)
        .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.25)
        .to(
          imageWrapRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 1.7 },
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
        className="pointer-events-none absolute inset-x-0 top-[42%] mx-auto h-[60vw] max-h-[700px] w-[70%] -z-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.07),transparent_65%)]"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col justify-between gap-10 px-5 pt-24 pb-12 sm:px-6 md:gap-12 md:px-10 md:pt-32 md:pb-20">
        {/* ===== Top: headline + eyebrow / CTA ===== */}
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-6">
          <h1 className="font-display col-span-12 text-fg lg:col-span-9">
            <span
              ref={lineOneRef}
              className="block leading-[0.86]"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 9.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              ARQUITECTURA
            </span>
            <span
              ref={lineTwoRef}
              className="block leading-[0.86] italic text-fg-muted"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 9.5rem)",
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
                MX · 2025
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

        {/* ===== Floating house — transparent PNG, Tilt + glare ===== */}
        <div
          ref={imageWrapRef}
          className="relative mx-auto w-full max-w-[1100px] flex-1 flex items-center"
        >
          <Tilt
            tiltEnable={!reduceMotion}
            tiltMaxAngleX={6}
            tiltMaxAngleY={6}
            perspective={1400}
            transitionSpeed={1800}
            scale={1.015}
            gyroscope={!reduceMotion}
            glareEnable={!reduceMotion}
            glareMaxOpacity={0.22}
            glareColor="#f0ede8"
            glarePosition="all"
            glareBorderRadius="0px"
            className="w-full"
          >
            <img
              src={HERO_CASA}
              alt="Render arquitectónico — proyecto destacado"
              width={1600}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full select-none"
              style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }}
            />
          </Tilt>
        </div>

        {/* ===== Bottom: tagline + scroll cue ===== */}
        <div
          ref={taglineRef}
          className="grid grid-cols-12 gap-x-6 gap-y-4"
        >
          <p className="font-display col-span-12 text-lg leading-tight text-fg sm:text-xl md:col-span-7 md:text-2xl">
            Estudio de arquitectura contemporánea.
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
