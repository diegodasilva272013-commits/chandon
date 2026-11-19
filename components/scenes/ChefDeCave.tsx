"use client";
import { useEffect, useRef } from "react";
import { home, ui } from "@/content/chandon";
import { setupGsap, MOTION_OK } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";
import RichHeading from "@/components/ui/RichHeading";

const c = home.chef;

/** Escena 7. Retrato que se abre con clip-path y paralaje; la linea de Chefs de Cave se enciende con el scroll. */
export default function ChefDeCave() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const mm = gsap.matchMedia();
    const rootEl = root.current;
    if (!rootEl) return;
    mm.add(MOTION_OK, () => {
      const items = rootEl.querySelectorAll<HTMLElement>("[data-name]");
      gsap.set(frame.current, { clipPath: "inset(18% 18% 18% 18%)" });
      gsap.set(photo.current, { scale: 1.5 });
      const dim = ScrollTrigger.create({
        trigger: rootEl,
        start: "top bottom+=500",
        once: true,
        onEnter: () => gsap.set(items, { opacity: 0.12, x: -40 }),
      });

      const open = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: rootEl, start: "top 85%", end: "top 15%", scrub: 0.7 },
      });
      open.to(frame.current, { clipPath: "inset(0% 0% 0% 0%)" }, 0).to(photo.current, { scale: 1.12 }, 0);

      const drift = gsap.to(photo.current, {
        yPercent: -9,
        ease: "none",
        scrollTrigger: { trigger: rootEl, start: "top 15%", end: "bottom top", scrub: true },
      });

      const names = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: rootEl.querySelector("[data-list]"), start: "top 85%", end: "bottom 45%", scrub: 0.6 },
      });
      items.forEach((it, i) =>
        names.fromTo(it, { opacity: 0.12, x: -40 }, { opacity: i === items.length - 1 ? 1 : 0.55, x: 0, duration: 1, immediateRender: false }, i * 0.7),
      );

      return () => {
        dim.kill();
        open.scrollTrigger?.kill();
        drift.scrollTrigger?.kill();
        names.scrollTrigger?.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="chef" className="on-bone grid min-h-[100svh] overflow-hidden md:grid-cols-2">
      <div className="relative min-h-[78svh] md:min-h-0">
        <div ref={frame} className="absolute inset-0 overflow-hidden">
          <div ref={photo} className="absolute -inset-[6%] will-change-transform">
            <Photo src={c.image} alt={`${c.name}, ${ui.alt.chefSuffix}`} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-24 md:px-14 lg:px-20">
        <p className="kicker">{c.kicker}</p>
        <RichHeading id="chef" parts={[c.name]} className="h2 mt-4" />
        <p className="lead mt-8">{c.text}</p>

        <ol data-list className="mt-14 space-y-1" aria-label={ui.chefList}>
          {c.lineage.map((name) => (
            <li
              key={name}
              data-name
              className="text-[clamp(26px,3.6vw,52px)] font-semibold leading-[1.08] tracking-tight"
            >
              {name}
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-ink/70">{c.lineageNote}</p>
      </div>
    </section>
  );
}
