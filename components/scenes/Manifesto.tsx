import Link from "next/link";
import { home, nav } from "@/content/chandon";
import RichHeading from "@/components/ui/RichHeading";

/** Manifiesto sobre crema: el titular se enciende palabra por palabra con el scroll y abre fotos dentro del texto. */
export default function Manifesto() {
  return (
    <section aria-label={home.manifesto.cta} className="on-bone px-5 py-32 md:px-10 md:py-52">
      <div className="mx-auto max-w-[1600px]">
        <RichHeading
          as="p"
          scrub
          parts={home.manifesto.parts}
          className="font-bold uppercase leading-[0.98] tracking-[-0.035em] text-[clamp(40px,8.2vw,132px)]"
        />
        <Link href={nav[2].href} className="btn btn-ghost mt-14">
          {home.manifesto.cta}
        </Link>
      </div>
    </section>
  );
}
