const INSTAGRAM_URL =
  "https://instagram.com/149arquitectura?igshid=NTc4MTIwNjQ2YQ==";
const WHATSAPP_URL =
  "https://wa.me/5219513505166?text=Hola%2C%20me%20gustar%C3%ADa%20una%20consulta%20con%20149%20Arquitectura.";
const MAIL = "estudio@149arquitectura.mx";
const PHONE_TEL = "+5219513505166";

const SOCIAL = [
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.6 6.32A7.86 7.86 0 0 0 12.05 4a7.94 7.94 0 0 0-6.78 12.05L4 21l5.04-1.32a7.94 7.94 0 0 0 11-7.34 7.86 7.86 0 0 0-2.44-6.02ZM12.05 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.99.78.8-2.91-.16-.25a6.6 6.6 0 1 1 5.95 3.44Zm3.62-4.94c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.43.05-.2-.1-.85-.31-1.61-1-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.41.1-.1.2-.23.31-.35.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.71.69-.71 1.69 0 1 .73 1.96.83 2.1.1.13 1.43 2.18 3.46 3.06 1.61.7 2.07.65 2.45.62.38-.04 1.18-.48 1.34-.95.17-.47.17-.87.12-.95-.05-.08-.18-.13-.38-.23Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Teléfono",
    href: `tel:${PHONE_TEL}`,
    external: false,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    label: "Correo",
    href: `mailto:${MAIL}`,
    external: false,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" />
        <path d="m3 7 9 7 9-7" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-subtle bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-y-10 px-5 py-16 sm:gap-y-12 sm:px-6 sm:py-20 md:gap-x-6 md:px-10">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl text-fg">149</span>
            <span className="label-eyebrow">arquitectura</span>
          </div>
          <p className="mt-6 max-w-sm text-fg-muted">
            Estudio de arquitectura contemporánea desde Oaxaca. Un solo
            estándar.
          </p>

          {/* Social icon row — responsive friendly, all 44px touch targets */}
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Redes y contacto">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-11 w-11 items-center justify-center border border-line-subtle text-fg-muted transition-colors duration-500 hover:border-accent hover:text-accent"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          className="col-span-6 md:col-span-3 md:col-start-7"
          aria-label="Navegación del pie"
        >
          <div className="label-eyebrow mb-6">Sitio</div>
          <ul className="flex flex-col gap-4">
            {[
              ["Estudio", "#filosofia"],
              ["Proyectos", "#proyectos"],
              ["Servicios", "#servicios"],
              ["Contacto", "#contacto"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="link-underline text-fg hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3">
          <div className="label-eyebrow mb-6">Contacto</div>
          <ul className="flex flex-col gap-4 text-fg">
            <li>
              <a
                href={`mailto:${MAIL}`}
                className="link-underline wrap-break-word hover:text-accent"
              >
                {MAIL}
              </a>
            </li>
            <li className="font-mono text-sm text-fg-muted">+52 951 350 5166</li>
            <li className="text-sm leading-relaxed text-fg-muted">
              Niños Héroes 635-B
              <br />
              Ex-Marquezado, Oaxaca
            </li>
          </ul>
        </div>

        <div className="col-span-12 mt-10 flex flex-col items-start justify-between gap-4 border-t border-line-subtle pt-10 md:flex-row md:items-center">
          <span className="font-mono text-xs text-fg-faint">
            © {year} — 149 Arquitectura · Oaxaca de Juárez, México
          </span>
          <span className="font-mono text-xs text-fg-faint">
            Aviso de privacidad · Términos
          </span>
        </div>
      </div>
    </footer>
  );
}
