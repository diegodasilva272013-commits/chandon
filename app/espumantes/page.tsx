import type { Metadata } from "next";
import { comparator, espumantesPage, meta } from "@/content/chandon";
import Comparator from "@/components/product/Comparator";

export const metadata: Metadata = { title: `${espumantesPage.title} | ${meta.siteName}`, description: espumantesPage.sub };

export default function EspumantesPage() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <h1 className="display">{espumantesPage.title}</h1>
      <p className="lead mt-8 text-[var(--mute)]">{espumantesPage.sub}</p>
      <h2 className="h3 mt-20 md:mt-28">{comparator.title}</h2>
      <div className="mt-10">
        <Comparator />
      </div>
    </section>
  );
}
