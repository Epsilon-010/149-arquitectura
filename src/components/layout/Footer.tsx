const INSTAGRAM_URL =
  "https://instagram.com/149arquitectura?igshid=NTc4MTIwNjQ2YQ==";
const WHATSAPP_URL =
  "https://wa.me/5219513505166?text=Hola%2C%20me%20gustar%C3%ADa%20una%20consulta%20con%20149%20Arquitectura.";
const MAIL = "estudio@149arquitectura.mx";

const SOCIAL = [
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    icon: (
      <svg
        width="16"
        height="16"
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
        width="15"
        height="15"
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
    label: "Correo",
    href: `mailto:${MAIL}`,
    external: false,
    icon: (
      <svg
        width="15"
        height="15"
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
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-8">
        {/* Brand mark */}
        <a
          href="#top"
          className="flex items-baseline gap-3"
          aria-label="149 Arquitectura — volver al inicio"
        >
          <span className="font-display text-3xl text-fg">149</span>
          <span className="label-eyebrow">arquitectura</span>
        </a>

        {/* Compact social row */}
        <ul className="flex items-center gap-2" aria-label="Redes y contacto">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                title={s.label}
                style={{ touchAction: "manipulation" }}
                className="flex h-9 w-9 items-center justify-center border border-line-subtle text-fg-muted transition-colors duration-500 hover:border-accent hover:text-accent active:border-accent active:text-accent active:bg-accent-dim"
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>

        {/* Copyright + legal — single line */}
        <div className="flex flex-col gap-2 font-mono text-[0.68rem] tracking-[0.2em] text-fg-faint sm:flex-row sm:items-center sm:gap-6 md:items-center">
          <span>© {year} · 149 Arquitectura · Oaxaca, MX</span>
          <a href="#" className="link-underline hover:text-fg">
            Aviso de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
