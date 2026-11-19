"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, navCta, ui } from "@/content/chandon";
import { Logo, Star } from "./brand";

export default function Nav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // El nav se achica al bajar: un centinela en el tope de la pagina evita escuchar el scroll.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCompact(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-12 w-px" />
      <header
        className="fixed inset-x-0 top-0 z-40 border-b transition-[height,background-color,border-color] duration-300"
        style={{
          height: compact ? 56 : "var(--nav-h)",
          backgroundColor: compact ? "rgb(11 11 11 / 0.62)" : "rgb(11 11 11 / 0.18)",
          borderColor: compact ? "var(--line)" : "transparent",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-10">
          <Link href="/" aria-label={ui.nav.home} className="text-bone">
            <Logo height={compact ? 17 : 21} />
          </Link>

          <nav aria-label={ui.nav.main} className="hidden items-center gap-9 md:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-bone"
                >
                  {item.label}
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300"
                    style={{ transform: active ? "scaleX(1)" : "scaleX(0)", transitionTimingFunction: "var(--ease-out)" }}
                  />
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              );
            })}
            <Link href={navCta.href} className="btn btn-gold !min-h-10 !px-5 !text-xs">
              {navCta.label}
            </Link>
          </nav>

          <button
            type="button"
            className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? ui.nav.close : ui.nav.open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-7">
              <span
                className="absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-300"
                style={{ transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-300"
                style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="menu-movil"
        inert={!open}
        className="fixed inset-0 z-30 flex flex-col justify-center bg-ink px-6 transition-[clip-path,visibility] duration-[450ms] [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] md:hidden"
        style={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", visibility: open ? "visible" : "hidden" }}
      >
        <nav aria-label={ui.nav.mobile} className="flex flex-col gap-2">
          {nav.map((item, i) => (
            <div
              key={item.href}
              className="transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out)]"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(24px)",
                transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
              }}
            >
              <Link href={item.href} className="block py-2 text-[clamp(40px,12vw,64px)] font-bold uppercase leading-none tracking-tight">
                {item.label}
              </Link>
            </div>
          ))}
          <Link href={navCta.href} className="btn btn-gold mt-8 w-fit">
            {navCta.label}
          </Link>
        </nav>
        <Star size={22} className="absolute bottom-10 right-6 text-gold" />
      </div>
    </>
  );
}
