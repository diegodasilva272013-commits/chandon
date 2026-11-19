"use client";
import { useEffect, useRef } from "react";
import { home, ui } from "@/content/chandon";
import { setupGsap, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";

/**
 * Escena 1. Text mask reveal: el titulo es una ventana (multiply sobre fondo negro) que deja ver la foto
 * solo dentro de las letras. Al scrollear el titulo se agranda hasta que la foto llena toda la pantalla.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const letters = useRef<HTMLSpanElement[]>([]);
  const sub = useRef<HTMLParagraphElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const intro = gsap.timeline({ delay: 0.7, defaults: { ease: "power4.out" } });
      intro
        .from(letters.current, { yPercent: 120, rotate: 4, duration: 1.2, stagger: 0.07 })
        .from(sub.current, { y: 22, opacity: 0, duration: 1 }, "-=0.6")
        .from(line.current, { opacity: 0, duration: 0.8 }, "-=0.6");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(sub.current, { opacity: 0, y: -30, duration: 0.18 }, 0)
        .to(line.current, { opacity: 0, duration: 0.1 }, 0)
        .to(title.current, { scale: 26, duration: 1, ease: "power2.in" }, 0)
        .to(mask.current, { opacity: 0, duration: 0.3 }, 0.7)
        .to(img.current, { scale: 1.12, duration: 1 }, 0);

      return () => {
        intro.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
        ScrollTrigger.refresh();
      };
    });

    // Con menos movimiento: titulo claro sobre la foto, sin pin ni mascara.
    mm.add(MOTION_REDUCED, () => {
      if (mask.current) {
        mask.current.style.mixBlendMode = "normal";
        mask.current.style.background = "transparent";
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink">
      <div ref={img} className="absolute inset-0 will-change-transform">
        <div className="kenburns absolute inset-0">
          <Photo src={home.heroImage} alt={ui.alt.hero} priority sizes="100vw" />
        </div>
      </div>

      {/* capa mascara: negro multiplicado, el texto blanco deja pasar la foto */}
      <div ref={mask} className="absolute inset-0 bg-ink" style={{ mixBlendMode: "multiply" }}>
        <div className="flex h-full w-full items-center justify-center">
          <h1
            ref={title}
            aria-label={home.heroTitle}
            className="flex origin-center select-none overflow-hidden pb-[0.04em] font-bold leading-[0.9] tracking-[-0.045em] text-white will-change-transform"
            style={{ fontSize: "clamp(58px, 19.5vw, 400px)" }}
          >
            {home.heroTitle.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                ref={(el) => {
                  if (el) letters.current[i] = el;
                }}
                className="inline-block"
              >
                {ch}
              </span>
            ))}
          </h1>
        </div>
      </div>

      <p
        ref={sub}
        className="absolute inset-x-0 bottom-[16svh] z-10 px-5 text-center text-[clamp(18px,2.2vw,32px)] font-light leading-snug md:bottom-[14svh]"
      >
        {home.heroSubtitle}
      </p>

      <span ref={line} aria-hidden="true" className="absolute bottom-8 left-1/2 z-10 block h-16 w-px -translate-x-1/2 overflow-hidden bg-[var(--line)]">
        <span className="drip absolute inset-0 block bg-gold" />
      </span>
    </section>
  );
}
