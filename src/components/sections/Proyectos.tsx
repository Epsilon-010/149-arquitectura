import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Reveal } from "../ui/Reveal";
import { RevealText } from "../ui/RevealText";
import { DirectionAwareHover } from "../ui/direction-aware-hover";
import { gsap, prefersReducedMotion } from "../../lib/motion";
import { PROYECTOS, type Proyecto } from "../../data/proyectos";

function ProjectCard({
  p,
  ratio,
  biteId,
}: {
  p: Proyecto;
  ratio: string;
  /** id of the SVG <clipPath> in ClipDefs that shapes this card.
      Each card gets a different bite so the grid never repeats. */
  biteId: string;
}) {
  return (
    <a
      href="#"
      className="group relative block"
      aria-label={`Proyecto ${p.numero} — ${p.titulo}`}
    >
      {/* Image stage — three nested layers because we have three
          distinct clip operations to compose:
            1. Outer: aspect ratio + scroll parallax target.
            2. Middle (data-image-reveal): the GSAP cortina reveal
               that animates clip-path: inset(...) on scroll-in.
            3. Inner: the SVG bite shape (clip-path: url(#bite-N))
               carving an organic concave silhouette unique to this
               card. Each clip-path lives on its own element so they
               don't fight for the same property. */}
      <div data-parallax className={`relative ${ratio}`}>
        <div data-image-reveal className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ clipPath: `url(#${biteId})` }}
          >
            <DirectionAwareHover
              imageUrl={p.imagen}
              imageAlt={`${p.titulo}, ${p.ciudad}`}
            />
          </div>
        </div>
      </div>

      {/* Always-visible project metadata — clean editorial layout below the image */}
      <div className="mt-6 grid grid-cols-12 items-start gap-x-4 gap-y-3 px-2 sm:mt-7 sm:px-3">
        <div className="font-mono col-span-12 text-[0.7rem] tracking-[0.28em] text-accent">
          {p.numero}
        </div>
        <h3 className="font-display col-span-8 text-2xl font-light leading-[1.05] text-fg sm:col-span-9 sm:text-3xl">
          {p.titulo}
        </h3>
        <div className="col-span-4 text-right sm:col-span-3">
          <div className="label-eyebrow">{p.categoria}</div>
          <div className="font-mono mt-2 text-xs text-fg-muted">{p.ano}</div>
        </div>
        <div className="font-mono col-span-12 text-[0.66rem] tracking-[0.28em] uppercase text-fg-muted">
          {p.ciudad}
        </div>
      </div>
    </a>
  );
}

export function Proyectos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [a, b, c, d, e, f] = PROYECTOS;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = sectionRef.current;
      if (!root) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // Vertical-curtain reveal — fires once when each project image
      // crosses into the viewport. The image starts fully clipped from
      // the bottom (invisible) and "uncovers" downward like a render
      // being unsheathed. Runs on every breakpoint; replaces the
      // generic Reveal fade-in for project images.
      const reveals = gsap.utils.toArray<HTMLElement>(
        "[data-image-reveal]",
        root,
      );
      reveals.forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: {
              trigger: wrap,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Desktop-only scroll parallax stays. Skipped on mobile — feels
      // janky on a one-column layout and fights with normal scroll.
      if (!isDesktop) return;
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-parallax]",
        root,
      );
      cards.forEach((card, i) => {
        const range = i % 2 === 0 ? 5 : 10;
        gsap.fromTo(
          card,
          { yPercent: -range },
          {
            yPercent: range,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="section-pad relative border-t border-line-subtle bg-ink"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <span className="label-eyebrow">— 02 / Proyectos</span>
            </Reveal>
            <RevealText
              as="h2"
              className="font-display mt-6 block text-[clamp(2rem,6vw,5rem)] text-fg"
              staggerMs={70}
              text="Trabajo seleccionado"
              scrub
            />
          </div>
          <Reveal delay={2}>
            <a
              href="#"
              className="link-underline label-eyebrow text-fg-muted hover:text-fg"
            >
              Ver portafolio completo
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-12 gap-x-5 gap-y-16 sm:gap-x-8 sm:gap-y-20 md:gap-x-10 md:gap-y-24">
          <Reveal className="col-span-12 md:col-span-8">
            <ProjectCard p={a} ratio="aspect-[16/10]" biteId="bite-1" />
          </Reveal>
          <Reveal className="col-span-12 md:col-span-4 md:mt-32" delay={1}>
            <ProjectCard p={b} ratio="aspect-[3/4]" biteId="bite-2" />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-5">
            <ProjectCard p={c} ratio="aspect-[4/5]" biteId="bite-3" />
          </Reveal>
          <Reveal className="col-span-12 md:col-span-7 md:mt-24" delay={1}>
            <ProjectCard p={d} ratio="aspect-[16/10]" biteId="bite-4" />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-7">
            <ProjectCard p={e} ratio="aspect-[16/10]" biteId="bite-5" />
          </Reveal>
          <Reveal className="col-span-12 md:col-span-5 md:mt-32" delay={1}>
            <ProjectCard p={f} ratio="aspect-[4/5]" biteId="bite-6" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
