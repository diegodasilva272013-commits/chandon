"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sphere } from "@/content/chandon";
import LazyMount from "@/components/ui/LazyMount";

// La esfera (y su JS) se descarga solo cuando esta por aparecer.
const SphereImageGrid = dynamic(() => import("@/components/ui/img-sphere"), { ssr: false });
import RichHeading from "@/components/ui/RichHeading";
import { useReducedMotionPref } from "@/lib/useMotion";

// Se duplica el set para que la esfera quede llena sin huecos.
const photos = [...sphere.images, ...sphere.images.map((i) => ({ ...i, id: `${i.id}b` }))];

/** Seccion con la esfera 3D de fotos. Se ajusta al ancho de pantalla. */
export default function PhotoSphere() {
  const reduced = useReducedMotionPref();
  const [size, setSize] = useState(640);

  useEffect(() => {
    const fit = () => setSize(Math.max(300, Math.min(window.innerWidth - 16, 820)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section aria-labelledby="esfera" className="relative overflow-hidden bg-ink py-16 md:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[58%] aspect-square w-[90vmin] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgb(215 166 99 / 0.2) 0%, transparent 62%)" }}
      />
      <div className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
        <RichHeading id="esfera" parts={[sphere.title]} className="h2 mx-auto max-w-4xl" />
      </div>
      <div className="relative mt-6 flex justify-center md:mt-16">
        <LazyMount minHeight={size}>
        <SphereImageGrid
          images={photos}
          containerSize={size}
          sphereRadius={size * (size < 500 ? 0.4 : 0.43)}
          baseImageScale={size < 500 ? 0.3 : 0.22}
          dragSensitivity={0.7}
          momentumDecay={0.96}
          maxRotationSpeed={6}
          perspective={1000}
          autoRotate={reduced === false}
          autoRotateSpeed={0.22}
          closeLabel={sphere.close}
        />
        </LazyMount>
      </div>
      <p className="relative mt-8 text-center text-sm font-light text-[var(--mute)]">{sphere.hint}</p>
    </section>
  );
}
