import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "../../lib/motion";
import { FlipWords } from "../ui/flip-words";

// Background photographs that crossfade behind the headline. Drop more
// .webp files into /public/imgs/ and add their paths here — the
// component picks them up automatically. The first entry is used for
// the initial paint (eager + high priority).
const HERO_IMAGES = [
  "/imgs/hero.webp",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
];
// ms each photograph stays before the next crossfade starts.
const ROTATE_MS = 6500;
const FALLBACK_IMG = "/imgs/hero.webp";
const EASE_LUXURY: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

// Propuesta 2 — Hero. The architectural photograph rotates through
// HERO_IMAGES on a slow loop; the headline (in the bottom-left
// rectangular cutout) and the floating description card stay still.
// Inspired by the Craftopic / archive-monograph layout — the photo is
// the subject, the typography is the caption.
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const lineOneRef = useRef<HTMLSpanElement | null>(null);
  const lineTwoRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const coordsRef = useRef<HTMLDivElement | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setReduceMotion(
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Auto-rotate the background photograph. Crossfade timing lives in
  // motion/react below — this just drives which slide is active.
  useEffect(() => {
    if (reduceMotion || HERO_IMAGES.length <= 1) return;
    const id = window.setInterval(() => {
      setImageIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  // Preload the rest of the slideshow in idle time so each crossfade
  // is instant — no flash of empty / loading state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
        .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    idle(() => {
      HERO_IMAGES.forEach((src, i) => {
        if (i === 0) return;
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      });
    });
  }, []);

  useGSAP(
    () => {
      const overlays = [
        metaRef.current,
        coordsRef.current,
        lineOneRef.current,
        lineTwoRef.current,
        cardRef.current,
      ];

      if (reduceMotion) {
        gsap.set(overlays, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(overlays, { opacity: 0, y: 28 });

      // Image fade-in is handled by motion/react below, so the GSAP
      // timeline only choreographs the overlay copy.
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.25)
        .to(coordsRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.3)
        .to(lineOneRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.4)
        .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.55)
        .to(cardRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.75);

      // Layered scroll parallax — image lags slightly, headline
      // escapes upward, card drifts in between. Linear ease + scrub
      // for buttery 1:1 mapping with scroll position.
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
      parallax(imageWrapRef.current, -8);
      parallax(lineOneRef.current, -22);
      parallax(lineTwoRef.current, -16);
      parallax(cardRef.current, -4);
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative bg-ink"
    >
      {/* Full-bleed hero stage — no outer padding, no frame border.
          The photograph reaches the viewport edges on every side. */}
      <div className="relative isolate overflow-hidden min-h-dvh">

        {/* ===== The photograph =====
            Rotates through HERO_IMAGES via AnimatePresence — old slide
            fades out as new slide fades in (1.6s crossfade with a
            subtle scale cue so it feels alive, not just blink). The
            wrapper holds the parallax target so the GSAP scrub keeps
            working across slide swaps; the clipPath bite and filter
            are reapplied to every motion.img.
            clip-path: url(#hero-bite) carves the rectangular cutout
            in the bottom-left where the headline lives on paper. */}
        <div ref={imageWrapRef} className="absolute inset-0">
          <AnimatePresence>
            <motion.img
              key={HERO_IMAGES[imageIndex]}
              src={HERO_IMAGES[imageIndex]}
              alt="Casa contemporánea — Estudio 149"
              width={1600}
              height={1100}
              loading={imageIndex === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={imageIndex === 0 ? "high" : "auto"}
              draggable={false}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{
                duration: reduceMotion ? 0 : 1.6,
                ease: EASE_LUXURY,
              }}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fellback) {
                  t.dataset.fellback = "1";
                  t.src = FALLBACK_IMG;
                }
              }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: "saturate(0.7) contrast(1.05) brightness(0.96)",
                clipPath: "url(#hero-bite)",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Sand tonal overlay — same bite, so it doesn't bleed into
            the paper area. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background: "rgba(190, 170, 142, 0.16)",
            clipPath: "url(#hero-bite)",
          }}
        />

        {/* ===== Top-right: studio meta ===== */}
        <div
          ref={metaRef}
          className="absolute right-5 top-6 z-10 sm:right-6 md:right-10 md:top-10"
          style={{ color: "#F8F7F2" }}
        >
          <p className="font-mono text-right text-[0.7rem] uppercase tracking-[0.28em] opacity-85">
            Estudio · Activo
            <br />
            Oaxaca · 2025
          </p>
        </div>

        {/* ===== Bottom-left: coordinates — now sits on paper, tone
            it down to fg-faint so it reads as discrete metadata. */}
        <div
          ref={coordsRef}
          aria-hidden="true"
          className="absolute bottom-4 left-5 z-10 hidden sm:left-6 md:bottom-6 md:left-10 md:block"
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-fg-faint"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            17.0732° N · 96.7266° W
          </p>
        </div>

        {/* ===== Headline — bottom-left, on the paper bite area, dark
            type. The headline IS what the bite was carved for. ===== */}
        <h1
          className="absolute bottom-12 left-5 right-5 z-10 text-fg sm:bottom-16 sm:left-6 md:bottom-20 md:left-10 md:right-auto"
        >
          <span
            ref={lineOneRef}
            className="font-display block leading-[0.88]"
            style={{
              fontSize: "clamp(2rem, 8vw, 8rem)",
              letterSpacing: "-0.025em",
            }}
          >
            ARQUITECTURA
          </span>
          <span
            ref={lineTwoRef}
            className="font-display block italic leading-[0.88]"
            style={{
              fontSize: "clamp(2rem, 8vw, 8rem)",
              letterSpacing: "-0.025em",
              opacity: 0.72,
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

        {/* ===== Description card — bottom-right, frosted ===== */}
        <div
          ref={cardRef}
          className="absolute bottom-6 right-5 z-10 hidden max-w-sm sm:right-6 md:bottom-10 md:right-10 lg:block"
        >
          <div
            className="border p-7 backdrop-blur-md md:p-8"
            style={{
              borderColor: "rgba(248, 247, 242, 0.45)",
              background: "rgba(248, 247, 242, 0.85)",
            }}
          >
            <span className="label-eyebrow">— 149 / Estudio</span>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "var(--color-fg)" }}
            >
              Estudio de arquitectura contemporánea desde Oaxaca. Cada
              proyecto comienza con la pregunta de cómo debe sentirse el
              lugar.
            </p>
            <a
              href="#proyectos"
              className="link-underline label-eyebrow mt-6 inline-block hover:text-accent"
            >
              Ver portafolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
