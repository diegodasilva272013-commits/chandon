"use client";
import { useEffect, useRef } from "react";
import { home, ui } from "@/content/chandon";
import { setupGsap, MOTION_OK } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";

const o = home.origin;

/** Escena 2. Pantalla fija durante 200vh: el ano cuenta de 1743 a 1959 y entran tres frases. */
export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const lines = useRef<HTMLParagraphElement[]>([]);
  const caption = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const counter = { v: o.fromYear };
      gsap.set([...lines.current, caption.current], { opacity: 0, y: 28 });
      if (year.current) year.current.textContent = String(o.fromYear);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(bg.current, { scale: 1, yPercent: -6, duration: 2 }, 0)
        .to(
          counter,
          {
            v: o.toYear,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (year.current) year.current.textContent = String(Math.round(counter.v));
            },
          },
          0.1,
        )
        .to(lines.current[0], { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.25)
        .to(lines.current[1], { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.75)
        .to(lines.current[2], { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 1.25)
        .to(caption.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 1.65);
      return () => tl.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-ink px-5 pb-12 pt-28 md:px-10">
      <div ref={bg} className="absolute inset-0 scale-[1.18] will-change-transform">
        <Photo src={o.image} alt={ui.alt.origin} sizes="100vw" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <p className="kicker">{o.kicker}</p>
        <p
          className="mt-2 font-bold leading-[0.85] tracking-[-0.05em] [font-variant-numeric:tabular-nums]"
          style={{ fontSize: "clamp(110px, 27vw, 420px)" }}
        >
          <span className="sr-only">{o.toYear}</span>
          <span ref={year} aria-hidden="true">
            {o.toYear}
          </span>
        </p>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div className="space-y-3">
          {o.lines.map((line, i) => (
            <p
              key={line}
              ref={(el) => {
                if (el) lines.current[i] = el;
              }}
              className="max-w-xl text-[clamp(18px,2vw,28px)] font-light leading-snug"
            >
              {line}
            </p>
          ))}
        </div>
        <p ref={caption} className="max-w-xs text-sm font-light leading-relaxed text-[var(--mute)] md:justify-self-end">
          {o.caption}
        </p>
      </div>
    </section>
  );
}
