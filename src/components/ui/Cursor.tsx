import { useEffect, useRef } from "react";

// Custom desktop cursor — a 6px dot that tracks the pointer 1:1 plus a
// 32px ring that lerps behind, so motion has a slight inertia. The ring
// scales up on `a`, `button`, and any [data-cursor-hover] element to
// telegraph interactivity. Native cursor is hidden while this mounts
// and restored on unmount.
//
// Strictly opt-in via media queries:
//   - (pointer: fine) and (hover: hover) — desktop only
//   - skipped on prefers-reduced-motion
// On touch devices nothing renders and nothing is hidden — the native
// cursor / tap behaviour is untouched.
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine =
      window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element &&
      !!el.closest('a, button, label, [role="button"], [data-cursor-hover]');
    const onOver = (e: MouseEvent) => {
      const next = isInteractive(e.target);
      if (next === hovering) return;
      hovering = next;
      ring.style.width = next ? "56px" : "32px";
      ring.style.height = next ? "56px" : "32px";
      ring.style.borderColor = next
        ? "var(--color-accent)"
        : "var(--color-fg)";
      dot.style.opacity = next ? "0" : "1";
    };

    const tick = () => {
      // Dot tracks 1:1 (precise click point)
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      // Ring trails with lerp (inertia)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      const r = parseFloat(ring.style.width || "32") / 2;
      ring.style.transform = `translate3d(${ringX - r}px, ${ringY - r}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    dot.style.opacity = "1";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.body.style.cursor = prevCursor;
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden border border-fg opacity-90 transition-[width,height,border-color] duration-300 ease-out md:block"
        style={{ width: 32, height: 32, willChange: "transform" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-1.5 w-1.5 bg-fg opacity-0 transition-opacity duration-200 md:block"
        style={{ willChange: "transform, opacity" }}
      />
    </>
  );
}
