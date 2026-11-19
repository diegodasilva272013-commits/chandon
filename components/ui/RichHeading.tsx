"use client";
import { useLayoutEffect, useRef } from "react";
import { setupGsap, MOTION_OK } from "@/lib/gsap";
import { Photo } from "./media";

export type HeadingPart = string | { readonly img: string };

/**
 * Titular con efectos:
 *  - palabras que suben desde una mascara (modo entrada) o se encienden de a una con el scroll (scrub)
 *  - imagenes incrustadas dentro del titular que se abren con clip-path
 */
export default function RichHeading({
  parts,
  as: Tag = "h2",
  className = "h2",
  scrub = false,
  id,
}: {
  parts: readonly HeadingPart[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  scrub?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = setupGsap();
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const words = el.querySelectorAll<HTMLElement>(".rw");
      const imgs = el.querySelectorAll<HTMLElement>(".ri");
      const inner = el.querySelectorAll<HTMLElement>(".ri > span");
      if (scrub) {
        gsap.set(imgs, { clipPath: "inset(0 100% 0 0)" });
        const dim = ScrollTrigger.create({
          trigger: el,
          start: "top bottom+=500",
          once: true,
          onEnter: () => gsap.set(words, { opacity: 0.12 }),
        });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: 0.6 },
        });
        const total = words.length + imgs.length;
        // palabras e imagenes se encienden en el orden en que aparecen
        el.querySelectorAll<HTMLElement>(".rw, .ri").forEach((node, i) => {
          if (node.classList.contains("ri")) {
            tl.to(node, { clipPath: "inset(0 0% 0 0)", duration: 1.4 }, i / total * 6);
          } else {
            tl.fromTo(node, { opacity: 0.12 }, { opacity: 1, duration: 1, immediateRender: false }, (i / total) * 6);
          }
        });
        return () => {
          dim.kill();
          tl.scrollTrigger?.kill();
        };
      }
      gsap.set(words, { yPercent: 118 });
      gsap.set(imgs, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(inner, { scale: 1.5 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.to(words, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.055 })
        .to(imgs, { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power3.inOut", stagger: 0.12 }, 0.2)
        .to(inner, { scale: 1, duration: 1.6, ease: "power3.out", stagger: 0.12 }, 0.2);
      return () => tl.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, [parts, scrub]);

  return (
    <Tag ref={ref as never} id={id} className={className}>
      {parts.map((part, pi) =>
        typeof part === "string" ? (
          part.split(" ").map((w, wi) => (
            <span key={`${pi}-${wi}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span className="rw inline-block will-change-transform">{w}</span>
              {" "}
            </span>
          ))
        ) : (
          <span
            key={pi}
            aria-hidden="true"
            className="ri relative mx-[0.08em] inline-block h-[0.72em] w-[1.5em] overflow-hidden align-[-0.04em]"
          >
            <span className="absolute inset-0 block will-change-transform">
              <Photo src={part.img} alt="" sizes="30vw" />
            </span>
          </span>
        ),
      )}
    </Tag>
  );
}
