"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { home, products, collections, productLabels, common } from "@/content/chandon";
import { setupGsap, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import { Bottle } from "@/components/ui/media";

const N = products.length;
const STEP_VH = 0.75; // altura de scroll por botella
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const gradient = `linear-gradient(90deg, ${products.map((p) => p.accent).join(", ")})`;

/**
 * Escena inspirada en el reel: carrusel orbital 3D. La botella activa al frente, las demas giran
 * detras mas oscuras, el nombre gigante va DETRAS de la botella y el brillo de fondo cambia con cada una.
 * El scroll (pinned) avanza la orbita. Todo el movimiento se escribe directo en el DOM (sin re-render por frame).
 */
export default function BottleCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<(t: number) => void>(() => {});
  const tRef = useRef(0);
  const reducedRef = useRef(false);
  const stRef = useRef<{ start: number; end: number } | null>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const idx = Math.max(0, Math.min(N - 1, i));
    const st = stRef.current;
    if (reducedRef.current || !st) {
      tRef.current = idx;
      renderRef.current(idx);
      return;
    }
    const top = st.start + (idx / (N - 1)) * (st.end - st.start);
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top });
  }, []);

  useEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    let lastActive = -1;

    const render = (t: number) => {
      tRef.current = t;
      const w = window.innerWidth;
      const mobile = w < 768;
      const rx = mobile ? w * 0.34 : Math.min(w * 0.3, 520);
      const rz = mobile ? 360 : 560;
      const rounded = Math.round(t);
      if (rounded !== lastActive) {
        lastActive = rounded;
        setActive(rounded);
      }
      for (let i = 0; i < N; i++) {
        let d = i - t;
        d = ((((d + N / 2) % N) + N) % N) - N / 2; // orbita circular
        const th = (d * Math.PI * 2) / N;
        const front = clamp(1 - Math.abs(d) * 0.85);
        const x = Math.sin(th) * rx;
        const z = (Math.cos(th) - 1) * rz;
        const y = (1 - Math.cos(th)) * -26; // los traseros "flotan" mas arriba
        const tilt = -12 * front * (d >= 0 ? 1 : 1);
        const el = bottleRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${(-th * 180) / Math.PI * 0.35}deg) rotateZ(${tilt}deg) scale(${1 + front * 0.14})`;
          el.style.filter = `brightness(${0.16 + 0.84 * front})`;
          el.style.zIndex = String(Math.round((Math.cos(th) + 1) * 50));
        }
        const nm = nameRefs.current[i];
        if (nm) {
          nm.style.opacity = String(clamp(1 - Math.abs(d) * 1.15));
          nm.style.transform = `translate3d(${d * 34}vw, 0, 0)`;
        }
        const gl = glowRefs.current[i];
        if (gl) gl.style.opacity = String(clamp(1 - Math.abs(d)) * 0.7);
      }
      if (markerRef.current) markerRef.current.style.left = `${(clamp(t / (N - 1)) * 100).toFixed(2)}%`;
    };
    renderRef.current = render;
    render(0);

    const onResize = () => render(tRef.current);
    window.addEventListener("resize", onResize);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      reducedRef.current = false;
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * STEP_VH * (N - 1))}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: "power2.out" },
        onRefresh: (self) => {
          stRef.current = { start: self.start, end: self.end };
        },
        onUpdate: (self) => render(self.progress * (N - 1)),
      });
      stRef.current = { start: st.start, end: st.end };
      return () => {
        st.kill();
        stRef.current = null;
      };
    });
    mm.add(MOTION_REDUCED, () => {
      reducedRef.current = true;
      bottleRefs.current.forEach((el) => el && (el.style.transition = "transform 400ms ease, filter 400ms ease"));
      nameRefs.current.forEach((el) => el && (el.style.transition = "opacity 400ms ease"));
      glowRefs.current.forEach((el) => el && (el.style.transition = "opacity 400ms ease"));
    });

    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
    };
  }, []);

  const p = products[active];
  const c = collections[p.collection];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carrusel"
      aria-label={home.carousel.title}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (stageRef.current) stageRef.current.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 4}deg)`;
        if (namesRef.current) namesRef.current.style.transform = `translate3d(${-x * 26}px, ${-y * 10}px, 0)`;
      }}
    >
      {/* brillo ambiente por espumante, mezclado por cercania */}
      {products.map((pr, i) => (
        <div
          key={pr.slug}
          ref={(el) => {
            glowRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: i === 0 ? 0.7 : 0,
            background: `radial-gradient(ellipse 62% 58% at 50% 56%, ${pr.accent} 0%, transparent 70%)`,
          }}
        />
      ))}

      <h2 className="kicker absolute left-1/2 top-[calc(var(--nav-h)+14px)] z-30 -translate-x-1/2 text-center text-bone">
        {home.carousel.title}
      </h2>

      {/* nombre gigante detras de la botella */}
      <div ref={namesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] flex items-start transition-transform duration-500 [transition-timing-function:var(--ease-out)] pt-[calc(var(--nav-h)+7svh)] md:items-center md:pt-0">
        {products.map((pr, i) => (
          <div
            key={pr.slug}
            ref={(el) => {
              nameRefs.current[i] = el;
            }}
            className="absolute left-0 w-full select-none whitespace-nowrap text-center font-bold uppercase leading-none tracking-[-0.04em] text-bone text-[length:var(--fs-m)] md:text-[length:var(--fs)]"
            style={
              {
                "--fs-m": `${Math.min(30, 150 / pr.short.length).toFixed(2)}vw`,
                "--fs": `clamp(64px, ${Math.min(19, 150 / pr.short.length).toFixed(2)}vw, 320px)`,
                opacity: i === 0 ? 1 : 0,
              } as React.CSSProperties
            }
          >
            {pr.short}
          </div>
        ))}
      </div>

      {/* escenario 3D */}
      <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ perspective: "1300px", perspectiveOrigin: "50% 40%" }}>
        <div ref={stageRef} className="relative h-[min(60svh,620px)] w-0 transition-transform duration-500 [transition-timing-function:var(--ease-out)]" style={{ transformStyle: "preserve-3d" }}>
          {products.map((pr, i) => (
            <div
              key={pr.slug}
              ref={(el) => {
                bottleRefs.current[i] = el;
              }}
              aria-hidden={i !== active}
              className="absolute left-0 top-0 h-full will-change-transform"
              style={{ translate: "-50% 0", transformStyle: "preserve-3d" }}
            >
              <Bottle
                src={pr.bottle}
                alt={i === active ? pr.name : ""}
                sizes="(min-width: 768px) 24vw, 50vw"
                className="bob h-full w-auto max-w-none"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ficha lateral del espumante activo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-5 pb-28 pt-24 md:bg-none md:px-10 md:pb-24 md:pt-0">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-8">
          <div key={p.slug} className="fadeup pointer-events-auto max-w-[22rem]">
            <p className="kicker">{c.name}</p>
            <p className="mt-3 text-[clamp(18px,2vw,26px)] font-semibold leading-tight">{p.tagline}</p>
            <p className="mt-3 hidden text-sm font-light leading-relaxed text-[var(--mute)] md:block">{p.aromas}</p>
            <Link href={`/espumantes/${p.slug}`} className="btn btn-gold mt-5">
              {home.carousel.cta}
            </Link>
          </div>

          <dl key={`${p.slug}-d`} className="fadeup hidden max-w-[16rem] text-right md:block">
            <dt className="kicker">{productLabels.blend}</dt>
            <dd className="mt-2 text-sm font-light leading-relaxed">
              {p.blend.every((b) => b.pct !== null)
                ? p.blend.map((b) => `${b.pct}% ${b.variety}`).join(", ")
                : productLabels.unspecifiedBlend}
            </dd>
            <dt className="kicker mt-5">{productLabels.service}</dt>
            <dd className="mt-2 text-sm font-light">{p.serviceLabel}</dd>
            <dt className="kicker mt-5">{productLabels.temp}</dt>
            <dd className="mt-2 text-sm font-light">{common.serveTemp}</dd>
          </dl>
        </div>
      </div>

      {/* barra degradada + flechas */}
      <div className="absolute inset-x-0 bottom-7 z-30 flex items-center justify-center gap-5 px-5">
        <button
          type="button"
          onClick={() => goTo(Math.round(tRef.current) - 1)}
          aria-label={home.carousel.prev}
          className="grid h-11 w-11 place-items-center border border-[var(--line)] text-bone transition-colors hover:border-bone"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M11 3 5 9l6 6" />
          </svg>
        </button>

        <div className="relative h-[18px] w-[min(520px,56vw)]">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" style={{ background: gradient }} />
          <span ref={markerRef} aria-hidden="true" className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-bone" style={{ left: "0%" }} />
          <div className="absolute inset-0 flex">
            {products.map((pr, i) => (
              <button
                key={pr.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={pr.name}
                aria-current={i === active}
                className="h-full flex-1"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goTo(Math.round(tRef.current) + 1)}
          aria-label={home.carousel.next}
          className="grid h-11 w-11 place-items-center border border-[var(--line)] text-bone transition-colors hover:border-bone"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m7 3 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
