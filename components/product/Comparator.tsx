"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { collections, common, comparator, products, productLabels, ui, type Product } from "@/content/chandon";
import { blendText } from "@/lib/format";
import { Bottle } from "@/components/ui/media";

type FilterId = (typeof comparator.filters)[number]["id"];

// Los filtros se calculan desde los datos de cada producto, no se escriben a mano.
const predicates: Record<FilterId, (p: Product) => boolean> = {
  seco: (p) => p.sweetness === "seco",
  dulce: (p) => p.sweetness === "dulce",
  hielo: (p) => p.ice,
  rose: (p) => p.rose,
};

const rows: { group: number; label: string; get: (p: Product) => string }[] = [
  { group: 0, label: productLabels.collection, get: (p) => collections[p.collection].name },
  { group: 0, label: productLabels.sweetness, get: (p) => comparator.sweetness[p.sweetness] },
  { group: 1, label: productLabels.blend, get: blendText },
  { group: 1, label: productLabels.method, get: () => common.method },
  { group: 1, label: productLabels.aging, get: (p) => p.aging },
  { group: 2, label: productLabels.temp, get: () => common.serveTemp },
  { group: 2, label: productLabels.service, get: (p) => `${p.serviceLabel}. ${p.ice ? comparator.withIce : comparator.withoutIce}.` },
  { group: 2, label: productLabels.occasion, get: (p) => p.occasion },
];

export default function Comparator() {
  const [picked, setPicked] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterId | null>(null);

  const shown = useMemo(() => (filter ? products.filter(predicates[filter]) : products), [filter]);
  const chosen = picked.map((s) => products.find((p) => p.slug === s)!).filter(Boolean);
  const full = picked.length >= 3;

  const toggle = (slug: string) =>
    setPicked((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length >= 3 ? cur : [...cur, slug]));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ui.filters}>
        {comparator.filters.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(on ? null : f.id)}
              className={`btn !min-h-10 !px-5 !text-xs ${on ? "btn-gold" : "btn-ghost"}`}
            >
              {f.label}
            </button>
          );
        })}
        {filter && (
          <button type="button" onClick={() => setFilter(null)} className="ml-2 text-sm font-semibold underline underline-offset-4 hover:text-gold">
            {comparator.clear}
          </button>
        )}
        <p className="ml-auto text-sm text-[var(--mute)]" aria-live="polite">
          {full ? comparator.max : comparator.pickHint}
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-5 gap-x-2 gap-y-10 md:gap-x-4 lg:grid-cols-10">
        {shown.map((p) => {
          const on = picked.includes(p.slug);
          const locked = full && !on;
          return (
            <li key={p.slug}>
              <button
                type="button"
                aria-pressed={on}
                aria-label={p.name}
                onClick={() => toggle(p.slug)}
                className={`group flex w-full flex-col items-center transition-opacity duration-200 ${locked ? "opacity-35" : ""}`}
              >
                <span
                  className="flex h-[clamp(150px,26vw,280px)] items-end justify-center transition-transform duration-300 [transition-timing-function:var(--ease-out)] md:group-hover:-translate-y-2"
                  style={{ transform: on ? "translateY(-10px)" : undefined }}
                >
                  <Bottle src={p.bottle} alt="" sizes="(min-width: 1024px) 9vw, 18vw" className="h-full w-auto" />
                </span>
                <span className="mt-4 block h-px w-full origin-center transition-transform duration-300" style={{ background: p.accent, transform: on ? "scaleX(1)" : "scaleX(0.25)" }} />
                <span className="mt-3 block text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.12em]">{p.short}</span>
              </button>
            </li>
          );
        })}
        {shown.length === 0 && <li className="col-span-full text-[var(--mute)]">{comparator.empty}</li>}
      </ul>

      <div className="mt-20" aria-live="polite">
        {chosen.length === 0 ? (
          <p className="max-w-md text-[var(--mute)]">{comparator.empty}</p>
        ) : (
          <div>
            <div className="grid gap-4 md:grid-cols-[170px_1fr]">
              <div className="hidden md:block" />
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${chosen.length}, minmax(0, 1fr))` }}>
                {chosen.map((p) => (
                  <div key={p.slug}>
                    <h3 className="text-[clamp(15px,1.8vw,26px)] font-semibold leading-tight tracking-tight">{p.name}</h3>
                    <Link href={`/espumantes/${p.slug}`} className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-gold underline underline-offset-4">
                      {productLabels.viewSheet}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <dl className="mt-10">
              {rows.map((r, i) => (
                <div
                  key={r.label + i}
                  className={`grid gap-x-4 gap-y-2 py-4 md:grid-cols-[170px_1fr] ${
                    i > 0 && rows[i - 1].group !== r.group ? "mt-6 border-t border-[var(--line)] pt-8" : ""
                  }`}
                >
                  <dt className="kicker !text-[11px]">{r.label}</dt>
                  <dd className="grid gap-4 text-[13px] font-light leading-snug md:text-[15px]" style={{ gridTemplateColumns: `repeat(${chosen.length}, minmax(0, 1fr))` }}>
                    {chosen.map((p) => (
                      <span key={p.slug}>{r.get(p)}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
