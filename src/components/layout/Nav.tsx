import { useEffect, useState } from "react";
import { Magnetic } from "../ui/Magnetic";

const WHATSAPP_URL =
  "https://wa.me/5219513505166?text=Hola%2C%20me%20gustar%C3%ADa%20una%20consulta%20con%20149%20Arquitectura.";

const links = [
  { label: "Estudio", href: "#filosofia" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Contacto", href: "#contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll while the mobile menu is open so the page behind
    // the overlay doesn't sneak past it on scroll/swipe.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-700 ${
          open
            ? "bg-transparent border-b border-transparent"
            : scrolled
              ? "bg-overlay backdrop-blur-xl border-b border-line-subtle"
              : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-10">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="block leading-none"
            aria-label="149 Arquitectura — inicio"
          >
            <img
              src="/logo/149-arquitectura logo.webp"
              alt="149 Arquitectura"
              loading="eager"
              decoding="async"
              // Smooth ramp across breakpoints — phones get a more
              // confident wordmark, tablets/landscape phones the
              // intermediate step, laptops/desktops the largest
              // size. Avoids the previous "tablet = phone-size"
              // jump between sm and md.
              className="h-20 w-auto sm:h-24 md:h-28 lg:h-32"
              // mix-blend-multiply makes the JPEG/WebP white padding
              // blend into the paper page background, so the logo
              // reads as if it had a transparent background.
              style={{ mixBlendMode: "multiply" }}
            />
          </a>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                // Bumped contrast (text-fg!), medium weight (font-mono
                // 500), and a hair more tracking + size than .label-eyebrow.
                // Reads as proper navigation rather than incidental copy.
                className="link-underline font-mono text-[0.85rem] font-medium uppercase tracking-[0.26em] text-black transition-colors duration-500 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Magnetic className="hidden md:inline-block" strength={0.3}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-[0.78rem] font-medium uppercase tracking-[0.26em] text-fg transition-colors duration-500 hover:text-accent"
            >
              Conversación
            </a>
          </Magnetic>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
          >
            <span
              className={`h-px w-6 bg-black transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-black transition-transform duration-500 ${open ? "translate-y-[-3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu — rendered OUTSIDE <header> AND above it (z-60
          vs header z-50) so the menu is always the topmost layer.
          That sidesteps two failure modes: (1) backdrop-filter on the
          scrolled header creating a containing block that would shrink
          a fixed child to the header box, and (2) any unexpected
          stacking context lower in the tree letting a section bleed
          through. The menu carries its own explicit X close button
          (top-right) — universally readable, doesn't depend on
          recognising the rotated hamburger as "close". */}
      <div
        className={`fixed inset-0 z-60 bg-ink transition-opacity duration-700 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ width: "100vw", height: "100vh" }}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center text-fg sm:right-6 sm:top-5"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <nav
          className="flex h-full flex-col px-8 pt-28 pb-12"
          aria-label="Móvil"
        >
          {/* Numbered links — same 4 entries as before, now presented
              as architectural-plan rows: mono numeral · display label ·
              arrow. Hairline dividers between rows give the list the
              feel of a contents page rather than four loose lines. */}
          <div className="flex flex-col">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-6 border-t border-line-subtle py-6 last:border-b transition-colors duration-300 active:bg-accent-dim"
              >
                <span className="font-mono w-8 text-[0.7rem] tracking-[0.28em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display flex-1 text-4xl leading-[1.05] text-fg group-active:text-accent">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-lg text-fg-muted transition-transform duration-300 group-active:translate-x-1 group-active:text-accent"
                >
                  →
                </span>
              </a>
            ))}
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="label-eyebrow mt-auto border-t border-line-subtle pt-8 text-fg-muted"
          >
            Conversación
          </a>
        </nav>
      </div>
    </>
  );
}
