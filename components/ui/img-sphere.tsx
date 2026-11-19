"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * SphereImageGrid: esfera 3D de imagenes (distribucion de Fibonacci), con arrastre, inercia,
 * giro automatico y visor. Adaptado para Chandon: sin lucide-react, tema oscuro de marca,
 * pausa fuera de pantalla, sin bloquear el scroll vertical en celular.
 */

export interface Position3D {
  x: number;
  y: number;
  z: number;
}
export interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}
export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}
export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}
export interface SphereImageGridProps {
  images?: readonly ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  closeLabel?: string;
  className?: string;
}

const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
const rad = (d: number) => d * (Math.PI / 180);
const norm = (a: number) => {
  while (a > 180) a -= 360;
  while (a < -180) a += 360;
  return a;
};

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  closeLabel = "Close",
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [inView, setInView] = useState(true);
  const [rotation, setRotation] = useState({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const [positions, setPositions] = useState<SphericalPosition[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const touching = useRef(false);

  const R = sphereRadius || containerSize * 0.5;
  const baseSize = containerSize * baseImageScale;

  const generate = useCallback((): SphericalPosition[] => {
    const out: SphericalPosition[] = [];
    const n = images.length;
    const golden = (1 + Math.sqrt(5)) / 2;
    const inc = (2 * Math.PI) / golden;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = inc * i;
      let phi = inclination * (180 / Math.PI);
      let theta = (azimuth * (180 / Math.PI)) % 360;
      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      phi = phi < 90 ? Math.max(5, phi - poleBonus) : Math.min(175, phi + poleBonus);
      phi = 15 + (phi / 180) * 150;
      // desfase determinista (sin Math.random) para que no cambie entre renders
      theta = (theta + ((i * 37) % 20) - 10) % 360;
      phi = Math.max(0, Math.min(180, phi + ((i * 17) % 10) - 5));
      out.push({ theta, phi, radius: R });
    }
    return out;
  }, [images.length, R]);

  const world = useCallback((): WorldPosition[] => {
    const base = positions.map((pos, index) => {
      const th = rad(pos.theta);
      const ph = rad(pos.phi);
      const rx = rad(rotation.x);
      const ry = rad(rotation.y);
      let x = pos.radius * Math.sin(ph) * Math.cos(th);
      let y = pos.radius * Math.cos(ph);
      let z = pos.radius * Math.sin(ph) * Math.sin(th);
      const x1 = x * Math.cos(ry) + z * Math.sin(ry);
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
      x = x1;
      z = z1;
      const y2 = y * Math.cos(rx) - z * Math.sin(rx);
      const z2 = y * Math.sin(rx) + z * Math.cos(rx);
      y = y2;
      z = z2;

      const fadeStart = -10;
      const fadeEnd = -30;
      const isVisible = z > fadeEnd;
      let fadeOpacity = 1;
      if (z <= fadeStart) fadeOpacity = Math.max(0, (z - fadeEnd) / (fadeStart - fadeEnd));

      const isPole = pos.phi < 30 || pos.phi > 150;
      const dist = Math.min(Math.sqrt(x * x + y * y) / R, 1);
      const centerScale = Math.max(0.3, 1 - dist * (isPole ? 0.4 : 0.7));
      const depthScale = (z + R) / (2 * R);
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);
      return { x, y, z, scale, zIndex: Math.round(1000 + z), isVisible, fadeOpacity, originalIndex: index };
    });

    const adj = [...base];
    for (let i = 0; i < adj.length; i++) {
      const p = adj[i];
      if (!p.isVisible) continue;
      let s = p.scale;
      const size = baseSize * s;
      for (let j = 0; j < adj.length; j++) {
        if (i === j) continue;
        const o = adj[j];
        if (!o.isVisible) continue;
        const d = Math.hypot(p.x - o.x, p.y - o.y);
        const min = (size + baseSize * o.scale) / 2 + 25;
        if (d < min && d > 0) {
          const overlap = min - d;
          s = Math.min(s, s * Math.max(0.4, 1 - (overlap / min) * 0.6));
        }
      }
      adj[i] = { ...p, scale: Math.max(0.25, s) };
    }
    return adj;
  }, [positions, rotation, R, baseSize]);

  const clamp = useCallback((v: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, v)), [maxRotationSpeed]);

  const tick = useCallback(() => {
    if (isDragging) return;
    setVelocity((prev) => {
      const v = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
      if (!autoRotate && Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01) return { x: 0, y: 0 };
      return v;
    });
    setRotation((prev) => {
      let y = prev.y;
      if (autoRotate) y += autoRotateSpeed;
      y += clamp(velocity.y);
      return { x: norm(prev.x + clamp(velocity.x)), y: norm(y), z: prev.z };
    });
  }, [isDragging, momentumDecay, velocity, clamp, autoRotate, autoRotateSpeed]);

  const applyDelta = useCallback(
    (clientX: number, clientY: number, horizontalOnly: boolean) => {
      const dx = clientX - last.current.x;
      const dy = horizontalOnly ? 0 : clientY - last.current.y;
      const d = { x: -dy * dragSensitivity, y: dx * dragSensitivity };
      setRotation((p) => ({ x: norm(p.x + clamp(d.x)), y: norm(p.y + clamp(d.y)), z: p.z }));
      setVelocity({ x: clamp(d.x), y: clamp(d.y) });
      last.current = { x: clientX, y: clientY };
    },
    [dragSensitivity, clamp],
  );

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    touching.current = false;
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    last.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touching.current = true;
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    last.current = { x: t.clientX, y: t.clientY };
  }, []);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setPositions(generate()), [generate]);

  // pausa la animacion cuando la esfera no se ve
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !inView) return;
    const loop = () => {
      tick();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isMounted, inView, tick]);

  useEffect(() => {
    if (!isMounted) return;
    const move = (e: MouseEvent) => isDragging && !touching.current && applyDelta(e.clientX, e.clientY, false);
    const tmove = (e: TouchEvent) => isDragging && touching.current && applyDelta(e.touches[0].clientX, e.touches[0].clientY, true);
    const up = () => setIsDragging(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", tmove, { passive: true });
    document.addEventListener("touchend", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", tmove);
      document.removeEventListener("touchend", up);
    };
  }, [isMounted, isDragging, applyDelta]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const wp = world();

  if (!isMounted) {
    return <div className="bg-ink-2" style={{ width: containerSize, height: containerSize }} aria-hidden="true" />;
  }
  if (!images.length) return null;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative cursor-grab select-none touch-pan-y active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective: `${perspective}px` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="relative h-full w-full" style={{ zIndex: 10 }}>
          {images.map((image, index) => {
            const p = wp[index];
            if (!p || !p.isVisible) return null;
            const size = baseSize * p.scale;
            const isHovered = hovered === index;
            const finalScale = isHovered ? Math.min(1.2, 1.2 / p.scale) : 1;
            return (
              <button
                type="button"
                key={image.id}
                aria-label={image.title ?? image.alt}
                className="absolute block cursor-pointer select-none transition-transform duration-200 ease-out"
                style={{
                  width: size,
                  height: size,
                  left: containerSize / 2 + p.x,
                  top: containerSize / 2 + p.y,
                  opacity: p.fadeOpacity,
                  transform: `translate(-50%, -50%) scale(${finalScale})`,
                  zIndex: p.zIndex,
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(image)}
              >
                <span className="relative block h-full w-full overflow-hidden border border-bone/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={opt(image.src, 256)}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title ?? selected.alt}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-4"
          onClick={() => setSelected(null)}
          style={{ animation: "sphereFade 0.3s var(--ease-out)" }}
        >
          <div
            className="w-full max-w-md overflow-hidden bg-ink-2 text-bone"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "sphereScale 0.35s var(--ease-out)" }}
          >
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opt(selected.src, 1080)} alt={selected.alt} className="h-full w-full object-cover" />
              <button
                type="button"
                autoFocus
                onClick={() => setSelected(null)}
                aria-label={closeLabel}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-ink/70 text-bone transition-colors hover:bg-ink"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="m3 3 10 10M13 3 3 13" />
                </svg>
              </button>
            </div>
            {(selected.title || selected.description) && (
              <div className="p-6">
                {selected.title && <h3 className="text-xl font-semibold tracking-tight">{selected.title}</h3>}
                {selected.description && <p className="mt-2 text-sm font-light leading-relaxed text-[var(--mute)]">{selected.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SphereImageGrid;
