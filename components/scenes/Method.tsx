"use client";
import { useEffect, useRef } from "react";
import { home, method } from "@/content/chandon";
import { setupGsap } from "@/lib/gsap";
import { Photo } from "@/components/ui/media";
import Bubbles from "./Bubbles";

const N = method.length;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Escena 6. Cinco pasos del metodo, fijos en pantalla; un numero enorme cambia a la izquierda. */
export default function Method() {
  const root = useRef<HTMLElement>(null);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const txtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const intensity = useRef(0.15);

  useEffect(() => {
    const { gsap } = setupGsap();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const apply = (t: number) => {
        for (let i = 0; i < N; i++) {
          const d = i - t;
          const o = clamp(1 - Math.abs(d) * 1.7);
          const n = numRefs.current[i];
          const x = txtRefs.current[i];
          if (n) {
            n.style.opacity = String(o);
            n.style.transform = `translate3d(0, ${d * 60}px, 0)`;
          }
          if (x) {
            x.style.opacity = String(o);
            x.style.transform = `translate3d(0, ${d * 40}px, 0)`;
            x.style.pointerEvents = o > 0.5 ? "auto" : "none";
          }
        }
        // las burbujas suben en la segunda fermentacion (paso 4, indice 3)
        intensity.current = 0.15 + 0.85 * clamp(1 - Math.abs(t - 3) * 0.9);
        if (barRef.current) barRef.current.style.transform = `scaleY(${(0.04 + (t / (N - 1)) * 0.96).toFixed(3)})`;
      };
      apply(0);
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 0.8 * (N - 1))}`,
          pin: true,
          scrub: 0.5,
          snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.5 }, ease: "power2.out" },
          invalidateOnRefresh: true,
          onUpdate: (self) => apply(self.progress * (N - 1)),
        },
      });
      return () => {
        st.scrollTrigger?.kill();
        st.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="metodo" className="relative min-h-[100svh] overflow-hidden bg-ink">
      <Bubbles intensity={intensity} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pb-12 pt-28 md:px-10">
        <header>
          <p className="kicker">{home.method.kicker}</p>
          <h2 id="metodo" className="h3 mt-3 max-w-xl">{home.method.title}</h2>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-[var(--mute)]">{home.method.intro}</p>
        </header>

        {/* escena apilada: cada paso ocupa el mismo lugar y se mezcla por cercania */}
        {/* version estatica para quienes piden menos movimiento */}
        <ol className="hidden motion-reduce:mt-12 motion-reduce:grid motion-reduce:gap-10 md:motion-reduce:grid-cols-2">
          {method.map((s) => (
            <li key={s.n} className="flex gap-6">
              <span className="text-5xl font-bold leading-none text-gold [font-variant-numeric:tabular-nums]">{s.n}</span>
              <div>
                <h3 className="h3">{s.title}</h3>
                <p className="lead mt-3 text-[var(--mute)]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative my-auto grid flex-1 items-center md:grid-cols-[5fr_6fr] md:gap-10 motion-reduce:hidden">
          <div className="relative h-[34vh] md:h-[56vh]" aria-hidden="true">
            {method.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  numRefs.current[i] = el;
                }}
                className="absolute inset-0 flex items-center font-bold leading-none tracking-[-0.06em] text-gold [font-variant-numeric:tabular-nums] motion-reduce:static motion-reduce:opacity-100"
                style={{ fontSize: "clamp(150px, 30vw, 440px)", opacity: i === 0 ? 1 : 0 }}
              >
                {s.n}
              </div>
            ))}
          </div>

          <div className="relative h-[40vh] md:h-[56vh]">
            {method.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  txtRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center gap-6 md:flex-row md:items-center md:gap-10"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="relative hidden h-44 w-44 shrink-0 bg-bone md:block">
                  <Photo src={s.icon} alt="" sizes="176px" className="!object-contain p-2" />
                </div>
                <div>
                  <h3 className="h3">
                    <span className="sr-only">{s.n}. </span>
                    {s.title}
                  </h3>
                  <p className="lead mt-4 text-[var(--mute)]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span aria-hidden="true" className="absolute bottom-12 right-5 hidden h-40 w-px bg-[var(--line)] md:right-10 md:block">
          <span ref={barRef} className="absolute inset-0 origin-bottom bg-gold" style={{ transform: "scaleY(0.04)" }} />
        </span>
      </div>
    </section>
  );
}
