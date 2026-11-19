"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { setupGsap, MOTION_REDUCED } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Scroll suave tipo Apple, sincronizado con ScrollTrigger. Se apaga con reduced-motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia(MOTION_REDUCED).matches) return;
    const { gsap, ScrollTrigger } = setupGsap();
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
