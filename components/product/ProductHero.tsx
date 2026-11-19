"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { collections, type Product } from "@/content/chandon";
import { Bottle } from "@/components/ui/media";

/** Hero negro de la ficha: botella gigante que sube y se agranda con el scroll, nombre gigante detras. */
export default function ProductHero({ p }: { p: Product }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -140]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.18]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-4, 4]);
  const nameY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 58% at 50% 58%, ${p.accent}b3 0%, transparent 70%)` }}
      />
      <motion.div
        aria-hidden="true"
        style={{ y: nameY, fontSize: `clamp(64px, ${Math.min(19, 150 / p.short.length)}vw, 320px)` }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-bold uppercase leading-none tracking-[-0.04em]"
      >
        {p.short}
      </motion.div>

      <motion.div
        style={{ y, scale, rotate }}
        initial={reduce ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 h-[min(72svh,760px)]"
      >
        <Bottle src={p.bottle} alt={p.name} priority sizes="(min-width: 768px) 30vw, 60vw" className="h-full w-auto" />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/70 to-transparent px-5 pb-10 pt-24 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">{collections[p.collection].name}</p>
            <h1 className="h3 mt-2">{p.name}</h1>
          </div>
          <p className="max-w-md text-[clamp(16px,1.6vw,22px)] font-light leading-snug md:text-right">{p.tagline}</p>
        </div>
      </div>
    </section>
  );
}
