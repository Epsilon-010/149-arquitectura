import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../../lib/motion";

// Mounts a single Lenis instance and bridges it to GSAP's ScrollTrigger so
// every ScrollTrigger.update fires off Lenis's RAF loop instead of native
// scroll events. This is the canonical Lenis × GSAP recipe.
//
// Tuned for an "editorial" feel: slow, soft easing — the page feels heavier
// and more deliberate, which reads as luxury rather than fast-and-flashy.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.9, // longer ride, more inertia
      easing: (t) => 1 - Math.pow(1 - t, 4), // quartic ease-out — gentle settle
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      lerp: 0.08,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
