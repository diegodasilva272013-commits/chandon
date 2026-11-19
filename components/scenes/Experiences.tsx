"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { brand, experiences, home, ui, type Experience } from "@/content/chandon";
import { Photo } from "@/components/ui/media";
import RichHeading from "@/components/ui/RichHeading";

const t = home.experiences;

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function Action({ x }: { x: Experience }) {
  return x.bookingUrl ? (
    <a href={x.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
      {t.book} <Arrow />
      <span className="sr-only"> {x.name}, {ui.newTab}</span>
    </a>
  ) : (
    <a href={brand.visits.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
      {t.contact} <Arrow />
      <span className="sr-only"> {x.name} {ui.viaWhatsapp}, {ui.newTab}</span>
    </a>
  );
}

/**
 * Escena 8. En escritorio: acordeon horizontal, franjas verticales que se abren al pasar el mouse.
 * En celular: carrusel con arrastre. Titular con fotos incrustadas.
 */
export default function Experiences({ showCta = true }: { showCta?: boolean }) {
  const [open, setOpen] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });

  const onDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, moved: false, x: e.clientX, left: track.current!.scrollLeft };
  };
  const onMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d.down) return;
    if (Math.abs(e.clientX - d.x) > 4) d.moved = true;
    track.current!.scrollLeft = d.left - (e.clientX - d.x);
  };

  return (
    <section aria-labelledby="mesa" className="bg-ink py-16 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <RichHeading
          id="mesa"
          parts={t.titleParts}
          className="font-bold uppercase leading-[0.98] tracking-[-0.035em] text-[clamp(36px,7vw,112px)]"
        />
        <p className="lead mt-8 text-[var(--mute)]">{t.sub}</p>
      </div>

      {/* escritorio: acordeon horizontal */}
      <ul className="mx-auto mt-16 hidden h-[78svh] min-h-[560px] max-w-[1600px] gap-2 px-10 md:flex" aria-label={t.title}>
        {experiences.map((x, i) => {
          const on = open === i;
          return (
            <li
              key={x.id}
              onMouseEnter={() => setOpen(i)}
              onFocusCapture={() => setOpen(i)}
              className="relative min-w-0 overflow-hidden transition-[flex-grow] duration-[900ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]"
              style={{ flexGrow: on ? 7 : 1, flexBasis: 0 }}
            >
              <div
                className="absolute inset-0 transition-transform duration-[1400ms] [transition-timing-function:var(--ease-out)]"
                style={{ transform: on ? "scale(1)" : "scale(1.18)" }}
              >
                <Photo src={x.image} alt="" sizes={on ? "60vw" : "12vw"} />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-opacity duration-700"
                style={{ background: "linear-gradient(to top, #0b0b0b 4%, rgb(11 11 11 / 0.35) 55%, rgb(11 11 11 / 0.2))", opacity: on ? 1 : 0.85 }}
              />

              {/* franja cerrada: nombre vertical */}
              <div
                className="absolute inset-x-0 bottom-0 flex justify-center pb-7 transition-opacity duration-500"
                style={{ opacity: on ? 0 : 1 }}
                aria-hidden={on}
              >
                <span className="text-sm font-semibold uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">{x.name}</span>
              </div>

              {/* franja abierta: contenido */}
              <div
                className="absolute inset-x-0 bottom-0 p-8 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out)]"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: on ? "320ms" : "0ms",
                  pointerEvents: on ? "auto" : "none",
                }}
              >
                <p className="kicker">{x.type}</p>
                <h3 className="h3 mt-2 max-w-md">{x.name}</h3>
                <p className="mt-3 max-w-md text-[15px] font-light leading-relaxed">{x.text}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Action x={x} />
                  {x.duration && <span className="text-sm font-semibold text-[var(--mute)]">{x.duration}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* celular: carrusel con arrastre */}
      <ul
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current.down = false)}
        onPointerCancel={() => (drag.current.down = false)}
        className="no-scrollbar mt-8 flex gap-3 overflow-x-auto px-5 pb-2 md:hidden"
        aria-label={t.title}
      >
        {experiences.map((x) => (
          <li key={x.id} className="relative h-[68svh] min-h-[460px] w-[82vw] shrink-0 overflow-hidden">
            <Photo src={x.image} alt="" sizes="82vw" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="kicker">{x.type}</p>
              <h3 className="h3 mt-2">{x.name}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed">{x.text}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Action x={x} />
                {x.duration && <span className="text-sm font-semibold text-[var(--mute)]">{x.duration}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showCta && (
        <div className="mx-auto mt-14 max-w-[1600px] px-5 md:px-10">
          <Link href="/bodega" className="btn btn-ghost">
            {t.cta} <Arrow />
          </Link>
        </div>
      )}
    </section>
  );
}
