"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { byCollection, collections, home, type CollectionId } from "@/content/chandon";
import { setupGsap, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { Bottle } from "@/components/ui/media";
import RichHeading from "@/components/ui/RichHeading";

const ids: CollectionId[] = ["signature", "free-spirits", "roots"];

/**
 * Escena 5. Split con pin: el titulo de cada coleccion queda fijo mientras sus botellas suben
 * por la derecha con paralaje, giro y zoom atados al scroll. Un nombre gigante en contorno se desplaza detras.
 */
export default function Collections() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const mm = gsap.matchMedia();
    const rootEl = root.current;
    if (!rootEl) return;

    mm.add(MOTION_OK, () => {
      const blocks = rootEl.querySelectorAll<HTMLElement>("[data-block]");
      blocks.forEach((block) => {
        const giant = block.querySelector<HTMLElement>("[data-giant]");
        if (giant) {
          gsap.fromTo(giant, { xPercent: 8 }, {
            xPercent: -38,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        block.querySelectorAll<HTMLElement>("[data-item]").forEach((li, i) => {
          const par = li.querySelector<HTMLElement>("[data-par]");
          const glow = li.querySelector<HTMLElement>("[data-glow]");
          if (par) {
            gsap.fromTo(par, { yPercent: 10, rotate: i % 2 ? 5 : -5, scale: 0.8, opacity: 0.25 }, {
              yPercent: -10,
              rotate: i % 2 ? -4 : 4,
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: li, start: "top 100%", end: "bottom 30%", scrub: 0.8 },
            });
          }
          if (glow) {
            gsap.fromTo(glow, { scale: 0.4, opacity: 0 }, {
              scale: 1.15,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: li, start: "top 90%", end: "center center", scrub: true },
            });
          }
        });
      });
    });

    // Titulo fijo solo en escritorio
    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
      const blocks = rootEl.querySelectorAll<HTMLElement>("[data-block]");
      const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];
      blocks.forEach((block) => {
        const left = block.querySelector<HTMLElement>("[data-left]");
        if (!left) return;
        triggers.push(
          ScrollTrigger.create({ trigger: block, start: "top top", end: "bottom bottom", pin: left, pinSpacing: false }),
        );
      });
      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="colecciones" className="relative bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-10 md:pt-48">
        <RichHeading id="colecciones" parts={[home.collections.title]} />
      </div>

      {ids.map((id, idx) => {
        const list = byCollection(id);
        const col = collections[id];
        const flip = idx === 1;
        return (
          <div key={id} data-block className="relative mt-10 overflow-x-clip border-t border-[var(--line)] md:mt-32">

            <div className={`relative z-10 mx-auto grid max-w-[1600px] px-5 md:px-10 ${flip ? "md:grid-cols-[7fr_5fr]" : "md:grid-cols-[5fr_7fr]"}`}>
              <div data-left className={`relative flex flex-col justify-center pb-6 pt-14 md:h-[100svh] md:py-0 ${flip ? "md:order-2 md:pl-10" : "md:pr-10"}`}>
            <div
              aria-hidden="true"
              data-giant
              className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap font-bold uppercase leading-none tracking-[-0.04em]"
              style={{
                fontSize: "clamp(120px, 22vw, 420px)",
                color: "transparent",
                WebkitTextStroke: "1px rgb(240 233 220 / 0.14)",
              }}
            >
              {col.name}
            </div>
                <div className="relative z-10">
                <h3 className="h2">{col.name}</h3>
                <p className="lead mt-6 text-[var(--mute)]">{col.text}</p>
                <Link href="/espumantes" className="btn btn-ghost mt-8 w-fit">
                  {home.collections.cta}
                </Link>
                </div>
              </div>

              <ul className={`relative z-10 flex flex-col gap-[6svh] pb-10 md:gap-[14svh] md:py-[16svh] ${flip ? "md:order-1" : ""}`}>
                {list.map((p, i) => (
                  <li
                    key={p.slug}
                    data-item
                    className={`relative flex ${i % 2 ? "justify-center md:justify-end md:pr-[6%]" : "justify-center md:justify-start md:pl-[6%]"}`}
                  >
                    <Link
                      href={`/espumantes/${p.slug}`}
                      className="group relative block"
                      onPointerMove={(e) => {
                        if (e.pointerType !== "mouse") return;
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width - 0.5;
                        const y = (e.clientY - r.top) / r.height - 0.5;
                        e.currentTarget.style.setProperty("--ry", `${x * 18}deg`);
                        e.currentTarget.style.setProperty("--rx", `${-y * 8}deg`);
                      }}
                      onPointerLeave={(e) => {
                        e.currentTarget.style.setProperty("--ry", "0deg");
                        e.currentTarget.style.setProperty("--rx", "0deg");
                      }}
                    >
                      <span
                        aria-hidden="true"
                        data-glow
                        className="absolute left-1/2 top-[44%] -z-10 block aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2"
                        style={{ background: `radial-gradient(circle, ${p.accent}55 0%, transparent 62%)` }}
                      />
                      <span data-par className="block will-change-transform">
                        <span
                          className="block transition-transform duration-500 [transition-timing-function:var(--ease-out)]"
                          style={{ transform: "perspective(900px) rotateY(var(--ry, 0deg)) rotateX(var(--rx, 0deg))" }}
                        >
                          <Bottle
                            src={p.bottle}
                            alt={p.name}
                            sizes="(min-width: 768px) 22vw, 50vw"
                            className="h-[46svh] min-h-[300px] w-auto md:h-[clamp(300px,64svh,640px)]"
                          />
                        </span>
                      </span>
                      <span className={`mt-4 block max-w-[16rem] text-center md:text-left md:absolute md:bottom-0 md:max-w-[13rem] ${i % 2 ? "md:right-full md:mr-6 md:text-right" : "md:left-full md:ml-6"}`}>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{p.short}</span>
                        <span className="mt-2 block text-sm font-light leading-snug">{p.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
      <div className="h-24 md:h-40" aria-hidden="true" />
    </section>
  );
}
