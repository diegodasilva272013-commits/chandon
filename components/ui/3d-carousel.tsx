"use client";

import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";

export type CarouselImage = { src: string; alt: string };
export type CarouselLabels = { close: string; open: string; prev: string; next: string };

// Usa el optimizador de next/image (webp/avif) con anchos validos del servidor.
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

const EASE = [0.32, 0.72, 0, 1] as const;

const Carousel = memo(function Carousel({
  images,
  onPick,
  active,
}: {
  images: CarouselImage[];
  onPick: (i: number) => void;
  active: boolean;
}) {
  const small = useMediaQuery("(max-width: 640px)");
  const reduce = useReducedMotion();
  const cylinderWidth = small ? 1900 : 3200;
  const n = images.length;
  const faceWidth = cylinderWidth / n;
  const radius = cylinderWidth / (2 * Math.PI);
  const rotation = useMotionValue(0);
  const dragging = useRef(false);

  // giro lento automatico cuando nadie lo toca
  useAnimationFrame((_, delta) => {
    if (!active || dragging.current || reduce) return;
    rotation.set(rotation.get() + delta * 0.0065);
  });

  return (
    <div className="flex h-full items-center justify-center" style={{ perspective: "1100px" }} aria-hidden="true">
      <motion.div
        className="relative flex h-full cursor-grab touch-pan-y justify-center active:cursor-grabbing"
        style={{ rotateY: rotation, width: cylinderWidth, transformStyle: "preserve-3d" }}
        onPanStart={() => {
          dragging.current = true;
        }}
        onPan={(_, info) => active && rotation.set(rotation.get() + info.delta.x * 0.22)}
        onPanEnd={(_, info) => {
          dragging.current = false;
          if (!active) return;
          animate(rotation, rotation.get() + info.velocity.x * 0.05, {
            type: "spring",
            stiffness: 100,
            damping: 30,
            mass: 0.1,
          });
        }}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className="absolute flex h-full items-center justify-center p-2 [backface-visibility:hidden]"
            style={{
              width: faceWidth,
              transform: `rotateY(${i * (360 / n)}deg) translateZ(${radius}px)`,
            }}
            onClick={() => onPick(i)}
          >
            <div className="block aspect-[3/4] w-full cursor-pointer overflow-hidden">
              <motion.img
                src={opt(img.src, 640)}
                alt=""
                layoutId={`img-${img.src}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
                initial={{ filter: "blur(6px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

/**
 * Carrusel cilindrico 3D (arrastrable, con visor). Adaptado de 3d-carousel para las fotos de la bodega.
 * Las caras 3D son solo para mouse y tactil; el teclado y los lectores de pantalla usan el visor con flechas.
 */
export function ThreeDPhotoCarousel({
  images,
  hint,
  labels,
}: {
  images: CarouselImage[];
  hint?: string;
  labels: CarouselLabels;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % n));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, n]);

  const current = open === null ? null : images[open];

  return (
    <div className="relative">
      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-5 md:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              key={current.src}
              layoutId={`img-${current.src}`}
              src={opt(current.src, 1920)}
              alt={current.alt}
              className="max-h-full max-w-full object-contain"
              transition={{ duration: 0.6, ease: EASE }}
            />
            <button
              type="button"
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                setOpen(null);
              }}
              className="btn btn-ghost absolute right-5 top-5 !min-h-10 !px-4 !text-xs"
            >
              {labels.close}
            </button>
            <button
              type="button"
              aria-label={labels.prev}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open - 1 + n) % n);
              }}
              className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-[var(--line)] bg-ink/60 text-bone hover:border-bone md:left-6"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M11 3 5 9l6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open + 1) % n);
              }}
              className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-[var(--line)] bg-ink/60 text-bone hover:border-bone md:right-6"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="m7 3 6 6-6 6" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-[460px] w-full overflow-hidden md:h-[600px]">
        <Carousel images={images} onPick={setOpen} active={open === null} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-ink to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-ink to-transparent" />
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        {hint && <p className="text-center text-sm font-light text-[var(--mute)]">{hint}</p>}
        <button type="button" onClick={() => setOpen(0)} className="btn btn-ghost">
          {labels.open}
        </button>
      </div>
    </div>
  );
}
