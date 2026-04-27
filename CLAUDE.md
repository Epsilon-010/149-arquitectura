# CLAUDE.md — 149 Arquitectura

> Este archivo es el contexto maestro del proyecto. Léelo completo antes de escribir cualquier línea de código, componente o copy. Define quiénes somos, cómo se ve el sitio, cómo está estructurado y cómo trabajamos.

---

## 1. El Proyecto

**Cliente:** 149 Arquitectura  
**Tipo:** Estudio de arquitectura contemporánea  
**Sede:** Oaxaca de Juárez, México (lada +52 951)  
**Producto:** Sitio web institucional + portafolio de proyectos  
**Objetivo principal:** Transmitir confianza, sofisticación y visión futurista. El sitio debe ser una extensión de la arquitectura misma: preciso, intencional, sin ruido.

**Audiencia objetivo:**
- Desarrolladores inmobiliarios y promotores
- Clientes privados de alto poder adquisitivo
- Corporativos que buscan diseño de oficinas e interiores
- Otros estudios y colaboradores del sector

**Propuesta de valor del estudio:**
El estudio 149 Arquitectura diseña espacios que equilibran función y estética, con un enfoque contemporáneo que anticipa tendencias. No solo construyen — crean entornos que definen identidad.

---

## 2. Identidad Visual

### Filosofía de diseño
Dark, elegante, futurista. El sitio debe sentirse como entrar a un espacio arquitectónico de lujo: penumbra calculada, materialidad visible, proporciones exactas. Nada está de más. Todo comunica.

### Paleta de colores

Los tokens se declaran en `src/index.css` dentro de `@theme`. Tailwind v4 expone cada uno como utility automáticamente (utility entre paréntesis):

```css
@theme {
  /* Backgrounds */
  --color-ink:          #080809;              /* bg-ink — Negro arquitectónico, fondo base */
  --color-surface:      #0f0f12;              /* bg-surface — Superficie elevada */
  --color-elevated:     #16161c;              /* bg-elevated — Cards, paneles */
  --color-overlay:      rgba(8,8,9,0.85);     /* bg-overlay — Nav, modales */

  /* Acento (oro apagado) */
  --color-accent:       #c8a96e;              /* text-accent — Único color saturado */
  --color-accent-soft:  #e8d5a8;              /* hover */
  --color-accent-dim:   rgba(200,169,110,0.12); /* bg-accent-dim — fondos tintados */

  /* Foreground (texto) */
  --color-fg:           #f0ede8;              /* text-fg — Texto principal, blanco cálido */
  --color-fg-muted:     #8a8780;              /* text-fg-muted — Subtítulos, metadata */
  --color-fg-faint:     #4a4845;              /* text-fg-faint — Decorativo */

  /* Líneas (1px borders) */
  --color-line:         rgba(200,169,110,0.15);    /* border-line — Borde dorado tenue */
  --color-line-subtle:  rgba(240,237,232,0.06);    /* border-line-subtle */
}
```

**Regla de color:** El dorado (`text-accent`) es el único color con saturación visible. Se usa con mucha austeridad: números de proyecto, líneas decorativas, hovers, CTAs. El resto del sitio vive en escala de grises cálidos.

### Tipografía

```css
/* Display / Headings */
font-family: 'Cormorant Garamond', Georgia, serif;
/* Uso: H1, H2, títulos de proyecto, el nombre del estudio */
/* Peso: 300 (light) para elegancia, 600 para énfasis */

/* Body / UI */
font-family: 'Neue Haas Grotesk', 'Helvetica Neue', Helvetica, sans-serif;
/* Alternativa si no está disponible: 'DM Sans' */
/* Uso: párrafos, labels, navegación, metadatos */
/* Peso: 300 para body, 400 para UI, nunca más de 500 */

/* Monospace / Datos */
font-family: 'JetBrains Mono', 'Courier New', monospace;
/* Uso: números de proyecto (149.001), coordenadas, años, datos técnicos */
```

**Escala tipográfica:**
```
Display:  clamp(4rem, 8vw, 9rem)   — Títulos hero
H1:       clamp(2.5rem, 5vw, 5rem) — Títulos de sección
H2:       clamp(1.5rem, 3vw, 2.5rem)
H3:       1.2rem
Body:     1rem / line-height: 1.75
Small:    0.8rem / letter-spacing: 0.08em (uppercase para labels)
```

### Estética visual — reglas concretas

- **Grid:** 12 columnas. Proyectos y secciones rompen el grid intencionalmente (elementos que se salen, superposiciones de texto sobre imagen).
- **Espaciado:** Generoso. Secciones con mínimo `padding: 8rem 0`. El espacio vacío es parte del diseño.
- **Imágenes:** Siempre en escala de grises con un leve tinte cálido (`filter: grayscale(20%) contrast(1.05)`). En hover, revelan su color completo con transición suave.
- **Líneas:** Líneas de 1px en `--color-border` o `--color-border-subtle` como únicos elementos divisorios. Sin `box-shadow`, sin tarjetas con esquinas redondeadas.
- **Esquinas:** `border-radius: 0` en absolutamente todo. Este es un estudio de arquitectura — las esquinas son rectas.
- **Animaciones:** Sutiles. Transiciones de 0.4s–0.9s con `--ease-luxury` (cubic-bezier(0.22, 0.61, 0.36, 1)). Scroll reveal con `opacity` + `translateY(24px)`. Smooth scroll vía Lenis. Animaciones avanzadas vía GSAP (parallax, scroll-trigger, hover 3D). Sin bounces, sin springs exagerados.
- **Cursor:** Custom cursor — un crosshair fino o un punto pequeño con un anillo que se expande en hover sobre links e imágenes.

---

## 3. Stack Técnico

```
Build:        Vite 8
Framework:    React 19 (SPA, sin SSR ni RSC)
Lenguaje:     TypeScript 6 estricto (verbatimModuleSyntax)
Estilos:      Tailwind CSS v4 + tokens en @theme dentro de src/index.css
Animaciones:  CSS (transitions/keyframes) + IntersectionObserver custom.
              Para efectos avanzados se puede sumar GSAP — el skill
              `gsap-react` está disponible. NO usar Framer Motion.
Imágenes:     <img> nativo con srcset, loading=lazy, decoding=async,
              width/height explícitos para evitar CLS.
              Hosting: /public/proyectos/ por ahora; producción → Cloudinary.
Fuentes:      Google Fonts vía <link rel="preload"> en index.html con
              font-display: swap (Cormorant Garamond, DM Sans, JetBrains Mono).
Routing:      Single-page (anchor links #seccion). Sin react-router.
CMS:          Ninguno por ahora — datos hardcoded en cada componente.
Deploy:       Vercel (estático).
```

### Tailwind v4 — uso de tokens

Los tokens viven en `src/index.css` dentro de un bloque `@theme`:

```css
@theme {
  --color-bg-primary: #080809;
  --color-accent: #c8a96e;
  --font-display: "Cormorant Garamond", serif;
}
```

Tailwind v4 los expone automáticamente como utilities → **siempre usar la utility** (`bg-bg-primary`, `text-accent`, `font-display`), nunca `bg-[var(--color-bg-primary)]` ni hex hardcoded.

### Estructura de carpetas (real)

```
/index.html              — preconnect/preload de fuentes y metadata
/vite.config.ts
/tsconfig.app.json       — verbatimModuleSyntax, noUnusedLocals, jsx: react-jsx

/public
  /favicon.svg
  /proyectos             — imágenes de proyectos (renders, fotos)
                           Patrón: 149-024-casa-pedregal-01.webp
                           WebP/AVIF preferido, 1600px ancho máximo.

/src
  /main.tsx              — entry; importa lib/motion para registrar plugins GSAP
  /App.tsx               — orquesta SmoothScroll → ScrollSnap → secciones
  /index.css             — @import "tailwindcss" + @theme + utilidades

  /lib
    /motion.ts           — registra GSAP + ScrollTrigger + useGSAP una sola vez
                           Exporta { gsap, ScrollTrigger, prefersReducedMotion }

  /data                  — contenido tipado (single source of truth)
    /proyectos.ts        — PROYECTOS: Proyecto[]
    /servicios.ts        — SERVICIOS: Servicio[]
    /proceso.ts          — PASOS: Paso[]
    /stats.ts            — STATS: Stat[]

  /components
    /layout              — chrome de la página
      /Nav.tsx
      /Footer.tsx
      /SmoothScroll.tsx  — Lenis + bridge a GSAP ticker / ScrollTrigger.update
      /ScrollSnap.tsx    — sticky stack + ScrollTrigger.snap por sección
    /sections            — bloques de contenido principales
      /Hero.tsx
      /Filosofia.tsx
      /Proyectos.tsx
      /Servicios.tsx
      /Numeros.tsx
      /Proceso.tsx
      /Contacto.tsx
    /ui                  — primitivas reutilizables
      /Reveal.tsx        — IntersectionObserver wrapper para scroll reveal
```

### Sistema de scroll

Smooth scroll global con **Lenis** ([SmoothScroll.tsx](src/components/layout/SmoothScroll.tsx)) puenteado a **GSAP ScrollTrigger** vía `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(time => lenis.raf(time * 1000))`. ScrollTrigger queda disponible para cualquier scroll-driven animation (parallax en Hero, reveals, etc.) sin pelear con Lenis.

Las secciones tienen altura natural con `section-pad` (`padding-block: clamp(5rem, 10vw, 8rem)`). Sin scroll-snap forzado — el sitio scrolea continuo y los reveals al entrar al viewport (vía `Reveal` con IntersectionObserver) marcan el ritmo.

**Reduced motion:** `SmoothScroll` no monta Lenis y `Reveal` aparece estático.



## 4. Arquitectura de Componentes

### Nav
- Fija en la parte superior
- Fondo: `transparent` al top, `--color-bg-overlay` con `backdrop-filter: blur(20px)` al hacer scroll
- Logo: "149" en `Cormorant Garamond` tamaño grande + "arquitectura" en `Neue Haas Grotesk` pequeño, uppercase, tracking amplio
- Links: uppercase, 0.75rem, letter-spacing amplio, sin subrayado, hover con color `--color-accent`
- En mobile: menú hamburguesa que abre overlay de pantalla completa

### Hero
- Fullscreen (`100vh`)
- Imagen de fondo en escala de grises con overlay oscuro
- Texto superpuesto: número del proyecto o año en monospace arriba, título grande en `Cormorant Garamond`, tagline en sans-serif pequeño
- CTA: solo texto con flecha → sin botón con borde completo
- Scroll indicator: línea vertical animada abajo al centro

### ProjectCard
```tsx
interface ProjectCard {
  slug: string
  numero: string      // "149.001", "149.012"...
  titulo: string
  categoria: string   // "Residencial", "Corporativo", "Interiorismo"
  año: number
  ciudad: string
  imagen: string
  destacado?: boolean
}
```
- Imagen en escala de grises, hover revela color
- Número del proyecto en monospace pequeño, color `--color-accent`
- Título en `Cormorant Garamond`
- Metadata (año, ciudad, categoría) en sans-serif pequeño, muted
- Sin bordes redondeados, sin sombras

### ProjectGrid
- Masonry o grid asimétrico — NO grid uniforme de tarjetas iguales
- Proyecto destacado ocupa 2/3 del ancho
- Proyectos secundarios: 1/3 del ancho
- Gap: 1.5rem

### Footer
- Fondo `--color-bg-secondary`
- Tres columnas: Logo + tagline | Links de navegación | Datos de contacto
- Línea superior de 1px en `--color-border`
- Copyright en monospace pequeño

---

## 5. Páginas y Contenido

### Homepage — Secciones en orden

1. **Hero** — Imagen arquitectónica fullscreen, headline de impacto, scroll indicator
2. **Intro** — 2-3 líneas de filosofía del estudio. Tipografía grande, sin imágenes.
3. **Proyectos destacados** — Grid asimétrico con 3-4 proyectos recientes
4. **Servicios** — Lista limpia: Arquitectura · Interiorismo · Consultoría · Gerencia de proyecto
5. **Números** — Stats: años de experiencia, proyectos entregados, m² construidos, países
6. **CTA de contacto** — Sección oscura con headline grande y un solo botón o link
7. **Footer**

### Página de Proyecto individual

```
/proyectos/[slug]

— Header: número + título + metadata (año, área, ubicación, cliente, estatus)
— Hero image fullscreen
— Descripción del proyecto (2-3 párrafos)
— Galería: grid de imágenes en escala de grises
— Datos técnicos: tabla con especificaciones
— Proyectos relacionados: 2 proyectos al final
```

### Página Estudio

- Historia / origen del nombre "149"
- Filosofía de diseño en párrafos largos
- Equipo: foto en blanco y negro + nombre + rol
- Proceso de trabajo: 4-5 pasos en lista numerada

---

## 6. Copy y Tono de Voz

**Personalidad:** Seguro, preciso, sin excesos. El estudio habla con autoridad sin necesidad de exclamar.

**Reglas de copy:**
- Sin signos de exclamación
- Sin adjetivos vacíos ("increíble", "asombroso", "innovador")
- Oraciones cortas. Párrafos de máximo 4 líneas.
- Números siempre en numerales: "12 proyectos", no "doce proyectos"
- El estudio se refiere a sí mismo en tercera persona en la web

**Ejemplos de headlines aprobados:**
- "Arquitectura que define espacios. Espacios que definen identidad."
- "Cada proyecto comienza con una pregunta. ¿Cómo debería sentirse este lugar?"
- "149 proyectos de referencia. Un solo estándar."

**Ejemplos rechazados:**
- "¡Somos el mejor estudio de arquitectura!" ❌
- "Soluciones innovadoras para tus necesidades" ❌
- "Transformamos tus sueños en realidad" ❌

---

## 7. Performance y Accesibilidad

- Todas las imágenes con `alt` descriptivo
- `<img fetchPriority="high">` en above-the-fold; `loading="lazy"` debajo del fold
- Siempre declarar `width` y `height` (CLS = 0)
- Servir WebP/AVIF cuando sea posible
- Lighthouse score objetivo: 90+ en todas las categorías
- Semantic HTML: usar `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- Color contrast ratio mínimo 4.5:1 para texto sobre fondos oscuros
- `prefers-reduced-motion`: desactivar animaciones si el usuario lo solicita
- Listeners de scroll/touch siempre con `{ passive: true }`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. SEO y Metadata

La metadata base vive en `index.html` (no hay `app/layout.tsx`). Mantener:

```html
<title>149 Arquitectura — Estudio de Arquitectura Contemporánea</title>
<meta name="description" content="Estudio de arquitectura contemporánea especializado en proyectos residenciales, corporativos e interiorismo de alto nivel." />
<meta name="theme-color" content="#080809" />
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_MX" />
<meta property="og:site_name" content="149 Arquitectura" />
```

- Open Graph e imagen OG: hosteada en `/public/og.jpg` (1200×630).
- Si en el futuro se agregan rutas (`/proyectos/[slug]`), se evaluará React Router + react-helmet-async para metadata por página.

---

## 9. Convenciones de Código

### Naming
- Componentes: PascalCase → `ProjectCard.tsx`
- CSS custom properties: kebab-case → `--color-accent`
- Funciones: camelCase → `getProjectBySlug()`
- Tipos: PascalCase → `type ProjectMeta`

### Componentes — estructura estándar (Tailwind v4)

```tsx
// src/components/ProjectCard.tsx
type Props = {
  slug: string;
  numero: string;
  titulo: string;
};

export function ProjectCard({ numero, titulo }: Props) {
  return (
    <article className="border border-line-subtle bg-bg-secondary p-8">
      <span className="font-mono text-xs text-accent">{numero}</span>
      <h3 className="font-display mt-4 text-3xl text-text-primary">{titulo}</h3>
    </article>
  );
}
```

### No usar nunca
- `!important` en CSS (excepto la regla global `border-radius: 0`)
- `any` en TypeScript
- `inline styles` (salvo valores dinámicos imposibles de expresar en clases)
- `div` cuando existe un elemento semántico apropiado
- Colores hex hardcodeados — siempre vía utility Tailwind generada por `@theme`
- CSS Modules — el proyecto usa Tailwind v4, no CSS Modules
- Framer Motion — si hace falta animación avanzada, usar GSAP

---

## 10. Comandos del Proyecto

```bash
npm run dev        # Vite dev server (HMR)
npm run build      # tsc -b && vite build → dist/
npm run preview    # servir el build para verificar
npm run lint       # eslint
npx tsc -b         # type check sin emitir
```

**Patrón para nuevo componente:**
1. Crear `src/components/NombreComponente.tsx`
2. Importarlo en `src/App.tsx` o donde se use
3. Estilos vía clases Tailwind; tokens via utilities generadas por `@theme`

---

## 11. Lo que Claude Code debe recordar siempre

1. **Sin border-radius.** En ningún elemento. Jamás.
2. **El oro es escaso.** El acento dorado se usa solo para lo más importante — no en decoración.
3. **Las imágenes son en escala de grises** hasta el hover.
4. **Cormorant Garamond para display, Neue Haas / DM Sans para UI.**
5. **Espaciado generoso.** Si sientes que hay demasiado espacio vacío, probablemente está bien.
6. **Animaciones sutiles.** 0.4s–0.6s ease. Sin rebotes.
7. **TypeScript estricto.** Tipar todo.
8. **Antes de crear un componente nuevo, verificar si ya existe en `/components`.**
9. **Preguntar antes de cambiar la paleta, tipografía o estructura del grid.** Son decisiones de diseño deliberadas.
10. **Este sitio representa a un estudio de arquitectura de alto nivel. La calidad del código debe reflejar la calidad del trabajo del estudio.**
