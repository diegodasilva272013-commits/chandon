"use client";
import { useEffect, useRef } from "react";
import { home, ui, vineyards } from "@/content/chandon";
import { setupGsap } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";
import { Star } from "@/components/ui/brand";

const order = ["agrelo", "el-yaima", "caicayen", "el-espinillo"] as const;
const list = order.map((id) => vineyards.find((v) => v.id === id)!);
const MIN = 1000;
const MAX = 1700;
const TOP = Math.max(...list.map((v) => v.altTo));
const fmt = (n: number) => n.toLocaleString("es-AR");

/** Escena 4. El scroll vertical mueve un carril horizontal; un altimetro sube con el avance. */
export default function Altitude() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.min(1, Math.max(0, (self.progress - 0.1) / 0.9));
            const alt = MIN + (TOP - MIN) * p;
            const panels = wrap.current!.querySelectorAll<HTMLElement>("[data-pimg]");
            panels.forEach((el, k) => {
              const d = self.progress * panels.length - (k + 0.5);
              el.style.transform = `translate3d(${(d * 11).toFixed(2)}vw, 0, 0)`;
            });
            if (num.current) num.current.textContent = fmt(Math.round(alt / 5) * 5);
            if (marker.current) marker.current.style.transform = `translate3d(0, ${-(((alt - MIN) / (MAX - MIN)) * 100).toFixed(2)}%, 0)`;
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} aria-label={home.altitude.title} className="relative overflow-hidden bg-ink">
      <div ref={track} className="flex flex-col md:h-[100svh] md:flex-row motion-reduce:md:h-auto motion-reduce:md:flex-col">
        {/* panel de apertura */}
        <article className="relative flex min-h-[80svh] flex-col justify-center px-5 py-24 md:h-[100svh] md:w-screen md:shrink-0 md:px-10 md:pl-[260px] motion-reduce:md:h-auto motion-reduce:md:w-full motion-reduce:md:pl-10">
          <h2 className="h2 max-w-4xl">{home.altitude.title}</h2>
          <p className="lead mt-8 text-[var(--mute)]">{home.altitude.intro}</p>
        </article>

        {list.map((v) => (
          <article
            key={v.id}
            className="relative flex min-h-[85svh] items-end overflow-hidden md:h-[100svh] md:w-screen md:shrink-0 motion-reduce:md:h-[85svh] motion-reduce:md:w-full"
          >
            <div data-pimg className="absolute inset-y-0 -inset-x-[14%] will-change-transform">
              <Photo src={v.image} alt={`${ui.vineyardPrefix} ${v.name}, ${v.zone}`} sizes="120vw" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
            <div className="relative z-10 w-full px-5 pb-14 md:px-10 md:pb-20 md:pl-[260px] motion-reduce:md:pl-10">
              <p className="kicker">{v.zone}</p>
              <h3 className="h2 mt-3 max-w-3xl">{v.name}</h3>
              <p className="mt-4 text-[clamp(40px,6vw,88px)] font-bold leading-none tracking-tight text-gold">
                {v.altLabel}
              </p>
              <p className="lead mt-6">{v.soil}</p>
              <p className="mt-3 max-w-[52ch] text-sm font-light text-[var(--mute)]">{v.note}</p>
            </div>
          </article>
        ))}
      </div>

      {/* altimetro y contador (solo animado en escritorio) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[300px] bg-gradient-to-r from-ink via-ink/85 to-transparent md:block motion-reduce:md:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute left-10 top-[18vh] z-20 hidden h-[60vh] md:block motion-reduce:md:hidden">
        <div className="relative h-full w-px bg-[var(--line)]">
          {[0, 25, 50, 75, 100].map((t) => (
            <span key={t} className="absolute left-0 h-px w-3 bg-bone/50" style={{ bottom: `${t}%` }} />
          ))}
          <span className="absolute -top-6 left-5 text-xs font-semibold tracking-widest text-[var(--mute)]">{fmt(MAX)}</span>
          <span className="absolute -bottom-6 left-5 text-xs font-semibold tracking-widest text-[var(--mute)]">{fmt(MIN)}</span>
          <div ref={marker} className="absolute bottom-0 left-0 flex items-center gap-3 text-gold" style={{ transform: "translate3d(0,0,0)" }}>
            <span className="block h-px w-8 translate-y-1/2 bg-current" />
            <Star size={16} className="translate-y-1/2" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-10 z-20 hidden md:block motion-reduce:md:hidden">
        <p className="text-[clamp(44px,4.4vw,64px)] font-bold leading-none tracking-tighter">
          <span ref={num} className="[font-variant-numeric:tabular-nums]">{fmt(MIN)}</span>
        </p>
        <p className="kicker mt-1">{home.altitude.unit}</p>
      </div>
    </section>
  );
}
