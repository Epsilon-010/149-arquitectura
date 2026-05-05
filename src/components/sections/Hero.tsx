import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "../../lib/motion";
import { FlipWords } from "../ui/flip-words";

// Background photographs served from Cloudinary. The `cl()` helper
// injects the transformation chain `f_auto,q_auto,w_1920,c_limit` so:
//   · f_auto → Cloudinary picks the best format per browser (AVIF
//     where supported, WebP otherwise, JPG/PNG as last resort).
//   · q_auto → automatic perceptual-quality compression — typical
//     savings of 60–85% vs the original PNG with no visible loss.
//   · w_1920,c_limit → caps width at 1920 px (enough for any
//     viewport up to ~3K with the object-cover crop) and only
//     ever downscales, never upscales.
// To swap an image, replace the public ID at the end of the string.
// The first entry is used for the initial paint (eager + high
// priority) so put the most representative photograph there.
const CL_BASE = "https://res.cloudinary.com/dsiuwnc0c/image/upload";
const CL_TX = "f_auto,q_auto,w_1920,c_limit";
const cl = (publicId: string) => `${CL_BASE}/${CL_TX}/${publicId}`;

const HERO_IMAGES = [
  cl("v1777585820/9_bqiurv.png"),
  cl("v1777585820/6_nkmbnu.png"),
  cl("v1777585820/8_hycugz.png"),
  cl("v1777585819/5_khfglm.png"),
  cl("v1777585818/4_dz46eh.png"),
  cl("v1777585818/1_djso8g.png"),
  cl("v1777585818/2_iv56nt.png"),
];
// Verbs that cycle in the headline ("ARQUITECTURA / que [verb]"). Rotates
// in lockstep with the image — both indices increment on the same tick.
const VERBS = ["permanece", "respira", "trasciende", "dialoga", "perdura"];
// ms between each tick. Drives BOTH the image swap and the verb swap.
// LCM(7, 5) = 35 (gcd 1) — every (image, verb) pairing surfaces once
// across 35 ticks before the cycle repeats.
const TICK_MS = 5000;
// Fallback points back to the first Cloudinary image (same CDN /
// transformation chain) so we degrade gracefully if any single
// public ID 404s — staying consistent with the rest of the slideshow.
const FALLBACK_IMG = HERO_IMAGES[0];
const EASE_LUXURY: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
// Static colour grade applied to every hero photograph so they read as
// a coherent series. Lives in motion-controlled props (not the inline
// `style` filter) because we animate `blur(...)` alongside it during
// the slide transition — and motion would override `style.filter`.
const BASE_FILTER = "saturate(0.7) contrast(1.05) brightness(0.96)";

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
  // Single master tick. Both the image carousel and the FlipWords in
  // the headline derive their active index from this counter, so
  // every photo swap happens in lockstep with a verb swap.
  const [tick, setTick] = useState(0);
  const imageIndex = tick % HERO_IMAGES.length;
  const wordIndex = tick % VERBS.length;

  useEffect(() => {
    setReduceMotion(
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (HERO_IMAGES.length <= 1 && VERBS.length <= 1) return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, TICK_MS);
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
            Rotates through HERO_IMAGES via AnimatePresence. New slide
            enters from the right with a slight x-offset and a soft
            blur, sharpening as it lands; old slide drifts to the left
            and re-blurs out. Reads as turning a page in an editorial
            monograph rather than a generic crossfade.

            `hero-clip` (the SVG bite shape carving out the bottom-left
            paper area for the headline) lives on the WRAPPER, not on
            each <img>. If it lived on the img, the cutout would
            translate with the slide animation — the headline area
            would briefly drift across the screen. With the clip on
            the wrapper the cutout stays fixed; only the photograph
            inside it moves. */}
        <div ref={imageWrapRef} className="hero-clip absolute inset-0">
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
              initial={{
                opacity: 0,
                x: "5%",
                filter: `${BASE_FILTER} blur(12px)`,
              }}
              animate={{
                opacity: 1,
                x: "0%",
                filter: `${BASE_FILTER} blur(0px)`,
              }}
              exit={{
                opacity: 0,
                x: "-3%",
                filter: `${BASE_FILTER} blur(12px)`,
              }}
              transition={{
                duration: reduceMotion ? 0 : 1.5,
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
            />
          </AnimatePresence>
        </div>

        {/* Sand tonal overlay — clipped only at md+ so mobile gets
            full coverage. */}
        <div
          aria-hidden="true"
          className="hero-clip pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ background: "rgba(190, 170, 142, 0.16)" }}
        />

        {/* ===== Top-right: studio meta — only visible at lg+
            (≥1024 px), where the desktop nav also kicks in.
            Below 1024 px the hamburger button lives in the same
            top-right corner — having both on top of each other
            would clobber the layout (and on iPad portrait was
            literally crashing into the nav links).
            Fluid right offset matches the headline's left offset
            so both edges stay symmetric across breakpoints. ===== */}
        <div
          ref={metaRef}
          className="absolute right-[clamp(1.25rem,3vw,2.5rem)] top-[clamp(1.5rem,3vh,2.5rem)] z-10 hidden lg:block"
          style={{ color: "#F8F7F2" }}
        >
          <p className="font-mono text-right text-[0.7rem] uppercase tracking-[0.28em] opacity-85">
            Estudio · Activo
            <br />
            Oaxaca · 2025
          </p>
        </div>

        {/* ===== Bottom-left: coordinates — now sits on paper, tone
            it down to fg-faint so it reads as discrete metadata.
            Fluid offsets match the headline + meta block. */}
        <div
          ref={coordsRef}
          aria-hidden="true"
          className="absolute bottom-[clamp(1rem,2vh,1.5rem)] left-[clamp(1.25rem,3vw,2.5rem)] z-10 hidden md:block"
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-fg-faint"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            17.0732° N · 96.7266° W
          </p>
        </div>

        {/* ===== Headline block — bottom-left, on the paper bite
            area. Wraps the H1 plus a small cycle marker above so
            both stay anchored inside the cutout and move together
            on parallax. The marker tracks the FlipWords / image
            rotation in lockstep, reading as a plan-style
            annotation rather than a UI control.

            Bottom + left use `clamp()` of vh/vw rather than fixed
            sm/md/lg jumps — keeps the headline anchored to the
            same proportional spot on every viewport (320 px phone,
            1280 px laptop, 1920 px desktop) without snap-changes
            at the breakpoints. ===== */}
        <div className="absolute bottom-[clamp(2.5rem,7vh,5rem)] left-[clamp(1.25rem,3vw,2.5rem)] right-[clamp(1.25rem,3vw,2.5rem)] z-10 md:right-auto">
          {/* Cycle marker — mono index + 5 tick marks. Active tick
              widens and shifts to accent color in sync with the
              verb / image tick. Tabular-nums on the index keeps
              the digits aligned as the counter ticks up. */}
          <div
            aria-hidden="true"
            className="mb-3 flex items-center gap-3 md:mb-5"
          >
            <span
              className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-fg-muted sm:text-[0.62rem]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              — {String(wordIndex + 1).padStart(2, "0")} · {String(VERBS.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-[5px]">
              {VERBS.map((_, i) => (
                <span
                  key={i}
                  className={`h-px transition-all duration-700 ${i === wordIndex
                    ? "w-7 bg-accent"
                    : "w-3 bg-fg-faint/60"
                    }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)" }}
                />
              ))}
            </div>
          </div>
          <h1 className="text-fg">
            {/* Width AND height-aware clamp:
                `clamp(1.75rem, min(5.5vw, calc(22vh - 40px)), 8rem)`

                The hero cutout is 53 % wide × 38 % tall (see
                `hero-bite` in ClipDefs). The cutout grows
                proportionally with the viewport — so the headline
                must too, otherwise it shrinks visually relative to
                an ever-bigger empty paper area on wide screens.

                Earlier versions capped at 5rem (80 px), which felt
                cramped on Mac/FHD because the cutout kept growing
                while the text didn't. The 8rem (128 px) cap only
                binds at ≥2330 px viewports — every common laptop /
                desktop size falls back on the linear `5.5vw` rule,
                so text-size and cutout-size scale together.

                Width fit (worst case "que trasciende",
                ~9 char-units wide italic with -0.025em tracking):
                  · 1024 × 768:  56 px × 9 ≈ 506 px in  543 px →  37 px margin
                  · 1280 × 800:  70 px × 9 ≈ 634 px in  678 px →  44 px
                  · 1440 × 900:  79 px × 9 ≈ 713 px in  763 px →  50 px
                  · 1920 × 1080:106 px × 9 ≈ 950 px in 1018 px →  68 px
                  · 2560 × 1440:128 px × 9 ≈1152 px in 1357 px → 205 px (cap)
                  · 3440 × 1440:128 px × 9 ≈1152 px in 1823 px → 671 px (cap)

                Vertical fit budget (2 lines + marker + bottom
                padding must clear cutout's 38 vh height):
                  block_height = 0.88 × font × 2 (lines) + 22 px
                                  (marker) + 40 px (bottom offset)
                              = 1.76 × font + 62
                  block_height ≤ 0.38 × vh
                  font ≤ (0.38vh − 62) / 1.76 ≈ 21.6vh − 35
                  → `22vh − 40px` is a safe round figure.

                `min()` picks whichever constraint is tighter for
                the current viewport; clamp's outer bounds keep the
                font legible on tiny phones (28 px floor) and from
                blowing up on 4K+ monitors (128 px cap). */}
            <span
              ref={lineOneRef}
              className="font-display block leading-[0.88] text-[clamp(1.75rem,min(5.5vw,calc(22vh_-_40px)),8rem)]"
              style={{
                letterSpacing: "-0.025em",
              }}
            >
              ARQUITECTURA
            </span>
            <span
              ref={lineTwoRef}
              className="font-display block italic leading-[0.88] text-[clamp(1.75rem,min(5.5vw,calc(22vh_-_40px)),8rem)]"
              style={{
                letterSpacing: "-0.025em",
                opacity: 0.72,
              }}
            >
              que{" "}
              <FlipWords words={VERBS} index={wordIndex} />
            </span>
          </h1>
        </div>

        {/* ===== Description card — bottom-right, frosted. Only
            visible on lg+ — on phones/tablets the hero stays
            uncluttered with just headline + cycle marker. Fluid
            offset + clamp on max-width so the card scales with
            viewport width instead of jumping at sm/md. ===== */}
        <div
          ref={cardRef}
          className="absolute bottom-[clamp(2rem,4.5vh,3.5rem)] right-[clamp(1.5rem,3.5vw,2.75rem)] z-10 hidden max-w-[clamp(20rem,28vw,24rem)] lg:block"
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
