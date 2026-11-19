"use client";
import { useEffect, useRef } from "react";
import { brand } from "@/content/chandon";
import { setupGsap, MOTION_OK } from "@/lib/gsap";
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from "./wordmark-paths";

/** Wordmark gigante que sube desde abajo al llegar al final de la pagina. */
export default function FooterWordmark() {
  const wrap = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const t = gsap.fromTo(mark.current, { yPercent: 85 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top 105%", end: "bottom bottom", scrub: 0.6 },
      });
      return () => t.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden pt-16">
      <span ref={mark} className="block text-gold will-change-transform">
        <svg viewBox={WORDMARK_VIEWBOX} role="img" aria-label={brand.name} className="block h-auto w-full" fill="currentColor">
          {WORDMARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </span>
    </div>
  );
}
