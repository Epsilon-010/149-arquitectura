export type Servicio = {
  n: string;
  titulo: string;
  desc: string;
};

export const SERVICIOS: Servicio[] = [
  {
    n: "01",
    titulo: "Diseño arquitectónico y proyecto ejecutivo",
    desc: "Concepto, anteproyecto y documentación constructiva completa. Cada plano resuelto antes del primer trazo en obra.",
  },
  {
    n: "02",
    titulo: "Remodelación y ampliaciones",
    desc: "Intervención de espacios existentes con respeto al carácter original. Ampliaciones que dialogan con la arquitectura previa.",
  },
  {
    n: "03",
    titulo: "Diseño y fabricación de mobiliario",
    desc: "Piezas a medida diseñadas para cada proyecto. Producción coordinada con artesanos y carpinteros locales.",
  },
  {
    n: "04",
    titulo: "Supervisión y administración de obra",
    desc: "Acompañamiento semanal en sitio. Coordinación de proveedores y control de calidad hasta la entrega de llaves.",
  },
];
