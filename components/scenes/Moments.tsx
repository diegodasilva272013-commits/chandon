"use client";
import { useEffect, useRef } from "react";
import { home, moments, ui } from "@/content/chandon";
import { setupGsap, DESKTOP, MOTION_OK } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";
import RichHeading from "@/components/ui/RichHeading";

/**
 * Escena 9. Tarjetas apiladas (sticky stack): cada una se queda fija y la siguiente la tapa
 * mientras la anterior se achica y se oscurece. Cada una abre su reel en pestana nueva.
 */
export default function Moments() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
      const kills: (() => void)[] = [];
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const img = card.querySelector<HTMLElement>("[data-img]");
        if (img) {
          const t = gsap.fromTo(img, { scale: 1.25 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 20%", scrub: true },
          });
          kills.push(() => t.scrollTrigger?.kill());
        }
        if (!next) return;
        const t = gsap.to(card, {
          scale: 0.92,
          filter: "brightness(0.35)",
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 95%", end: "top 20%", scrub: true },
        });
        kills.push(() => t.scrollTrigger?.kill());
      });
      return () => kills.forEach((k) => k());
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="momentos" className="bg-ink px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1600px]">
        <RichHeading id="momentos" parts={[home.moments.title]} />
        <ul className="mt-16 md:mt-24">
          {moments.map((m, i) => (
            <li
              key={m.id}
              data-card
              className="relative mb-6 md:sticky md:mb-[14svh] md:h-[76svh]"
              style={{ top: `calc(var(--nav-h) + ${i * 26}px)` }}
            >
              <div className="grid h-full overflow-hidden bg-ink-2 md:grid-cols-[1.7fr_1fr]">
                <div className="relative min-h-[48svh] overflow-hidden md:min-h-0">
                  <div data-img className="absolute inset-0 will-change-transform">
                    <Photo src={m.image} alt="" sizes="(min-width: 768px) 62vw, 100vw" />
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
                  <h3 className="h2 !text-[clamp(32px,4.4vw,72px)]">{m.name}</h3>
                  <div>
                    <p className="text-[15px] font-light leading-relaxed text-[var(--mute)]">{m.text}</p>
                    <span className="btn btn-gold mt-6">
                      {home.moments.open}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M4 12 12 4M5 4h7v7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <a href={m.reel} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10">
                <span className="sr-only">
                  {home.moments.open}: {m.name}, {ui.newTab}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
