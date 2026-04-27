export type Proyecto = {
  numero: string;
  titulo: string;
  categoria: "Residencial" | "Corporativo" | "Interiorismo" | "Hospitalidad";
  ano: number;
  ciudad: string;
  imagen: string;
};

export const PROYECTOS: Proyecto[] = [
  {
    numero: "149.024",
    titulo: "Casa Pedregal",
    categoria: "Residencial",
    ano: 2024,
    ciudad: "Ciudad de México",
    imagen:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=75",
  },
  {
    numero: "149.022",
    titulo: "Torre Reforma 88",
    categoria: "Corporativo",
    ano: 2023,
    ciudad: "Ciudad de México",
    imagen:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=75",
  },
  {
    numero: "149.021",
    titulo: "Atelier Centro",
    categoria: "Interiorismo",
    ano: 2023,
    ciudad: "Oaxaca de Juárez",
    imagen:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=75",
  },
  {
    numero: "149.019",
    titulo: "Pabellón Valle",
    categoria: "Residencial",
    ano: 2022,
    ciudad: "Valle de Bravo",
    imagen:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=75",
  },
  {
    numero: "149.017",
    titulo: "Hotel Costera",
    categoria: "Hospitalidad",
    ano: 2022,
    ciudad: "Tulum",
    imagen:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=75",
  },
  {
    numero: "149.014",
    titulo: "Loft Industrial",
    categoria: "Interiorismo",
    ano: 2021,
    ciudad: "Monterrey",
    imagen:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=75",
  },
];
