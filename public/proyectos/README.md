# /public/proyectos

Imágenes de proyectos del estudio.

## Convención de nombres

```
149-024-casa-pedregal-01.webp
149-024-casa-pedregal-02.webp
149-024-casa-pedregal-hero.webp
└──┬──┘ └──────┬──────┘ └─┬┘
   │           │          │
   │           │          └── orden o tipo (01, 02, hero, plano)
   │           └────────────── slug del proyecto
   └────────────────────────── número de proyecto del estudio
```

## Recomendaciones técnicas

- **Formato:** WebP (o AVIF si está disponible). JPG sólo como fallback.
- **Ancho máximo:** 1600px. Si se necesita más detalle, generar también una versión `@2x` (3200px).
- **Peso objetivo:** < 250 KB por imagen full-bleed; < 80 KB para thumbnails.
- **Color:** entregar a color completo. El sitio aplica el filtro grayscale en CSS.

## Cómo se referencian desde React

```tsx
<img
  src="/proyectos/149-024-casa-pedregal-01.webp"
  alt="Casa Pedregal — fachada principal"
  width={1600}
  height={1200}
  loading="lazy"
  decoding="async"
  className="media-grayscale h-full w-full object-cover"
/>
```

## Cuándo migrar a Cloudinary / CDN externo

Esta carpeta es buena hasta ~30 imágenes / ~15 MB total. Cuando el portafolio
crezca o se necesite servir múltiples tamaños on-the-fly, mover a Cloudinary
(plan gratis, 25 GB) y referenciar con URL transformations:

```
https://res.cloudinary.com/149/image/upload/f_auto,q_auto,w_1600/proyectos/casa-pedregal-01
```

Cloudinary entrega WebP/AVIF automáticamente, redimensiona en la URL y cachea
globalmente. Es el patrón correcto para producción de un portafolio de
arquitectura con imágenes pesadas.
