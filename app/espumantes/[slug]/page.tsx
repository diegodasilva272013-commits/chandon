import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  byCollection,
  collections,
  common,
  getVineyard,
  method,
  productLabels,
  products,
  vineyards,
  vineyardsPage,
  getProduct,
  meta,
  ui,
} from "@/content/chandon";
import ProductHero from "@/components/product/ProductHero";
import Reveal from "@/components/ui/Reveal";
import { Bottle, Photo } from "@/components/ui/media";
import { Divider } from "@/components/ui/brand";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${p.name} | ${meta.siteName}`, description: p.tagline };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const vs = p.vineyards.map((id) => getVineyard(id)).filter((v): v is (typeof vineyards)[number] => Boolean(v));
  const hasNumbers = p.blend.some((b) => b.pct !== null);
  const others = byCollection(p.collection).filter((o) => o.slug !== p.slug);
  const col = collections[p.collection];
  const hasNotes = p.aromas.trim().length > 0;
  const hasPairing = p.occasion.trim().length > 0 || Boolean(p.pairing?.trim());
  const originImage = vs[0]?.image ?? vineyardsPage.panorama;
  const altitudeText = vs.length ? p.altitude : vineyardsPage.range;

  return (
    <>
      <ProductHero p={p} />

      {/* EN NUMEROS */}
      <section aria-labelledby="numeros" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <h2 id="numeros" className="h2">{productLabels.inNumbers}</h2>
        <div className="mt-16 grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24">
          <div>
            <h3 className="kicker">{productLabels.blend}</h3>
            <ul className="mt-8 space-y-9">
              {p.blend.map((b, i) => (
                <li key={b.variety}>
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="text-[clamp(20px,2.4vw,32px)] font-semibold tracking-tight">{b.variety}</span>
                    {b.pct !== null && (
                      <span className="text-[clamp(48px,7vw,104px)] font-bold leading-none tracking-tighter text-gold [font-variant-numeric:tabular-nums]">
                        {b.pct}
                        <span className="text-[0.4em]">%</span>
                      </span>
                    )}
                  </div>
                  {b.pct !== null && hasNumbers && (
                    <Reveal y={0} delay={i * 0.1}>
                      <div className="mt-3 h-1 origin-left bg-gold" style={{ width: `${b.pct}%` }} />
                    </Reveal>
                  )}
                </li>
              ))}
            </ul>
            {p.blendNote && <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-[var(--mute)]">{p.blendNote}</p>}
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-12 self-start">
            <div>
              <dt className="kicker">{productLabels.temp}</dt>
              <dd className="mt-3 text-[clamp(28px,3.6vw,52px)] font-semibold leading-none tracking-tight">{common.serveTemp}</dd>
            </div>
            <div>
              <dt className="kicker">{productLabels.volume}</dt>
              <dd className="mt-3 text-[clamp(28px,3.6vw,52px)] font-semibold leading-none tracking-tight">{common.volume}</dd>
            </div>
            <div>
              <dt className="kicker">{productLabels.method}</dt>
              <dd className="mt-3 text-lg font-light leading-snug">{common.method}</dd>
            </div>
            <div>
              <dt className="kicker">{productLabels.aging}</dt>
              <dd className="mt-3 text-lg font-light leading-snug">{p.aging}</dd>
            </div>
            <div className="col-span-2">
              <dt className="kicker">{productLabels.service}</dt>
              <dd className="mt-3 text-lg font-light leading-snug">{p.serviceLabel}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ORIGEN */}
      <section aria-labelledby="origen" className="grid md:grid-cols-2">
        <div className="relative min-h-[60svh] md:min-h-[80svh]">
          <Photo src={originImage} alt={vs[0] ? `${ui.vineyardPrefix} ${vs[0].name}` : ui.alt.panorama} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="flex flex-col justify-center px-5 py-20 md:px-14 lg:px-20">
          <h2 id="origen" className="kicker">{productLabels.origin}</h2>
          <p className="h2 mt-5">{p.origin}</p>
          <p className="mt-8 text-[clamp(40px,6vw,88px)] font-bold leading-none tracking-tight text-gold">{altitudeText}</p>
          {vs.length > 0 && (
            <ul className="mt-10 space-y-6">
              {vs.map((v) => (
                <li key={v.id}>
                  <p className="text-lg font-semibold">
                    {v.name} <span className="font-light text-[var(--mute)]">{v.zone}, {v.altLabel}</span>
                  </p>
                  <p className="mt-1 max-w-md text-sm font-light leading-relaxed text-[var(--mute)]">{v.soil}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* NOTAS: solo si hay contenido */}
      {hasNotes && (
        <section aria-labelledby="notas" className="relative flex min-h-[70svh] items-center overflow-hidden">
          <Photo src={p.photo} alt="" sizes="100vw" />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/70" />
          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-24 md:px-10">
            <h2 id="notas" className="kicker">{productLabels.aromas}</h2>
            <Reveal>
              <p className="h2 mt-6 max-w-5xl">{p.aromas}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* MARIDAJE Y OCASION */}
      {hasPairing && (
        <section aria-labelledby="maridaje" className="on-bone px-5 py-28 md:px-10 md:py-40">
          <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1fr_1.4fr]">
            <h2 id="maridaje" className="h2">{productLabels.pairing}</h2>
            <div className="space-y-8">
              <Reveal>
                <p className="text-[clamp(24px,3vw,44px)] font-semibold leading-tight tracking-tight">{p.occasion}</p>
              </Reveal>
              {p.pairing && (
                <Reveal delay={0.1}>
                  <p className="lead">{p.pairing}</p>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROCESO */}
      <section aria-labelledby="proceso" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <h2 id="proceso" className="h2">{productLabels.process}</h2>
        <ol className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-5 md:gap-x-6">
          {method.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.07}>
              <div className="relative aspect-square w-full bg-bone">
                <Photo src={s.icon} alt="" sizes="(min-width: 768px) 18vw, 45vw" className="!object-contain p-3" />
              </div>
              <h3 className="mt-5 text-base font-semibold leading-tight md:text-lg">
                <span className="sr-only">{s.n}. </span>
                {s.title}
              </h3>
            </Reveal>
          ))}
        </ol>
      </section>

      <div className="flex justify-center">
        <Divider />
      </div>

      {/* OTROS DE LA COLECCION */}
      {others.length > 0 && (
        <section aria-labelledby="otros" className="mx-auto max-w-[1600px] px-5 pb-32 pt-20 md:px-10">
          <p className="kicker">{col.name}</p>
          <h2 id="otros" className="h2 mt-3">{productLabels.others}</h2>
          <ul className="mt-14 flex items-end gap-6 md:gap-12">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/espumantes/${o.slug}`} className="group block transition-transform duration-300 [transition-timing-function:var(--ease-out)] md:hover:-translate-y-3">
                  <Bottle src={o.bottle} alt={o.name} sizes="(min-width: 768px) 14vw, 30vw" className="h-[clamp(240px,36vw,520px)] w-auto" />
                  <span className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em]">{o.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
