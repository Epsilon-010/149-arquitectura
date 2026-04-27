const INSTAGRAM_URL =
  "https://instagram.com/149arquitectura?igshid=NTc4MTIwNjQ2YQ==";

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
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline label-eyebrow mt-8 inline-block text-fg-muted hover:text-accent"
          >
            Instagram · @149arquitectura
          </a>
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
                href="mailto:estudio@149arquitectura.mx"
                className="link-underline hover:text-accent"
              >
                estudio@149arquitectura.mx
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
