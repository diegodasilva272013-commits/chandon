import type { Metadata } from "next";
import { historyPage, meta, nav, timeline, ui } from "@/content/chandon";
import { Photo } from "@/components/ui/media";
import Reveal from "@/components/ui/Reveal";
import { Star } from "@/components/ui/brand";

export const metadata: Metadata = { title: `${nav[3].label} | ${meta.siteName}`, description: historyPage.sub };

export default function HistoriaPage() {
  const h = historyPage;
  return (
    <>
      <section className="relative flex min-h-[88svh] items-end overflow-hidden">
        <Photo src={h.image} alt={ui.alt.historia} priority sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
          <h1 className="display">{h.title}</h1>
          <p className="lead mt-6">{h.sub}</p>
        </div>
      </section>

      <section aria-label={ui.timeline} className="on-bone px-5 py-28 md:px-10 md:py-40">
        <ol className="relative mx-auto max-w-[1600px]">
          <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-2 w-px bg-ink/25 md:left-[calc(34%+11px)]" />
          {timeline.map((t) => (
            <li key={t.year + t.title} className="relative grid gap-3 pb-20 pl-10 md:grid-cols-[34%_1fr] md:gap-0 md:pb-28 md:pl-0">
              <Reveal className="md:pr-16 md:text-right">
                <p className="text-[clamp(44px,8vw,128px)] font-bold leading-[0.9] tracking-[-0.04em] [font-variant-numeric:tabular-nums]">
                  {t.year}
                </p>
              </Reveal>
              <span aria-hidden="true" className="absolute left-0 top-3 text-gold-deep md:left-[34%] md:top-[0.9em]">
                <Star size={24} />
              </span>
              <Reveal delay={0.08} className="md:pl-16">
                <h2 className="h3">{t.title}</h2>
                <p className="lead mt-4">{t.text}</p>
                {t.image && (
                  <div className="relative mt-8 aspect-[16/10] w-full max-w-2xl overflow-hidden">
                    <Photo src={t.image} alt="" sizes="(min-width: 768px) 45vw, 90vw" />
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
