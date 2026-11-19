"use client";
import dynamic from "next/dynamic";
import { gallery } from "@/content/chandon";
import LazyMount from "@/components/ui/LazyMount";
import RichHeading from "@/components/ui/RichHeading";

// El carrusel 3D se descarga solo cuando esta por aparecer.
const ThreeDPhotoCarousel = dynamic(() => import("@/components/ui/3d-carousel").then((m) => m.ThreeDPhotoCarousel), {
  ssr: false,
});

/** Galeria cilindrica 3D con las fotos de la bodega. */
export default function BodegaGallery() {
  return (
    <section aria-labelledby="galeria" className="overflow-hidden bg-ink py-16 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <RichHeading id="galeria" parts={[gallery.title]} />
      </div>
      <div className="mt-8 md:mt-20">
        <LazyMount minHeight={500}>
          <ThreeDPhotoCarousel
            images={[...gallery.images]}
            hint={gallery.hint}
            labels={{ close: gallery.close, open: gallery.open, prev: gallery.prev, next: gallery.next }}
          />
        </LazyMount>
      </div>
    </section>
  );
}
