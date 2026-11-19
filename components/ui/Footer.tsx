import Link from "next/link";
import { brand, home, nav, ui } from "@/content/chandon";
import FooterWordmark from "./FooterWordmark";
import { Logo, Star } from "./brand";

export default function Footer() {
  return (
    <footer className="relative z-0 bg-ink px-5 pb-6 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <Link
          href="/bodega"
          className="group relative block overflow-hidden border-y border-[var(--line)] py-14 md:py-24"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-[800ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
          <span className="relative flex items-center justify-between gap-6 px-1 transition-colors duration-500 group-hover:text-ink group-focus-visible:text-ink md:px-6">
            <span className="text-[clamp(36px,8.6vw,150px)] font-bold uppercase leading-[0.92] tracking-[-0.04em] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3">
              {home.experiences.cta}
            </span>
            <svg className="hidden h-[clamp(40px,7vw,110px)] w-[clamp(40px,7vw,110px)] shrink-0 transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-2 group-hover:translate-x-2 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M5 19 19 5M8 5h11v11" />
            </svg>
          </span>
        </Link>
        <div className="pt-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo height={30} />
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-[var(--mute)]">
              {brand.legalName}, parte de {brand.group}.
            </p>
          </div>

          <div>
            <h2 className="kicker">{ui.footer.winery}</h2>
            <address className="mt-5 text-sm font-light not-italic leading-relaxed">
              {brand.address.winery}
              <br />
              <a className="mt-2 inline-block underline underline-offset-4 hover:text-gold" href={brand.address.wineryMaps} target="_blank" rel="noopener noreferrer">
                {ui.viewMap}
              </a>
            </address>
            <h2 className="kicker mt-8">{ui.footer.office}</h2>
            <address className="mt-5 text-sm font-light not-italic leading-relaxed">
              {brand.address.office}
              <br />
              <a className="mt-2 inline-block underline underline-offset-4 hover:text-gold" href={brand.address.officeMaps} target="_blank" rel="noopener noreferrer">
                {ui.viewMap}
              </a>
            </address>
          </div>

          <div>
            <h2 className="kicker">{ui.footer.contact}</h2>
            <ul className="mt-5 space-y-2 text-sm font-light leading-relaxed">
              <li><a className="hover:text-gold" href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`}>{brand.phone}</a></li>
              <li><a className="hover:text-gold" href={`tel:${brand.consumerLine.replace(/\D/g, "")}`}>{brand.consumerLine}</a></li>
              <li><a className="hover:text-gold" href={`mailto:${brand.email}`}>{brand.email}</a></li>
              <li><a className="hover:text-gold" href={`mailto:${brand.visits.email}`}>{brand.visits.email}</a></li>
              <li><a className="hover:text-gold" href={brand.visits.whatsapp} target="_blank" rel="noopener noreferrer">{ui.whatsapp} {brand.visits.whatsappLabel}</a></li>
            </ul>
          </div>

          <div>
            <h2 className="kicker">{ui.footer.site}</h2>
            <ul className="mt-5 space-y-2 text-sm font-light">
              {nav.map((n) => (
                <li key={n.href}><Link className="hover:text-gold" href={n.href}>{n.label}</Link></li>
              ))}
              <li><a className="hover:text-gold" href={brand.instagram} target="_blank" rel="noopener noreferrer">{ui.instagram}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-[var(--line)] pt-8 text-xs text-[var(--mute)] md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 text-sm font-semibold text-bone">
            <Star size={14} className="text-gold" />
            {brand.legal}
          </p>
          <p>© {new Date().getFullYear()} {brand.copyright}</p>
        </div>
        </div>
        <FooterWordmark />
      </div>
    </footer>
  );
}
