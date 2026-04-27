import { useEffect, useState } from "react";

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
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-700 ${
        scrolled
          ? "bg-overlay backdrop-blur-xl border-b border-line-subtle"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-2xl leading-none text-fg sm:text-3xl md:text-4xl"
          aria-label="149 Arquitectura — inicio"
        >
          149
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline label-eyebrow text-fg-muted transition-colors duration-500 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline label-eyebrow hidden text-fg transition-colors duration-500 hover:text-accent md:inline-block"
        >
          Conversación
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-fg transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-fg transition-transform duration-500 ${open ? "translate-y-[-3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 top-[72px] z-40 bg-ink transition-opacity duration-700 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col items-start gap-8 px-8 pt-16" aria-label="Móvil">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-5xl text-fg"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-eyebrow mt-8 border-t border-line-subtle pt-8 text-fg-muted"
          >
            Conversación
          </a>
        </nav>
      </div>
    </header>
  );
}
