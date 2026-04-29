import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { Magnetic } from "../ui/Magnetic";

const WHATSAPP_URL =
  "https://wa.me/5219513505166?text=Hola%2C%20me%20gustar%C3%ADa%20una%20consulta%20con%20149%20Arquitectura.";

const links = [
  { label: "Estudio", href: "#filosofia" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Contacto", href: "#contacto" },
];

// Mobile-menu animation variants. The container orchestrates a stagger
// so the eyebrow, greeting, links, CTA and footer block enter in
// sequence — feels like opening a folio rather than a basic dropdown.
// On close, the order reverses (`staggerDirection: -1`).
const menuContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
  open: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
};
const menuItemVariants: Variants = {
  closed: { opacity: 0, y: 24 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

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
              className="h-12 w-auto sm:h-16 md:h-20"
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
                className="link-underline font-mono text-[0.78rem] font-medium uppercase tracking-[0.26em] text-fg transition-colors duration-500 hover:text-accent"
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
              className={`h-px w-6 bg-fg transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-fg transition-transform duration-500 ${open ? "translate-y-[-3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu — rendered OUTSIDE <header> AND above it (z-60
          vs header z-50) so the menu is always the topmost layer.
          The container orchestrates a stagger so children enter in
          sequence on open and exit in reverse on close. */}
      <motion.div
        className={`fixed inset-0 z-60 bg-ink md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ width: "100vw", height: "100vh" }}
        aria-hidden={!open}
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={menuContainerVariants}
      >
        {/* Background fade — the container itself fades, so the menu
            appears/disappears as a whole curtain. */}
        <motion.div
          className="absolute inset-0 bg-ink"
          variants={{
            closed: { opacity: 0, transition: { duration: 0.4 } },
            open: { opacity: 1, transition: { duration: 0.5 } },
          }}
        />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute right-5 top-4 z-10 flex h-10 w-10 items-center justify-center text-fg sm:right-6 sm:top-5"
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

        <div
          className="relative z-10 flex h-full flex-col px-8 pt-24 pb-10 sm:px-10 sm:pt-28"
        >
          {/* ===== Eyebrow + greeting ===== */}
          <motion.div variants={menuItemVariants}>
            <span className="label-eyebrow">— 149 / Navegación</span>
            <h2
              className="font-display mt-3 italic leading-[0.95] text-fg-muted"
              style={{ fontSize: "clamp(3.5rem, 18vw, 6rem)", letterSpacing: "-0.025em" }}
            >
              Hola.
            </h2>
          </motion.div>

          {/* ===== Numbered links ===== */}
          <nav
            className="mt-10 flex flex-col"
            aria-label="Navegación móvil"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                variants={menuItemVariants}
                className="group grid grid-cols-12 items-baseline gap-x-4 border-t border-line-subtle py-5 last:border-b active:bg-accent-dim"
              >
                <span className="font-mono col-span-2 text-[0.7rem] tracking-[0.28em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display col-span-9 text-4xl leading-[1.05] text-fg group-active:text-accent">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono col-span-1 text-right text-lg text-fg-muted transition-transform duration-300 group-active:translate-x-1 group-active:text-accent"
                >
                  →
                </span>
              </motion.a>
            ))}
          </nav>

          {/* ===== CTA Conversación ===== */}
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            variants={menuItemVariants}
            className="group mt-10 flex items-center justify-between border-t border-line-subtle pt-8 active:text-accent"
          >
            <div>
              <span className="label-eyebrow">— Conversación</span>
              <p className="font-display mt-2 text-2xl text-fg group-active:text-accent">
                Iniciar por WhatsApp
              </p>
            </div>
            <span
              aria-hidden="true"
              className="font-mono text-2xl text-fg transition-transform duration-300 group-active:translate-x-1 group-active:text-accent"
            >
              →
            </span>
          </motion.a>

          {/* ===== Footer info — coordinates, address, studio status ===== */}
          <motion.div
            variants={menuItemVariants}
            className="mt-auto pt-10"
          >
            <div className="flex flex-col gap-1 text-fg-faint">
              <span
                className="font-mono text-[0.62rem] uppercase tracking-[0.28em]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                17.0732° N · 96.7266° W
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em]">
                Niños Héroes 635-B · Oaxaca de Juárez
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em]">
                Estudio · Activo · 2025
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
