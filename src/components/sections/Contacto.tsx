import { Reveal } from "../ui/Reveal";
import { RevealText } from "../ui/RevealText";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Magnetic } from "../ui/Magnetic";

const PHONE_TEL = "+5219513505166";
const PHONE_DISPLAY = "+52 951 350 5166";
const INSTAGRAM_URL =
  "https://instagram.com/149arquitectura?igshid=NTc4MTIwNjQ2YQ==";
const INSTAGRAM_HANDLE = "@149arquitectura";
const ADDRESS_LINE_1 = "Niños Héroes 635-B";
const ADDRESS_LINE_2 = "Ex-Marquezado, 68034";
const ADDRESS_LINE_3 = "Oaxaca de Juárez, Oax.";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Ni%C3%B1os%20H%C3%A9roes%20635%20Ex-Marquezado%20Oaxaca";
const WHATSAPP_URL =
  "https://wa.me/5219513505166?text=Hola%2C%20me%20gustar%C3%ADa%20una%20consulta%20con%20149%20Arquitectura.";

// Compact monochrome icons — no emoji (UX rule §4 `no-emoji-icons`).
function WhatsAppIcon(props: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.6 6.32A7.86 7.86 0 0 0 12.05 4a7.94 7.94 0 0 0-6.78 12.05L4 21l5.04-1.32a7.94 7.94 0 0 0 11-7.34 7.86 7.86 0 0 0-2.44-6.02ZM12.05 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.99.78.8-2.91-.16-.25a6.6 6.6 0 1 1 5.95 3.44Zm3.62-4.94c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.43.05-.2-.1-.85-.31-1.61-1-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.41.1-.1.2-.23.31-.35.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.71.69-.71 1.69 0 1 .73 1.96.83 2.1.1.13 1.43 2.18 3.46 3.06 1.61.7 2.07.65 2.45.62.38-.04 1.18-.48 1.34-.95.17-.47.17-.87.12-.95-.05-.08-.18-.13-.38-.23Z" />
    </svg>
  );
}

function InstagramIcon(props: { className?: string }) {
  return (
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
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MapPinIcon(props: { className?: string }) {
  return (
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
      {...props}
    >
      <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function ClockIcon(props: { className?: string }) {
  return (
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
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PhoneIcon(props: { className?: string }) {
  return (
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
      {...props}
    >
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function Contacto() {
  return (
    <section
      id="contacto"
      className="section-pad relative border-t border-line-subtle bg-ink"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        {/* ===== Headline ===== */}
        <div className="grid grid-cols-12 gap-y-10 md:gap-x-6">
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <span className="label-eyebrow">— 06 / Conversación</span>
            </Reveal>
            <RevealText
              as="h2"
              className="font-display mt-6 block text-[clamp(2.25rem,7.5vw,6.5rem)] leading-[1.05] text-fg sm:mt-8"
              staggerMs={70}
              segments={[
                { text: "¿Empezamos " },
                { text: "tu proyecto?", italic: true },
              ]}
              scrub
            />
            <Reveal delay={2}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-fg-muted">
                Una conversación de treinta minutos suele ser suficiente para
                definir si el estudio es el indicado para tu proyecto.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <Magnetic strength={0.18} className="block">
                <HoverBorderGradient
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  duration={1.6}
                  containerClassName="mt-10 sm:mt-12 max-w-full"
                  className="px-5 py-4 sm:px-8 sm:py-5"
                >
                  <span className="flex items-center gap-3 sm:gap-5">
                    <WhatsAppIcon className="shrink-0 text-accent" />
                    <span className="font-display text-xl normal-case tracking-normal text-fg sm:text-2xl md:text-3xl">
                      Escribir por WhatsApp
                    </span>
                  </span>
                </HoverBorderGradient>
              </Magnetic>
            </Reveal>
          </div>

          {/* ===== Contact details — grouped by intent ===== */}
          <Reveal
            as="div"
            delay={2}
            className="col-span-12 md:col-span-5 md:col-start-8"
          >
            <div className="grid gap-10 border-t border-line-subtle pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              {/* Visit */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ touchAction: "manipulation" }}
                className="group flex items-start gap-4 transition-colors duration-700 hover:text-accent active:text-accent"
              >
                <MapPinIcon className="mt-1 shrink-0 text-fg-muted transition-colors duration-700 group-hover:text-accent" />
                <div>
                  <div className="label-eyebrow group-hover:text-accent">
                    Visitar el estudio
                  </div>
                  <p className="mt-3 text-fg leading-relaxed">
                    {ADDRESS_LINE_1}
                    <br />
                    {ADDRESS_LINE_2}
                    <br />
                    {ADDRESS_LINE_3}
                  </p>
                  <span className="link-underline mt-3 inline-block label-eyebrow text-fg-muted group-hover:text-accent">
                    Ver en Google Maps
                  </span>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <ClockIcon className="mt-1 shrink-0 text-fg-muted" />
                <div>
                  <div className="label-eyebrow">Horario</div>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-fg">
                    Lun – Vie · 10:00 – 17:00
                  </p>
                  <p className="font-mono text-xs text-fg-muted">
                    Sáb · Dom — cerrado
                  </p>
                </div>
              </div>

              {/* Direct lines */}
              <div className="grid gap-5 border-t border-line-subtle pt-8">
                <a
                  href={`tel:${PHONE_TEL}`}
                  style={{ touchAction: "manipulation" }}
                className="group flex items-center gap-4 transition-colors duration-700 hover:text-accent active:text-accent"
                >
                  <PhoneIcon className="shrink-0 text-fg-muted transition-colors duration-700 group-hover:text-accent" />
                  <span className="link-underline font-mono text-sm text-fg group-hover:text-accent">
                    {PHONE_DISPLAY}
                  </span>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ touchAction: "manipulation" }}
                className="group flex items-center gap-4 transition-colors duration-700 hover:text-accent active:text-accent"
                >
                  <InstagramIcon className="shrink-0 text-fg-muted transition-colors duration-700 group-hover:text-accent" />
                  <span className="link-underline text-fg group-hover:text-accent">
                    {INSTAGRAM_HANDLE}
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
