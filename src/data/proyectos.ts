import projectImages from "./cloudinary-projects.json";

export type Proyecto = {
  /** URL slug — used for future routing & anchors. */
  slug: string;
  /** Project number shown in the editorial metadata strip. */
  numero: string;
  titulo: string;
  /** Free-form so the studio can use whatever taxonomy fits — not
      gated to a fixed enum. */
  categoria: string;
  /** Year string — supports ranges like "2022–2025" without coercion. */
  ano: string;
  ciudad: string;
  /** All images for the project, in the order Cloudinary returns them
      (sorted alphabetically by `public_id`). The first item is used
      as the cover; the rest cycle on hover. May be empty if the
      Cloudinary folder is empty or the fetch script hasn't run. */
  imagenes: string[];
};

// Manual project metadata. Pairs by index with the `proyects/N/`
// folders in Cloudinary — entry [0] gets images from `proyects/1/`,
// entry [1] from `proyects/2/`, etc. Add/remove from this list AND
// the corresponding folder; the carousel handles empty arrays.
const META: Omit<Proyecto, "imagenes">[] = [
  {
    slug: "ferrocarril",
    numero: "149.001",
    titulo: "Departamento Ferrocarril",
    categoria: "Remodelación / Interiorismo",
    ano: "2026",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "los-jardines",
    numero: "149.002",
    titulo: "Los Jardines",
    categoria: "Residencial",
    ano: "2023",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "huayapam",
    numero: "149.003",
    titulo: "Huayapam",
    categoria: "Residencial",
    ano: "2024",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "las-cruces",
    numero: "149.004",
    titulo: "Las Cruces",
    categoria: "Residencial",
    ano: "2025",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "babilonia",
    numero: "149.005",
    titulo: "Babilonia",
    categoria: "Residencial",
    ano: "2025",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "la-purisima",
    numero: "149.006",
    titulo: "La Purísima",
    // Categoría no definida por el cliente — defaulteada a Residencial
    // (la mayoría del portafolio lo es). Cambiar aquí si se confirma
    // otra clasificación.
    categoria: "Residencial",
    ano: "2022",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "terra",
    numero: "149.007",
    titulo: "Terra",
    categoria: "Hotelero",
    ano: "2023",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "escondida",
    numero: "149.008",
    titulo: "Escondida",
    categoria: "Residencial",
    ano: "2024",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "zegache",
    numero: "149.009",
    titulo: "Zegache",
    categoria: "Proyecto Social",
    ano: "2022–2025",
    ciudad: "Oaxaca, MX",
  },
  {
    slug: "constitucion",
    numero: "149.010",
    titulo: "Constitución",
    categoria: "Residencial",
    ano: "2026",
    ciudad: "Oaxaca, MX",
  },
];

const images = projectImages as Record<string, string[]>;

export const PROYECTOS: Proyecto[] = META.map((meta, i) => ({
  ...meta,
  imagenes: images[String(i + 1)] ?? [],
}));
