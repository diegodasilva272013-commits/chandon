import type { Metadata } from "next";
import { meta } from "@/content/chandon";
import { nav, ui, vineyards, vineyardsPage } from "@/content/chandon";
import { Photo } from "@/components/ui/media";
import Reveal from "@/components/ui/Reveal";
import ChefDeCave from "@/components/scenes/ChefDeCave";

export const metadata: Metadata = { title: `${nav[2].label} | ${meta.siteName}`, description: vineyardsPage.title };

export default function VinedosPage() {
  const v = vineyardsPage;
  return (
    <>
      <section className="on-bone px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="display !text-[clamp(44px,8.4vw,128px)] !normal-case !leading-[0.92]">{v.title}</h1>
          <p className="lead mt-10">{v.range}</p>
        </div>
      </section>

      <div className="relative h-[70svh] w-full">
        <Photo src={v.panorama} alt={ui.alt.panorama} sizes="100vw" priority />
      </div>

      <section className="on-bone px-5 py-24 md:px-10 md:py-36" aria-label={ui.varieties}>
        <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1.2fr_1fr]">
          <ul className="grid gap-8 sm:grid-cols-2">
            {v.plantings.map((pl) => (
              <Reveal as="li" key={pl.variety}>
                <p className="text-[clamp(64px,10vw,160px)] font-bold leading-none tracking-tighter [font-variant-numeric:tabular-nums]">
                  {pl.ha}
                </p>
                <p className="kicker mt-3">{v.haUnit}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{pl.variety}</p>
              </Reveal>
            ))}
          </ul>
          <p className="lead self-end">{v.varieties}</p>
        </div>
      </section>

      <section aria-labelledby="cuatro" className="bg-ink px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1600px]">
          <h2 id="cuatro" className="h2">{v.listTitle}</h2>
          <ul className="mt-16 space-y-24 md:space-y-32">
            {vineyards.map((vy) => (
              <li key={vy.id}>
                <Reveal>
                  <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
                    <Photo src={vy.image} alt={`${ui.vineyardPrefix} ${vy.name}`} sizes="100vw" />
                  </div>
                  <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr] md:gap-16">
                    <div>
                      <p className="kicker">{vy.zone}</p>
                      <h3 className="h2 mt-3">{vy.name}</h3>
                    </div>
                    <div className="self-end">
                      <p className="text-[clamp(36px,5vw,72px)] font-bold leading-none tracking-tight text-gold">{vy.altLabel}</p>
                      <p className="lead mt-5">{vy.soil}</p>
                      <p className="mt-3 text-sm font-light text-[var(--mute)]">{vy.note}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ChefDeCave />
    </>
  );
}
