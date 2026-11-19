import type { Metadata } from "next";
import { bodegaPage, brand, meta, ui } from "@/content/chandon";
import { Photo } from "@/components/ui/media";
import Experiences from "@/components/scenes/Experiences";
import BodegaGallery from "@/components/scenes/BodegaGallery";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = { title: `${bodegaPage.title} | ${meta.siteName}`, description: bodegaPage.sub };

export default function BodegaPage() {
  const b = bodegaPage;
  return (
    <>
      <section className="relative flex min-h-[88svh] items-end overflow-hidden">
        <Photo src={b.hero} alt={ui.alt.bodega} priority sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
          <h1 className="display">{b.title}</h1>
          <p className="lead mt-6">{b.sub}</p>
        </div>
      </section>

      <BodegaGallery />

      <Experiences showCta={false} />

      {/* Bistro */}
      <section aria-labelledby="bistro" className="relative flex min-h-[90svh] items-center overflow-hidden">
        <Photo src={b.cava} alt={ui.alt.cava} sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-24 md:px-10">
          <Reveal>
            <h2 id="bistro" className="h2 max-w-3xl">{b.bistro.title}</h2>
            <p className="lead mt-8">{b.bistro.text}</p>
            <p className="mt-6 max-w-[52ch] text-sm font-light leading-relaxed text-[var(--mute)]">{b.bistro.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Como llegar */}
      <section aria-labelledby="llegar" className="on-bone px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto grid max-w-[1600px] gap-14 md:grid-cols-2">
          <div>
            <h2 id="llegar" className="h2">{b.howTo.title}</h2>
            <address className="mt-10 text-[clamp(22px,2.6vw,36px)] font-semibold not-italic leading-tight tracking-tight">
              {brand.address.winery}
            </address>
            <p className="lead mt-5">{brand.address.distance}</p>
            <a href={brand.address.wineryMaps} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-10">
              {b.howTo.map}
              <span className="sr-only">, {ui.newTab}</span>
            </a>
          </div>
          <div className="self-end">
            <h3 className="kicker">{b.howTo.contact}</h3>
            <ul className="mt-5 space-y-2 text-lg font-light">
              <li><a className="underline underline-offset-4" href={`mailto:${brand.visits.email}`}>{brand.visits.email}</a></li>
              <li><a className="underline underline-offset-4" href={brand.visits.whatsapp} target="_blank" rel="noopener noreferrer">{ui.whatsapp} {brand.visits.whatsappLabel}</a></li>
              <li><a className="underline underline-offset-4" href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`}>{brand.phone}</a></li>
            </ul>
            <a href={brand.visits.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-10">
              {b.contactCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
