"use client";
import { useEffect, useRef } from "react";

type Bubble = { x: number; y: number; r: number; v: number; wob: number; ph: number; a: number };

/**
 * Burbujas sutiles en canvas. `intensity` (0 a 1) se lee en cada frame desde un ref
 * mutable: el padre lo sube en el paso de segunda fermentacion. Sin re-render de React.
 */
export default function Bubbles({ intensity, paused = false }: { intensity: { current: number }; paused?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const MAX = 180;
    const bubbles: Bubble[] = [];

    const spawn = (fromBottom: boolean): Bubble => ({
      x: Math.random() * w,
      y: fromBottom ? h + Math.random() * 40 : Math.random() * h,
      r: 1 + Math.random() * 4.2,
      v: 0.25 + Math.random() * 0.9,
      wob: 0.4 + Math.random() * 1.2,
      ph: Math.random() * Math.PI * 2,
      a: 0.18 + Math.random() * 0.4,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    for (let i = 0; i < MAX; i++) bubbles.push(spawn(false));

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    window.addEventListener("resize", resize);

    let t = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || paused) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const active = Math.floor(30 + intensity.current * (MAX - 30));
      const speed = 0.6 + intensity.current * 1.8;
      for (let i = 0; i < active; i++) {
        const b = bubbles[i];
        b.y -= b.v * speed;
        b.x += Math.sin(t * b.wob + b.ph) * 0.3;
        if (b.y < -10) Object.assign(b, spawn(true));
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(215,166,99,${b.a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    if (reduce) {
      // un solo cuadro estatico
      const active = 50;
      for (let i = 0; i < active; i++) {
        const b = bubbles[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(215,166,99,${b.a})`;
        ctx.stroke();
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [intensity, paused]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
