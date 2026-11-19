"use client";
import { useEffect, useRef } from "react";
import { setupGsap, MOTION_OK } from "@/lib/gsap";

/** Barra de progreso dorada + botones magneticos (solo con mouse y sin reduced-motion). */
export default function GlobalFx() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });

    const mm = gsap.matchMedia();
    mm.add(`(hover: hover) and (pointer: fine) and ${MOTION_OK}`, () => {
      let current: HTMLElement | null = null;
      const move = (e: PointerEvent) => {
        const t = (e.target as Element | null)?.closest?.(".btn") as HTMLElement | null;
        if (current && current !== t) {
          gsap.to(current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          current = null;
        }
        if (!t) return;
        current = t;
        const r = t.getBoundingClientRect();
        gsap.to(t, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.4,
          duration: 0.35,
          ease: "power3.out",
        });
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => {
        window.removeEventListener("pointermove", move);
        if (current) gsap.set(current, { x: 0, y: 0 });
      };
    });
    return () => {
      st.kill();
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
