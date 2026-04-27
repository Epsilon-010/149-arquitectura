import "./App.css";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Hero } from "./components/sections/Hero";
import { Filosofia } from "./components/sections/Filosofia";
import { Proyectos } from "./components/sections/Proyectos";
import { Servicios } from "./components/sections/Servicios";
import { Contacto } from "./components/sections/Contacto";

export default function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Filosofia />
        <Proyectos />
        <Servicios />
        <Contacto />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
