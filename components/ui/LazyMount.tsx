"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { setupGsap } from "@/lib/gsap";

/** Monta (y descarga el JS de) su contenido recien cuando esta cerca de la pantalla. Reserva la altura para no mover el layout. */
export default function LazyMount({
  children,
  minHeight,
  margin = 900,
}: {
  children: ReactNode;
  minHeight: number | string;
  margin?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin}px 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  useEffect(() => {
    if (on) setupGsap().ScrollTrigger.refresh();
  }, [on]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {on ? children : null}
    </div>
  );
}
