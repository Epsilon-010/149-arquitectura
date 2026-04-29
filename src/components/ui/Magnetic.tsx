import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/motion";

type Props = {
  children: ReactNode;
  /** How strongly the element is pulled toward the cursor. 0–1. */
  strength?: number;
  /** Span (default) or block — match what your child expects. */
  as?: "span" | "div";
  className?: string;
};

// Wraps a child element and pulls it toward the cursor when hovered.
// GSAP runs the tween so concurrent moves merge gracefully and the
// release ease (power3.out) is consistent with the rest of the site.
// Only active on (pointer: fine) devices — no-ops on touch and on
// users with prefers-reduced-motion.
export function Magnetic({
  children,
  strength = 0.35,
  as = "span",
  className = "",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        gsap.to(el, { x, y, duration: 0.45, ease: "power3.out" });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  const Tag = as;
  // Use the passed className verbatim. Hardcoding `inline-block` in
  // front would emit a `display` utility that competes with whatever
  // the caller passed (e.g. `hidden md:inline-block`) — and Tailwind
  // v4's cascade has `.inline-block` winning over `.hidden`, so the
  // mobile-hidden intent silently breaks. Fall back to inline-block
  // only when the caller doesn't supply any class.
  return (
    <Tag
      ref={ref as never}
      className={className.trim() || "inline-block"}
      style={{ willChange: "transform" }}
    >
      {children}
    </Tag>
  );
}
