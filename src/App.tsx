import "./App.css";
import { Nav } from "./components/layout/Nav";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Hero } from "./components/sections/Hero";
import { Filosofia } from "./components/sections/Filosofia";
import { Proyectos } from "./components/sections/Proyectos";
import { Servicios } from "./components/sections/Servicios";
import { Contacto } from "./components/sections/Contacto";
import { Grain } from "./components/ui/Grain";
import { Cursor } from "./components/ui/Cursor";
import { ClipDefs } from "./components/ui/ClipDefs";

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
      <Grain />
      <Cursor />
      <ClipDefs />
    </SmoothScroll>
  );
}
